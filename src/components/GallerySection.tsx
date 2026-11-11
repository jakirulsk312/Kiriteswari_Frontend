import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import heroImage from "@/assets/hero-temple.jpg";
import templeAbout from "@/assets/temple-about.jpeg";
import { apiRequest } from "@/lib/api";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

interface GalleryImage {
  _id?: string;
  title?: TextValue;
  description?: TextValue;
  imageUrl?: string;
  src?: string;
  alt?: string;
}

const fallbackImages: GalleryImage[] = [
  { src: gallery1, alt: "Festival celebration with oil lamps" },
  { src: gallery2, alt: "Temple at dawn by the river" },
  { src: gallery3, alt: "Sacred fire puja ceremony" },
  { src: gallery4, alt: "Intricate temple carvings" },
  { src: heroImage, alt: "Temple at golden hour sunset" },
  { src: templeAbout, alt: "Temple interior with pillars" },
];

const GallerySection = () => {
  const { language } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await apiRequest<{ data?: GalleryImage[] }>("/gallery");
        const apiImages = response?.data ?? [];
        if (apiImages.length) {
          const mapped = apiImages.map((image) => ({
            ...image,
            src: image.imageUrl || image.src,
            alt: getLocalizedText(image.title || image.description, language) || "Temple gallery image",
          }));
          setImages(mapped);
        }
      } catch {
        setImages(fallbackImages);
      }
    };

    loadGallery();
  }, [language]);

  useEffect(() => {
    if (lightbox === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") {
        setLightbox((current) => current === null ? null : (current - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setLightbox((current) => current === null ? null : (current + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, images.length]);

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "মন্দিরের ছবির গ্যালারি", en: "Temple Gallery", hi: "मंदिर चित्र दीर्घा" })}
          subtitle={languageText(language, {
            bn: "দিব্য সৌন্দর্য, পবিত্র আচার ও উৎসবের কিছু মুহূর্ত",
            en: "Glimpses of divine beauty, sacred rituals, and grand celebrations",
            hi: "दिव्य सौंदर्य, पवित्र अनुष्ठानों और भव्य उत्सवों की झलकियाँ",
          })}
        />

        <div ref={ref} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={(img._id ?? img.src ?? img.alt ?? i).toString()}
              onClick={() => setLightbox(i)}
              aria-label={languageText(language, { bn: "বড় করে ছবি দেখুন", en: "View image larger", hi: "छवि को बड़ा देखें" })}
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm transition duration-300 hover:z-10 hover:scale-[1.04] hover:shadow-xl focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={img.src || img.imageUrl || ""}
                alt={getLocalizedText(img.title, language) || img.alt || "Temple gallery image"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-temple-dark/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <p className="w-full p-3 text-left font-body text-xs text-primary-foreground">
                  {getLocalizedText(img.title, language) || img.alt}
                  <span className="mt-1 block opacity-80">{languageText(language, { bn: "বড় করে দেখুন", en: "View larger", hi: "बड़ा देखें" })}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={languageText(language, { bn: "ছবির গ্যালারি", en: "Image gallery", hi: "छवि गैलरी" })}
          className="fixed inset-0 z-50 flex items-center justify-center bg-temple-dark/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label={languageText(language, { bn: "বন্ধ করুন", en: "Close", hi: "बंद करें" })}
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-background/10 p-2 text-primary-foreground/80 hover:bg-background/20 hover:text-primary-foreground"
          >
            <X size={32} />
          </button>
          <div className="flex max-w-full items-center gap-2 sm:gap-4" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label={languageText(language, { bn: "আগের ছবি", en: "Previous image", hi: "पिछली छवि" })}
              onClick={() => setLightbox((lightbox - 1 + images.length) % images.length)}
              className="shrink-0 rounded-full bg-background/15 p-2 text-primary-foreground hover:bg-background/30 sm:p-3"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex min-w-0 flex-col items-center">
              <img
                src={images[lightbox].src || images[lightbox].imageUrl || ""}
                alt={getLocalizedText(images[lightbox].title, language) || images[lightbox].alt || "Temple gallery image"}
                className="max-h-[78vh] max-w-[72vw] rounded-xl object-contain animate-fade-in"
              />
              <p className="mt-3 text-center text-sm text-primary-foreground">
                {getLocalizedText(images[lightbox].title, language) || images[lightbox].alt}
                <span className="ml-2 text-xs text-primary-foreground/70">{lightbox + 1} / {images.length}</span>
              </p>
            </div>
            <button
              type="button"
              aria-label={languageText(language, { bn: "পরের ছবি", en: "Next image", hi: "अगली छवि" })}
              onClick={() => setLightbox((lightbox + 1) % images.length)}
              className="shrink-0 rounded-full bg-background/15 p-2 text-primary-foreground hover:bg-background/30 sm:p-3"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
