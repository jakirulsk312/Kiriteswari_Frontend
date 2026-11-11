import { useState, useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { apiRequest } from "@/lib/api";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

interface EventItem {
  _id?: string;
  title: TextValue;
  date?: TextValue;
  description?: TextValue;
  desc?: TextValue;
  venue?: TextValue;
}

const fallbackEvents: EventItem[] = [
  {
    title: { bn: "কালীপূজা", en: "Kali Puja", hi: "काली पूजा" },
    date: { bn: "অক্টোবর – নভেম্বর", en: "October – November", hi: "अक्टूबर – नवंबर" },
    desc: {
      bn: "বিশেষ আচার, যজ্ঞ এবং ভক্তসমাগমের মাধ্যমে মা কিরীটেশ্বরী কালীর পূজা অনুষ্ঠিত হয়।",
      en: "Special worship of Maa Kiriteshwari Kali with rituals, sacred fire ceremonies, and gatherings of devotees.",
      hi: "विशेष अनुष्ठानों, हवन और भक्तों के समागम के साथ माँ किरीटेश्वरी काली की पूजा होती है।",
    },
  },
  {
    title: { bn: "জগদ্ধাত্রী পূজা", en: "Jagaddhatri Puja", hi: "जगद्धात्री पूजा" },
    date: { bn: "নভেম্বর", en: "November", hi: "नवंबर" },
    desc: {
      bn: "মন্দিরে ভক্তি ও বিশেষ আচার-অনুষ্ঠানের মধ্য দিয়ে জগদ্ধাত্রী পূজা পালিত হয়।",
      en: "Jagaddhatri Puja is celebrated with devotion and special rituals at the temple.",
      hi: "मंदिर में भक्ति और विशेष अनुष्ठानों के साथ जगद्धात्री पूजा मनाई जाती है।",
    },
  },
  {
    title: { bn: "বিশেষ রাত্রিকালীন যজ্ঞ উৎসব", en: "Special Night Yajna Festival", hi: "विशेष रात्रि यज्ञ उत्सव" },
    date: { bn: "শুভ তিথিতে", en: "On Auspicious Dates", hi: "शुभ तिथियों पर" },
    desc: {
      bn: "শুভ উপলক্ষে বহু ভক্তের অংশগ্রহণে বিশেষ রাত্রিকালীন যজ্ঞ ও আচার পালিত হয়।",
      en: "Special night yajna and rituals are performed on auspicious occasions with participation of many devotees.",
      hi: "शुभ अवसरों पर अनेक भक्तों की भागीदारी के साथ विशेष रात्रि यज्ञ और अनुष्ठान किए जाते हैं।",
    },
  },
  {
    title: { bn: "বিখ্যাত পৌষ মেলা", en: "Famous Poush Fair", hi: "प्रसिद्ध पौष मेला" },
    date: { bn: "পৌষ মাস (ডিসেম্বর – জানুয়ারি)", en: "Poush Month (December – January)", hi: "पौष माह (दिसंबर – जनवरी)" },
    desc: {
      bn: "পৌষ মাসে প্রতি মঙ্গল ও শনিবার বিখ্যাত মেলা বসে, যেখানে বহু ভক্ত ও দর্শনার্থী আসেন।",
      en: "A famous fair is held every Tuesday and Saturday during Poush, attracting many devotees and visitors.",
      hi: "पौष माह में प्रत्येक मंगलवार और शनिवार को प्रसिद्ध मेला लगता है, जिसमें अनेक भक्त और पर्यटक आते हैं।",
    },
  },
];

const EventsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { language } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await apiRequest<Array<EventItem> | { data?: EventItem[] }>("/events");
        const apiEvents = Array.isArray(response) ? response : response?.data ?? [];
        if (apiEvents.length) {
          setEvents(
            apiEvents.map((event) => ({
              ...event,
              ...event,
              date: event.date || event.venue || { bn: "মন্দিরের অনুষ্ঠান", en: "Temple Event", hi: "मंदिर का आयोजन" },
              desc: event.description || event.desc || event.venue,
            }))
          );
        }
      } catch {
        setEvents(fallbackEvents);
      }
    };

    loadEvents();
  }, []);

  return (
    <section id="events" className="section-padding bg-gradient-section">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "উৎসব ও অনুষ্ঠান", en: "Events & Festivals", hi: "उत्सव और कार्यक्रम" })}
          subtitle={languageText(language, {
            bn: "কিরীটেশ্বরী মন্দিরের প্রধান ধর্মীয় উৎসবসমূহ",
            en: "Major religious festivals celebrated at Kiriteswari Temple",
            hi: "किरीटेश्वरी मंदिर के प्रमुख धार्मिक उत्सव",
          })}
        />

        <div ref={ref} className="grid gap-6 sm:grid-cols-2">
          {events.map((event, i) => (
            <div
              key={(event._id ?? getLocalizedText(event.title, language)) + i}
              className={`group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-gold ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Calendar size={16} />
                <span className="font-body text-sm font-semibold">{getLocalizedText(event.date, language)}</span>
              </div>

              <h3 className="mb-2 font-display text-xl font-bold text-foreground">{getLocalizedText(event.title, language)}</h3>

              <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">{getLocalizedText(event.desc || event.description, language)}</p>

              <button className="flex items-center gap-1 font-body text-sm font-semibold text-primary transition-colors hover:text-deep-red">
                {languageText(language, { bn: "আরও জানুন", en: "Learn More", hi: "और जानें" })} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventsSection;
