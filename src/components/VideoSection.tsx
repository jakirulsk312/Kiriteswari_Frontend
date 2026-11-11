import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Youtube } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";
import SectionHeading from "./SectionHeading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VideoItem = {
  _id?: string;
  title?: TextValue;
  description?: TextValue;
  link: string;
};

const VIDEOS_PER_PAGE = 4;

const getYouTubeId = (link: string) => {
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    let videoId: string | null = null;
    if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    else {
      if (!["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) return null;
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (url.pathname === "/watch") videoId = url.searchParams.get("v");
      else if (["embed", "shorts", "live"].includes(pathParts[0] || "")) videoId = pathParts[1] || null;
    }

    return videoId && /^[\w-]{6,20}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
};

const isSafeVideoLink = (link: string) => {
  try {
    const url = new URL(link);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const VideoSection = () => {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [page, setPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      try {
        const response = await apiRequest<{ data?: VideoItem[] }>("/videos");
        if (active) {
          setVideos(Array.isArray(response.data)
            ? response.data.filter((video) => video.link?.trim() && isSafeVideoLink(video.link))
            : []);
        }
      } catch (error) {
        console.error("Failed to load temple videos", error);
      }
    };

    loadVideos();
    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const visibleVideos = videos.slice((page - 1) * VIDEOS_PER_PAGE, page * VIDEOS_PER_PAGE);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById("videos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="videos" className="section-padding scroll-mt-24 bg-gradient-section">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "ভিডিও", en: "Videos", hi: "वीडियो" })}
          subtitle={languageText(language, {
            bn: "মন্দিরের পূজা, উৎসব ও বিশেষ মুহূর্তের ভিডিও দেখুন।",
            en: "Watch videos of temple worship, festivals, and special moments.",
            hi: "मंदिर की पूजा, उत्सव और विशेष पलों के वीडियो देखें।",
          })}
        />

        {visibleVideos.length ? (
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6">
            {visibleVideos.map((video) => {
              const videoId = getYouTubeId(video.link);
              const title = getLocalizedText(video.title, language) ||
                languageText(language, { bn: "মন্দিরের ভিডিও", en: "Temple video", hi: "मंदिर का वीडियो" });

              return (
                <article
                  key={video._id || video.link}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
                >
                  {videoId ? (
                    <button
                      type="button"
                      onClick={() => setSelectedVideo(video)}
                      aria-label={`${languageText(language, { bn: "ভিডিও চালান", en: "Play video", hi: "वीडियो चलाएँ" })}: ${title}`}
                      className="group relative block aspect-video w-full overflow-hidden bg-temple-dark text-left"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                          <Play size={26} fill="currentColor" />
                        </span>
                      </span>
                    </button>
                  ) : (
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex aspect-video w-full items-center justify-center bg-temple-dark text-white"
                      aria-label={`${languageText(language, { bn: "ভিডিও খুলুন", en: "Open video", hi: "वीडियो खोलें" })}: ${title}`}
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg">
                        <Play size={26} fill="currentColor" />
                      </span>
                    </a>
                  )}
                  <div className="p-3.5 sm:p-4">
                    <h3 className="line-clamp-2 font-display text-base font-bold text-foreground sm:text-lg">{title}</h3>
                    {getLocalizedText(video.description, language) && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {getLocalizedText(video.description, language)}
                      </p>
                    )}
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Youtube size={15} />
                      {languageText(language, { bn: "YouTube-এ দেখুন", en: "Watch on YouTube", hi: "YouTube पर देखें" })}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            {languageText(language, {
              bn: "শীঘ্রই এখানে মন্দিরের ভিডিও যোগ করা হবে।",
              en: "Temple videos will be added here soon.",
              hi: "मंदिर के वीडियो जल्द ही यहाँ जोड़े जाएँगे।",
            })}
          </p>
        )}

        {totalPages > 1 && (
          <nav
            aria-label={languageText(language, { bn: "ভিডিও পৃষ্ঠা", en: "Video pages", hi: "वीडियो पृष्ठ" })}
            className="mt-7 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              {languageText(language, { bn: "আগের", en: "Prev", hi: "पिछला" })}
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => changePage(pageNumber)}
                aria-label={`${languageText(language, { bn: "পৃষ্ঠা", en: "Page", hi: "पृष्ठ" })} ${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`min-w-9 rounded-md border px-3 py-2 text-sm ${
                  pageNumber === page
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              {languageText(language, { bn: "পরের", en: "Next", hi: "अगला" })}
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>

      <Dialog open={selectedVideo !== null} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        {selectedVideo && (
          <DialogContent className="w-[calc(100vw-1.5rem)] max-w-5xl gap-3 p-3 sm:w-[calc(100vw-3rem)] sm:p-5">
            <DialogHeader className="pr-8">
              <DialogTitle className="line-clamp-2 text-base sm:text-lg">
                {getLocalizedText(selectedVideo.title, language) ||
                  languageText(language, { bn: "মন্দিরের ভিডিও", en: "Temple video", hi: "मंदिर का वीडियो" })}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {languageText(language, { bn: "ভিডিও প্লেয়ার", en: "Video player", hi: "वीडियो प्लेयर" })}
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              {getYouTubeId(selectedVideo.link) && (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(selectedVideo.link)}?autoplay=1&rel=0`}
                  title={getLocalizedText(selectedVideo.title, language) || "Temple video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {getLocalizedText(selectedVideo.description, language) && (
                <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                  {getLocalizedText(selectedVideo.description, language)}
                </p>
              )}
              <a
                href={selectedVideo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Youtube size={16} />
                {languageText(language, { bn: "YouTube-এ খুলুন", en: "Open on YouTube", hi: "YouTube पर खोलें" })}
                <ExternalLink size={13} />
              </a>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default VideoSection;
