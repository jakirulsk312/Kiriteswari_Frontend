
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import templeAbout from "@/assets/temple-about.jpeg";
import { languageText, useLanguage } from "@/lib/language";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { language } = useLanguage();

  return (
    <section id="about" className="section-padding bg-gradient-section">
      <div className="container-temple">

        <SectionHeading
          title={
            languageText(language, { bn: "কিরীটেশ্বরী মন্দির – ৫১ শক্তিপীঠের একটি", en: "About Kiriteswari Temple – One of the 51 Shakti Peethas", hi: "किरीटेश्वरी मंदिर – ५१ शक्तिपीठों में से एक" })
          }
          subtitle={
            languageText(language, {
              bn: "পশ্চিমবঙ্গের মুর্শিদাবাদের একটি পবিত্র হিন্দু তীর্থস্থান, পৌরাণিক কাহিনী, ইতিহাস এবং দেবী মহিমায় সমৃদ্ধ",
              en: "A sacred Hindu pilgrimage site in Murshidabad, West Bengal, steeped in mythology, history, and divine grace",
              hi: "पश्चिम बंगाल के मुर्शिदाबाद में स्थित पौराणिक कथाओं, इतिहास और देवी महिमा से समृद्ध एक पवित्र हिंदू तीर्थस्थल",
            })
          }
        />

        <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2">

          {/* Image */}
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="overflow-hidden rounded-2xl shadow-gold">
              <img
                src={templeAbout}
                alt="Kiriteswari Temple Murshidabad interior and shrine of Maa Kiriteshwari"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}>

            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {language === "bn" ? (
                <>
                  যেখানে দেবী সতীর
                  <span className="text-primary"> মুকুট পতিত হয়েছিল</span>
                </>
              ) : language === "hi" ? (
                <>
                  जहाँ देवी सती का
                  <span className="text-primary"> मुकुट गिरा था</span>
                </>
              ) : (
                <>
                  Where the Crown of
                  <span className="text-primary"> Goddess Sati</span> Fell
                </>
              )}
            </h2>

            <p className="font-body leading-relaxed text-muted-foreground">
              {languageText(language, {
                bn: "কিরীটেশ্বরী মন্দির ভারতের পশ্চিমবঙ্গের মুর্শিদাবাদ জেলার নবগ্রাম ব্লকের কিরীটেশ্বরী গ্রামে অবস্থিত। এটি পবিত্র ৫১ শক্তিপীঠের একটি, যেখানে দেবী সতীর মুকুট (কিরীট) পতিত হয়েছিল বলে বিশ্বাস করা হয়, যখন ভগবান শিব তাঁর দেহ বহন করছিলেন।",
                en: "Kiriteswari Temple is located in Kiriteswari village under the Nabagram CD block of Murshidabad district in West Bengal, India. It is one of the sacred 51 Shakti Peethas, marking the holy place where the crown (Kirita) of Goddess Sati is believed to have fallen after her self-immolation, while Lord Shiva carried her divine body across the universe.",
                hi: "किरीटेश्वरी मंदिर भारत के पश्चिम बंगाल राज्य के मुर्शिदाबाद जिले के नवग्राम ब्लॉक के किरीटेश्वरी गाँव में स्थित है। यह पवित्र ५१ शक्तिपीठों में से एक है। मान्यता है कि भगवान शिव जब देवी सती का दिव्य शरीर लेकर जा रहे थे, तब उनका मुकुट (किरीट) यहाँ गिरा था।",
              })}
            </p>

            <p className="font-body leading-relaxed text-muted-foreground">
              {languageText(language, {
                bn: "মন্দিরটির ইতিহাস ১০০০ বছরেরও বেশি পুরোনো এবং এটি মহামায়ার সঙ্গে যুক্ত। এখানে অধিষ্ঠাত্রী দেবী কিরীটেশ্বরী (মা কিরীটেশ্বরী কালী), যিনি মুকুটেশ্বরী নামেও পরিচিত। মূল মন্দিরটি প্রায় ১৪০৫ সালে ধ্বংস হয় এবং পরে লালগোলার রাজা দর্পনারায়ণ ১৯শ শতকে পুনর্নির্মাণ করেন। আজ এটি ভারতের গুরুত্বপূর্ণ শক্তিপীঠগুলির মধ্যে একটি।",
                en: "The temple has a history of more than 1000 years and is associated with Mahamaya, the supreme divine mother. The presiding deity is worshipped as Devi Kiriteshwari (Maa Kiriteshwari Kali), also known as Mukuteshwari. The original structure was destroyed around 1405 and later rebuilt in the 19th century by Darpanarayan, the King of Lalgola. Today, it stands as an important spiritual landmark among the Shakti Peeth temples of India.",
                hi: "इस मंदिर का इतिहास १००० वर्ष से अधिक पुराना है और इसका संबंध महामाया से है। यहाँ अधिष्ठात्री देवी किरीटेश्वरी (माँ किरीटेश्वरी काली) की पूजा होती है, जिन्हें मुकुटेश्वरी भी कहा जाता है। मूल मंदिर लगभग १४०५ में नष्ट हुआ था और १९वीं शताब्दी में लालगोला के राजा दर्पनारायण ने इसका पुनर्निर्माण कराया। आज यह भारत के प्रमुख शक्तिपीठों में से एक है।",
              })}
            </p>

            <p className="font-body text-sm italic leading-relaxed text-muted-foreground">
              {languageText(language, {
                bn: "ইতিহাসে উল্লেখ আছে যে নবাব মীরজাফর তাঁর জীবনের শেষ সময়ে অসুস্থ অবস্থায় মা কিরীটেশ্বরীর চরণামৃত গ্রহণ করতে চেয়েছিলেন, যা এই মন্দিরের প্রতি গভীর বিশ্বাসের প্রতিফলন।",
                en: "Historical accounts mention that Nawab Mir Jafar, during his final days, requested the sacred Charanamrita of Maa Kiriteshwari while suffering from illness, reflecting the deep faith associated with this holy temple.",
                hi: "ऐतिहासिक विवरणों के अनुसार, नवाब मीर जाफर ने जीवन के अंतिम दिनों में बीमारी के दौरान माँ किरीटेश्वरी का पवित्र चरणामृत माँगा था, जो इस मंदिर के प्रति गहरी आस्था को दर्शाता है।",
              })}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { num: "1000+", label: languageText(language, { bn: "বছরের ঐতিহ্য", en: "Years of Heritage", hi: "वर्षों की विरासत" }) },
                { num: "51", label: languageText(language, { bn: "শক্তিপীঠ", en: "Shakti Peethas", hi: "शक्तिपीठ" }) },
                { num: "#1", label: languageText(language, { bn: "সেরা পর্যটন গ্রাম ২০২৩", en: "Best Tourism Village 2023", hi: "सर्वश्रेष्ठ पर्यटन गाँव २०२३" }) },
                { num: "365", label: languageText(language, { bn: "দিন খোলা", en: "Days Open", hi: "दिन खुला" }) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-4 text-center shadow-sm"
                >
                  <div className="font-display text-2xl font-bold text-primary">
                    {stat.num}
                  </div>
                  <div className="mt-1 font-body text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
