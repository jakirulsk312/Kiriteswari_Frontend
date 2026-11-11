import { ChevronDown, MapPin, Heart } from "lucide-react";
import heroImage from "@/assets/hero-temple.jpg";
import { languageText, useLanguage } from "@/lib/language";

const HeroSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section
      id="home"
      className="relative flex h-screen items-center justify-center overflow-hidden"
      aria-label="Kiriteswari Temple Murshidabad"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* For accessibility */}
      <img src={heroImage} alt="Kiriteswari Temple" className="hidden" />

      <div className="relative z-10 container-temple text-center px-4 pt-32 sm:pt-40 md:pt-44 lg:pt-48">
        <div className="animate-fade-in-up mx-auto max-w-4xl">

          <p className="mb-4 font-bengali text-lg font-semibold text-yellow-300 drop-shadow-md sm:text-xl">
            {languageText(language, { bn: "শ্রী শ্রী৺রী কিরীটেশ্বরী মাতা জয়তী", en: "Victory to Sri Sri Kiriteswari Mata", hi: "श्री श्री किरीटेश्वरी माता की जय" })}
          </p>

          <h1 className="font-bengali font-light tracking-wide text-3xl leading-snug text-white drop-shadow-lg sm:text-4xl md:text-7xl lg:text-8xl">
            {languageText(language, { bn: "কিরীটেশ্বরী শক্তিপীঠ মন্দির", en: "Kiriteswari Shaktipeeth Temple", hi: "किरीटेश्वरी शक्तिपीठ टेम्पल मंदिर " })}
            <span className="mt-2 block text-xl font-light tracking-wide text-yellow-400 sm:text-3xl md:text-5xl lg:text-6xl">
              {languageText(language, { bn: "মুর্শিদাবাদ, পশ্চিমবঙ্গ", en: "Murshidabad, West Bengal", hi: "मुर्शिदाबाद, पश्चिम बंगाल" })}
            </span>
          </h1>
          
          <p className="mx-auto mt-5 max-w-3xl font-bengali text-base leading-relaxed text-white/90 drop-shadow-md sm:text-lg md:text-xl">
            <span aria-hidden="true" className="mr-2">🙏</span>
            {languageText(language, {
              bn: "শ্রী শ্রী৺রী কিরীটেশ্বরী মাতার নিত্য-সেবা, পূজা ও মন্দির সংস্কার পরিচালন কমিটি",
              en: "Committee for the daily seva, worship, and restoration of Sri Sri Kiriteswari Mata's Temple",
              hi: "श्री श्री किरीटेश्वरी माता की नित्य सेवा, पूजा और मंदिर जीर्णोद्धार समिति",
            })}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#about"
              className="group flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3.5 font-body text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-600"
            >
              <MapPin size={18} />
              {languageText(language, { bn: "দর্শনের পরিকল্পনা", en: "Plan Your Visit", hi: "दर्शन की योजना बनाएँ" })}
            </a>

            <a
              href="#services"
              className="flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-8 py-3.5 font-body text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <Heart size={18} />
              {languageText(language, { bn: "অনুদান করুন", en: "Donate Now", hi: "अभी दान करें" })}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-white/70 transition-colors hover:text-white"
        >
          <span className="font-body text-xs uppercase tracking-widest">{languageText(language, { bn: "নিচে দেখুন", en: "Scroll", hi: "नीचे जाएँ" })}</span>
          <ChevronDown size={20} className="animate-scroll-bounce" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
