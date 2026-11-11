import { Heart, BookOpen, Users, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { languageText, useLanguage } from "@/lib/language";

const services = [
  { icon: Heart, title: { bn: "অনলাইন অনুদান", en: "Online Donation", hi: "ऑनलाइन दान" }, desc: { bn: "মন্দিরের পবিত্র সেবাকাজে অনলাইনে অনুদান দিয়ে সহায়তা করুন।", en: "Support the temple's sacred mission with secure online contributions.", hi: "सुरक्षित ऑनलाइन योगदान से मंदिर के पवित्र कार्यों में सहयोग करें।" }, color: "bg-gradient-saffron", href: "/donate" },
  { icon: BookOpen, title: { bn: "পূজা বুকিং", en: "Puja Booking", hi: "पूजा बुकिंग" }, desc: { bn: "পৃথিবীর যেকোনো স্থান থেকে পরিবারের জন্য বিশেষ পূজা ও আচার বুক করুন।", en: "Book special pujas and rituals for your family from anywhere in the world.", hi: "दुनिया में कहीं से भी अपने परिवार के लिए विशेष पूजा और अनुष्ठान बुक करें।" }, color: "bg-accent", href: "/booking" },
  { icon: Users, title: { bn: "স্বেচ্ছাসেবা", en: "Volunteer", hi: "स्वयंसेवा" }, desc: { bn: "আমাদের সেবাসমাজে যোগ দিয়ে দেবসেবায় সময় দিন।", en: "Join our seva community and contribute your time to divine service.", hi: "हमारे सेवा समुदाय से जुड़ें और दिव्य सेवा में अपना समय दें।" }, color: "bg-secondary", href: "/members" },
  { icon: Gift, title: { bn: "প্রসাদ বিতরণ", en: "Prasad Delivery", hi: "प्रसाद वितरण" }, desc: { bn: "বিশেষ অনুষ্ঠানের পর আশীর্বাদী প্রসাদ আপনার বাড়িতে পেতে যোগাযোগ করুন।", en: "Receive blessed prasad delivered to your home after special ceremonies.", hi: "विशेष समारोहों के बाद आशीर्वाद स्वरूप प्रसाद घर मँगाएँ।" }, color: "bg-gradient-saffron", href: "/#contact" },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { language } = useLanguage();

  return (
    <section id="services" className="section-padding relative overflow-hidden bg-temple-dark">
      <div className="container-temple relative z-10">
        <SectionHeading
          title={languageText(language, { bn: "অনলাইন সেবা", en: "Online Services", hi: "ऑनलाइन सेवाएँ" })}
          subtitle={languageText(language, { bn: "যেখানেই থাকুন, ভক্তির সঙ্গে যুক্ত থাকুন", en: "Connect with the divine from wherever you are", hi: "आप जहाँ भी हों, दिव्यता से जुड़ें" })}
          light
        />

        <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => (
            <div
              key={svc.title.en}
              className={`group cursor-pointer rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary-foreground/10 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl ${svc.color} text-primary-foreground shadow-saffron transition-transform duration-300 group-hover:scale-110`}>
                <svc.icon size={28} />
              </div>
              <h3 className="mb-3 font-display text-lg font-bold text-primary-foreground">{languageText(language, svc.title)}</h3>
              <p className="mb-5 font-body text-sm leading-relaxed text-primary-foreground/70">{languageText(language, svc.desc)}</p>
              <Link
                to={svc.href}
                className="inline-flex rounded-lg border border-primary/50 bg-primary/20 px-6 py-2 font-body text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                {languageText(language, { bn: "শুরু করুন", en: "Get Started", hi: "शुरू करें" })}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
