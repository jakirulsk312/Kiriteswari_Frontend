import { useEffect, useState } from "react";
import { BellRing, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import SectionHeading from "./SectionHeading";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

type AnnouncementItem = {
  title: TextValue;
  message: TextValue;
  category?: TextValue;
  priority?: string;
  publishedAt?: string;
};

const fallbackAnnouncements: AnnouncementItem[] = [
  {
    title: { bn: "উৎসবের প্রস্তুতি চলছে", en: "Festival preparations are underway", hi: "उत्सव की तैयारियाँ चल रही हैं" },
    message: {
      bn: "আসন্ন বিশেষ পূজা ও ভক্তদের সেবার জন্য মন্দিরের স্বেচ্ছাসেবকেরা প্রস্তুতি নিচ্ছেন।",
      en: "Temple volunteers are preparing for the upcoming special puja schedule and seva arrangements for devotees.",
      hi: "आगामी विशेष पूजा और भक्तों की सेवा व्यवस्था के लिए मंदिर के स्वयंसेवक तैयारी कर रहे हैं।",
    },
    category: "Festival",
    priority: "high",
    publishedAt: "2026-11-09T08:00:00.000Z",
  },
  {
    title: { bn: "মন্দিরে দর্শন চালু রয়েছে", en: "Temple darshan remains open", hi: "मंदिर में दर्शन जारी है" },
    message: {
      bn: "সপ্তাহজুড়ে সকল দর্শনার্থী ও ভক্তদের জন্য দৈনিক দর্শন এবং প্রসাদ পরিষেবা যথারীতি চালু রয়েছে।",
      en: "Daily darshan and prasad services continue as usual for all visitors and devotees throughout the week.",
      hi: "सप्ताह भर सभी आगंतुकों और भक्तों के लिए दैनिक दर्शन और प्रसाद सेवा सामान्य रूप से जारी है।",
    },
    category: "General",
    priority: "normal",
    publishedAt: "2026-11-02T08:00:00.000Z",
  },
];

const AnnouncementSection = () => {
  const { language } = useLanguage();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(fallbackAnnouncements);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      try {
        const response = await apiRequest<{ data?: AnnouncementItem[] }>("/announcements");
        const items = Array.isArray(response?.data) ? response.data : fallbackAnnouncements;

        if (isMounted) {
          setAnnouncements(items.length ? items : fallbackAnnouncements);
        }
      } catch {
        if (isMounted) {
          setAnnouncements(fallbackAnnouncements);
        }
      }
    };

    loadAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section-padding bg-gradient-section">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "মন্দিরের খবর", en: "Temple Updates", hi: "मंदिर समाचार" })}
          subtitle={languageText(language, {
            bn: "ভক্ত ও দর্শনার্থীদের জন্য সর্বশেষ ঘোষণা, উৎসব ও সেবার খবর।",
            en: "Latest announcements, festivals, and service updates for devotees and visitors.",
            hi: "भक्तों और आगंतुकों के लिए नवीनतम घोषणाएँ, उत्सव और सेवा समाचार।",
          })}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {announcements.slice(0, 2).map((item, index) => (
            <div
              key={`${getLocalizedText(item.title, language)}-${index}`}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-saffron text-primary-foreground">
                    <BellRing size={18} />
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {getLocalizedText(item.category, language) || languageText(language, { bn: "সাধারণ", en: "General", hi: "सामान्य" })}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {languageText(language, { bn: item.priority === "high" ? "জরুরি" : "সাধারণ", en: item.priority || "normal", hi: item.priority === "high" ? "महत्वपूर्ण" : "सामान्य" })}
                </span>
              </div>

              <h3 className="mb-3 font-display text-2xl font-bold text-foreground">{getLocalizedText(item.title, language)}</h3>
              <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
                {getLocalizedText(item.message, language)}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(language === "bn" ? "bn-BD" : language === "hi" ? "hi-IN" : "en-US") : languageText(language, { bn: "সম্প্রতি হালনাগাদ", en: "Updated recently", hi: "हाल ही में अपडेट किया गया" })}</span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  {languageText(language, { bn: "আরও পড়ুন", en: "Read more", hi: "और पढ़ें" })} <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementSection;
