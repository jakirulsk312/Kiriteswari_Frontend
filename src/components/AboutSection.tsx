
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
            languageText(language, { bn: "কিরীটেশ্বরী গুপ্ত মন্দির", en: "Kiriteswari Gupta Temple", hi: "किरीटेश्वरी गुप्त मंदिर" })
          }
          subtitle={
            languageText(language, {
              bn: "পশ্চিমবঙ্গের মুর্শিদাবাদ জেলার নবগ্রাম ব্লকের কিরীটকোনা গ্রামে অবস্থিত কিরীটেশ্বরী গুপ্ত মন্দির (বা কিরীটেশ্বরী মন্দির) হলো ভারতের ৫১টি শক্তিপীঠের অন্যতম একটি পবিত্র স্থান।",
                en: "Kiriteswari Gupta Temple (also known as Kiriteswari Temple), located in Kiritkona village in the Nabagram block of Murshidabad district, West Bengal, is one of India's 51 sacred Shakti Peethas.",
                hi: "पश्चिम बंगाल के मुर्शिदाबाद जिले के नवग्राम ब्लॉक के किरीटकोना गाँव में स्थित किरीटेश्वरी गुप्त मंदिर (या किरीटेश्वरी मंदिर) भारत के ५१ शक्तिपीठों में से एक पवित्र स्थल है।",
              })
            }
          
        />

        <div ref={ref} className="grid items-start gap-12 lg:grid-cols-2">

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

            {/* <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {languageText(language, {
                bn: "কিরীটেশ্বরী মন্দির",
                en: "Kiriteswari Temple",
                hi: "किरीटेश्वरी मंदिर",
              })}
            </h2>

            <p className="font-body leading-relaxed text-muted-foreground">
              {languageText(language, {
                bn: "পশ্চিমবঙ্গের মুর্শিদাবাদ জেলার নবগ্রাম ব্লকের কিরীটকোনা গ্রামে অবস্থিত কিরীটেশ্বরী গুপ্ত মন্দির (বা কিরীটেশ্বরী মন্দির) হলো ভারতের ৫১টি শক্তিপীঠের অন্যতম একটি পবিত্র স্থান।",
                en: "Kiriteswari Gupta Temple (also known as Kiriteswari Temple), located in Kiritkona village in the Nabagram block of Murshidabad district, West Bengal, is one of India's 51 sacred Shakti Peethas.",
                hi: "पश्चिम बंगाल के मुर्शिदाबाद जिले के नवग्राम ब्लॉक के किरीटकोना गाँव में स्थित किरीटेश्वरी गुप्त मंदिर (या किरीटेश्वरी मंदिर) भारत के ५१ शक्तिपीठों में से एक पवित्र स्थल है।",
              })}
            </p> */}

            <h3 className="font-display text-xl font-bold text-foreground">
              {languageText(language, {
                bn: "মূল তথ্য ও ইতিহাস",
                en: "Key Facts and History",
                hi: "मुख्य जानकारी और इतिहास",
              })}
            </h3>

            <ul className="list-disc space-y-4 pl-5 font-body leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  {languageText(language, { bn: "অবস্থান: ", en: "Location: ", hi: "स्थान: " })}
                </strong>
                {languageText(language, {
                  bn: "মুর্শিদাবাদ জেলার লালবাগ মহকুমার নবগ্রামের কাছে কিরীটকোনা গ্রামে এই মন্দিরটি অবস্থিত।",
                  en: "The temple is in Kiritkona village near Nabagram, in the Lalbag subdivision of Murshidabad district.",
                  hi: "यह मंदिर मुर्शिदाबाद जिले के लालबाग उपमंडल में नवग्राम के पास किरीटकोना गाँव में स्थित है।",
                })}
              </li>
              <li>
                <strong className="text-foreground">
                  {languageText(language, { bn: "পৌরাণিক কাহিনী: ", en: "Legend: ", hi: "पौराणिक कथा: " })}
                </strong>
                {languageText(language, {
                  bn: "হিন্দু পুরাণ অনুযায়ী, এখানে দেবী সতীর মুকুট বা ‘কিরীট’ পতিত হয়েছিল, তাই এই স্থানের নাম কিরীটেশ্বরী (বা মুকুটেশ্বরী)। এখানকার পীঠদেবী হলেন দেবী বিমলা এবং ভৈরব হলেন সম্বর্ত।",
                  en: "According to Hindu tradition, Goddess Sati's crown, or kirita, fell here, giving the place the name Kiriteswari (also called Mukuteshwari). The presiding goddess is Vimala and the Bhairava is Samvarta.",
                  hi: "हिंदू मान्यता के अनुसार, यहाँ देवी सती का मुकुट, अर्थात् किरीट, गिरा था; इसी से इस स्थान का नाम किरीटेश्वरी (या मुकुटेश्वरी) पड़ा। यहाँ पीठदेवी विमला और भैरव संवर्त हैं।",
                })}
              </li>
              <li>
                <strong className="text-foreground">
                  {languageText(language, { bn: "গুপ্ত মন্দির বা গোপন ইতিহাস: ", en: "The Gupta Temple and its history: ", hi: "गुप्त मंदिर और उसका इतिहास: " })}
                </strong>
                {languageText(language, {
                  bn: "ইতিহাস ও স্থানীয় জনশ্রুতি অনুযায়ী, প্রায় ৩০০–৩৫০ বছর আগে যখন মুর্শিদকুলি খাঁ ঢাকা থেকে মুর্শিদাবাদে রাজধানী স্থানান্তরিত করেন, তখন আক্রমণকারীদের হাত থেকে রক্ষা করতে মূল বিগ্রহ বা দেবীর রূপ এই গুপ্ত মন্দিরে বা কাছাকাছি স্থানে লুকিয়ে রাখা হয়েছিল। মূল মন্দির থেকে কিছুটা দূরত্বে এই গুপ্ত মন্দিরটি অবস্থিত।",
                  en: "According to local history and tradition, around 300–350 years ago, when Murshid Quli Khan moved the capital from Dhaka to Murshidabad, the original idol or image of the Goddess was hidden in this gupta (hidden) temple or nearby to protect it from attackers. This shrine is some distance from the main temple.",
                  hi: "स्थानीय इतिहास और जनश्रुति के अनुसार, लगभग ३००–३५० वर्ष पहले जब मुर्शिद कुली ख़ाँ ने राजधानी ढाका से मुर्शिदाबाद स्थानांतरित की, तब आक्रमणकारियों से बचाने के लिए देवी के मूल विग्रह या स्वरूप को इस गुप्त मंदिर में अथवा पास में छिपाया गया था। यह गुप्त मंदिर मुख्य मंदिर से कुछ दूरी पर है।",
                })}
              </li>
              <li>
                <strong className="text-foreground">
                  {languageText(language, { bn: "পূজা পদ্ধতি: ", en: "Worship: ", hi: "पूजा-पद्धति: " })}
                </strong>
                {languageText(language, {
                  bn: "এখানে কোনো প্রচলিত মানবাকৃতির প্রতিমা বা মূর্তি নেই; একটি লাল কাপড়ে ঢাকা কালো পাথরের বেদী বা শিলাকে মায়ের রূপ হিসেবে পূজা করা হয়।",
                  en: "There is no conventional human-shaped idol here; a black stone altar or slab covered with red cloth is worshipped as the form of the Mother Goddess.",
                  hi: "यहाँ कोई पारंपरिक मानवाकार प्रतिमा नहीं है; लाल कपड़े से ढकी काली पत्थर की वेदी या शिला को माँ का स्वरूप मानकर पूजा जाता है।",
                })}
              </li>
              <li>
                <strong className="text-foreground">
                  {languageText(language, { bn: "বিশেষত্ব: ", en: "What makes it special: ", hi: "विशेषता: " })}
                </strong>
                {languageText(language, {
                  bn: "২০২৩ সালে এই কিরীটকোনা গ্রামটি ভারত সরকারের পর্যটন মন্ত্রক কর্তৃক দেশের ‘সেরা পর্যটন গ্রাম’ (Best Tourism Village) হিসেবে স্বীকৃতি লাভ করেছে। এছাড়া এই মন্দিরের জমিতে হিন্দু-মুসলিম সম্প্রীতির এক অনন্য নজির রয়েছে।",
                  en: "In 2023, India's Ministry of Tourism recognized Kiritkona as a Best Tourism Village. The temple grounds are also a unique example of Hindu-Muslim harmony.",
                  hi: "२०२३ में भारत सरकार के पर्यटन मंत्रालय ने किरीटकोना गाँव को ‘सर्वश्रेष्ठ पर्यटन ग्राम’ (Best Tourism Village) के रूप में मान्यता दी। मंदिर परिसर में हिंदू-मुस्लिम सद्भाव की अनूठी मिसाल भी है।",
                })}
              </li>
            </ul>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
