
import { Helmet } from "react-helmet-async";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HighlightsSection from "@/components/HighlightsSection";
import TimingsSection from "@/components/TimingsSection";
import GallerySection from "@/components/GallerySection";
import VideoSection from "@/components/VideoSection";
import EventsSection from "@/components/EventsSection";
import ServicesSection from "@/components/ServicesSection";
import AnnouncementSection from "@/components/AnnouncementSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import MemberSection from "@/components/MemberSection";
import { languageText, useLanguage } from "@/lib/language";

const Index = () => {
  const { language } = useLanguage();
  return (
    <>
      <Helmet>
        <title>
          {languageText(language, {
            bn: "শ্রী শ্রী৺রী কিরীটেশ্বরী মাতা জয়তী | কিরীটেশ্বরী শক্তিপীঠ, মুর্শিদাবাদ",
            en: "Victory to Sri Sri Kiriteswari Mata | Kiriteswari Shaktipeeth Murshidabad",
            hi: "श्री श्री किरीटेश्वरी माता की जय | किरीटेश्वरी शक्तिपीठ, मुर्शिदाबाद",
          })}
        </title>

        <meta
          name="description"
          content={languageText(language, {
            bn: "🙏 শ্রী শ্রী৺রী কিরীটেশ্বরী মাতার নিত্য-সেবা, পূজা ও মন্দির সংস্কার পরিচালন কমিটি। কিরীটেশ্বরী মন্দির ভারতের ৫১টি পবিত্র শক্তিপীঠের অন্যতম।",
            en: "🙏 Committee for the daily seva, worship, and restoration of Sri Sri Kiriteswari Mata's Temple. Kiriteswari Temple in Murshidabad, West Bengal is one of India's sacred 51 Shakti Peethas.",
            hi: "🙏 श्री श्री किरीटेश्वरी माता की नित्य सेवा, पूजा और मंदिर जीर्णोद्धार समिति। मुर्शिदाबाद का किरीटेश्वरी मंदिर भारत के ५१ पवित्र शक्तिपीठों में से एक है।",
          })}
        />

        <meta
          name="keywords"
          content="Kiriteswari Temple, Kiriteswari Mandir, 51 Shakti Peetha, Murshidabad Temple, Murshidabad Tourist Places, West Bengal Temple"
        />

        <link rel="canonical" href="https://kiriteswaritemple.vercel.app/" />

        {/* Open Graph */}
        <meta property="og:title" content={languageText(language, { bn: "কিরীটেশ্বরী শক্তিপীঠ, মুর্শিদাবাদ", en: "Kiriteswari Shaktipeeth Murshidabad", hi: "किरीटेश्वरी शक्तिपीठ, मुर्शिदाबाद" })} />
        <meta
          property="og:description"
          content={languageText(language, {
            bn: "পশ্চিমবঙ্গের মুর্শিদাবাদে অবস্থিত ৫১টি পবিত্র শক্তিপীঠের অন্যতম।",
            en: "One of the sacred 51 Shakti Peethas located in Murshidabad, West Bengal.",
            hi: "पश्चिम बंगाल के मुर्शिदाबाद में स्थित ५१ पवित्र शक्तिपीठों में से एक।",
          })}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <HighlightsSection />
        <AnnouncementSection />
        <TimingsSection />
        <GallerySection />
        <VideoSection />
        <EventsSection />
        <ServicesSection />
        <MemberSection standalone={false} />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
        <ScrollToTopButton />
      </main>
    </>
  );
};

export default Index;
