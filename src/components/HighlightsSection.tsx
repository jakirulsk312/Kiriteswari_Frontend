import { Flame, Landmark, TreePine, Music, Award, Crown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { languageText, useLanguage } from "@/lib/language";

const highlights = [
  {
    icon: Crown,
    title: { bn: "শক্তিপীঠ", en: "Shakti Peetha", hi: "शक्तिपीठ" },
    desc: { bn: "৫১ শক্তিপীঠের একটি, যেখানে দেবী সতীর মুকুট পতিত হয়েছিল — দেবী কিরীটেশ্বরী কালীর আবাস।", en: "One of the 51 Shakta Pithas where the crown (Kirit) of Goddess Sati fell — the abode of Devi Kiriteshwari Kali.", hi: "५१ शक्तिपीठों में से एक, जहाँ देवी सती का मुकुट गिरा था — देवी किरीटेश्वरी काली का धाम।" },
  },
  {
    icon: Landmark,
    title: { bn: "১০০০ বছরের ঐতিহ্য", en: "1000+ Years Heritage", hi: "१०००+ वर्षों की विरासत" },
    desc: { bn: "অনন্য চারচালা স্থাপত্য ও একবাংলা বারান্দাসহ মুর্শিদাবাদ জেলার প্রাচীনতম মন্দির।", en: "The oldest temple in Murshidabad district with unique char-chala architecture and ek-bangla porch design.", hi: "विशिष्ट चारचाला वास्तुकला और एक-बंगला बरामदे वाला मुर्शिदाबाद जिले का सबसे पुराना मंदिर।" },
  },
  {
    icon: Award,
    title: { bn: "সেরা পর্যটন গ্রাম ২০২৩", en: "Best Tourism Village 2023", hi: "सर्वश्रेष्ठ पर्यटन गाँव २०२३" },
    desc: { bn: "৩১টি রাজ্যের ৭৯৫টি গ্রামের মধ্যে নির্বাচিত হয়ে কেন্দ্রীয় পর্যটন মন্ত্রকের 'ভারতের সেরা পর্যটন গ্রাম' পুরস্কার পেয়েছে।", en: "Awarded 'Best Tourism Village of India' by the Union Ministry of Tourism, selected from 795 villages across 31 states.", hi: "३१ राज्यों के ७९५ गाँवों में से चुने जाने पर केंद्रीय पर्यटन मंत्रालय द्वारा 'भारत का सर्वश्रेष्ठ पर्यटन गाँव' पुरस्कार मिला।" },
  },
  {
    icon: Music,
    title: { bn: "সাংস্কৃতিক উৎসব", en: "Cultural Festivals", hi: "सांस्कृतिक उत्सव" },
    desc: { bn: "বাংলার ঐতিহ্যবাহী আচার ও ভক্তির সঙ্গে কালীপূজা, নবরাত্রি এবং অন্যান্য উৎসবের উদযাপন।", en: "Grand celebrations of Kali Puja, Navratri, and other festivals with traditional Bengali rituals and devotion.", hi: "बंगाली परंपराओं और भक्ति के साथ काली पूजा, नवरात्रि और अन्य उत्सवों का भव्य आयोजन।" },
  },
];

const HighlightsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "মন্দিরের বিশেষত্ব", en: "Temple Highlights", hi: "मंदिर की विशेषताएँ" })}
          subtitle={languageText(language, { bn: "কী কারণে কিরীটেশ্বরী এক অনন্য পবিত্র গন্তব্য", en: "What makes Kiriteswari a truly divine destination", hi: "किरीटेश्वरी को क्या बनाता है एक अद्वितीय दिव्य स्थल" })}
        />

        <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <div
              key={item.title.en}
              className={`group rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-gold ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-saffron text-primary-foreground shadow-saffron transition-transform duration-300 group-hover:scale-110">
                <item.icon size={28} />
              </div>
              <h3 className="mb-3 font-display text-xl font-bold text-foreground">{languageText(language, item.title)}</h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">{languageText(language, item.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
