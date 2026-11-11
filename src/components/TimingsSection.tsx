import { useEffect, useState } from "react";
import { CalendarDays, Clock, Sun } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { apiRequest } from "@/lib/api";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

type TimingCategory = "puja" | "prasad" | "mela" | "special" | "darshan" | "opening" | "closing";

interface TimingItem {
  _id: string;
  title: TextValue;
  timeText: TextValue;
  detail?: TextValue;
  category: TimingCategory;
  dayType?: string;
  days?: TextValue;
}

const categoryLabels: Record<TimingCategory, { bn: string; en: string; hi: string }> = {
  puja: { bn: "পূজার সময়", en: "Puja", hi: "पूजा का समय" },
  prasad: { bn: "প্রসাদ বিতরণ", en: "Prasad distribution", hi: "प्रसाद वितरण" },
  mela: { bn: "মেলা", en: "Fair", hi: "मेला" },
  special: { bn: "বিশেষ সময়সূচি", en: "Special schedule", hi: "विशेष समय-सारणी" },
  darshan: { bn: "দর্শন", en: "Darshan", hi: "दर्शन" },
  opening: { bn: "মন্দির খোলার সময়", en: "Temple opening", hi: "मंदिर खुलने का समय" },
  closing: { bn: "মন্দির বন্ধের সময়", en: "Temple closing", hi: "मंदिर बंद होने का समय" },
};

const TimingsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { language } = useLanguage();
  const [timings, setTimings] = useState<TimingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiRequest<{ data?: TimingItem[] }>("/timings")
      .then((response) => {
        if (active) setTimings(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("load-failed");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const labelFor = (category: TimingCategory) => categoryLabels[category][language];

  return (
    <section id="timings" className="section-padding bg-gradient-section">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "পূজা ও মন্দিরের সময়সূচি", en: "Puja & Temple Schedule", hi: "पूजा और मंदिर समय-सारणी" })}
          subtitle={languageText(language, {
            bn: "মন্দির খোলা-বন্ধ, পূজা, দর্শন ও মেলার হালনাগাদ সময়",
            en: "Current opening hours, puja, darshan, and mela schedule",
            hi: "मंदिर खुलने-बंद होने, पूजा, दर्शन और मेले का नवीनतम समय",
          })}
        />

        <div ref={ref} className={`mx-auto max-w-4xl space-y-4 ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">{languageText(language, { bn: "সময়সূচি লোড হচ্ছে...", en: "Loading schedule...", hi: "समय-सारणी लोड हो रही है..." })}</p>
          ) : error ? (
            <p role="alert" className="py-8 text-center text-destructive">
              {languageText(language, { bn: "সময়সূচি লোড করা যায়নি।", en: "Could not load the schedule.", hi: "समय-सारणी लोड नहीं हो सकी।" })}
            </p>
          ) : timings.length === 0 ? (
            <p className="rounded-xl border border-border bg-card px-5 py-8 text-center text-muted-foreground">
              {languageText(language, {
                bn: "বর্তমানে কোনো সময়সূচি প্রকাশিত নেই। সঠিক সময়ের জন্য মন্দির কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন।",
                en: "No schedule has been published yet. Please contact the temple for current timings.",
                hi: "अभी कोई समय-सारणी प्रकाशित नहीं है। वर्तमान समय के लिए मंदिर प्रशासन से संपर्क करें।",
              })}
            </p>
          ) : (
            timings.map((item) => {
              const Icon = item.category === "mela" ? CalendarDays : item.category === "puja" ? Sun : Clock;
              const days = item.days || item.dayType;
              return (
                <article key={item._id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-gold sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-saffron text-primary-foreground">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{labelFor(item.category)}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{getLocalizedText(item.title, language)}</h3>
                    {days && <p className="mt-1 font-bengali text-sm text-muted-foreground">{getLocalizedText(days, language)}</p>}
                    {item.detail && <p className="mt-1 font-bengali text-sm text-muted-foreground">{getLocalizedText(item.detail, language)}</p>}
                  </div>
                  <p className="shrink-0 font-bengali text-base font-semibold text-primary sm:text-right">{getLocalizedText(item.timeText, language)}</p>
                </article>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default TimingsSection;
