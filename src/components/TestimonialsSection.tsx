import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { languageText, useLanguage } from "@/lib/language";

const testimonials = [
  { name: "Priya Sharma", location: "Mumbai", text: { en: "Visiting Shri Shakti Dham was a life-changing experience. The divine energy and peaceful atmosphere brought tears of joy to my eyes.", bn: "শ্রী শক্তিধাম দর্শন আমার জীবনের এক স্মরণীয় অভিজ্ঞতা। এখানকার দিব্য শক্তি ও শান্ত পরিবেশে আমার চোখে আনন্দাশ্রু এসেছিল।", hi: "श्री शक्तिधाम के दर्शन मेरे जीवन का अविस्मरणीय अनुभव था। दिव्य ऊर्जा और शांत वातावरण ने मेरी आँखों में खुशी के आँसू ला दिए।" } },
  { name: "Rajesh Kumar", location: "Delhi", text: { en: "The architecture is breathtaking and the morning aarti is simply soul-stirring. A must-visit for every devotee.", bn: "মন্দিরের স্থাপত্য অপূর্ব এবং সকালের আরতি হৃদয় ছুঁয়ে যায়। প্রত্যেক ভক্তের একবার অবশ্যই আসা উচিত।", hi: "मंदिर की वास्तुकला अद्भुत है और सुबह की आरती मन को छू लेती है। हर भक्त को यहाँ अवश्य आना चाहिए।" } },
  { name: "Ananya Patel", location: "Ahmedabad", text: { en: "I booked an online puja for my family and the experience was incredibly smooth. The temple's digital services are truly commendable.", bn: "পরিবারের জন্য অনলাইনে পূজা বুক করেছিলাম এবং পুরো প্রক্রিয়াটি খুব সহজ ছিল। মন্দিরের ডিজিটাল পরিষেবা সত্যিই প্রশংসনীয়।", hi: "मैंने अपने परिवार के लिए ऑनलाइन पूजा बुक की और प्रक्रिया बहुत आसान रही। मंदिर की डिजिटल सेवाएँ सचमुच सराहनीय हैं।" } },
  { name: "Dr. Suresh Iyer", location: "Chennai", text: { en: "As a historian, I'm amazed by the preservation of this ancient temple. The carvings and inscriptions are invaluable treasures.", bn: "ইতিহাসবিদ হিসেবে এই প্রাচীন মন্দিরের সংরক্ষণ দেখে আমি মুগ্ধ। এখানকার খোদাই ও শিলালিপি অমূল্য সম্পদ।", hi: "एक इतिहासकार के रूप में इस प्राचीन मंदिर का संरक्षण देखकर मैं प्रभावित हूँ। यहाँ की नक्काशी और शिलालेख अमूल्य धरोहर हैं।" } },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [current, setCurrent] = useState(0);
  const { language } = useLanguage();

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="section-padding bg-background">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "ভক্তদের অভিজ্ঞতা", en: "Devotee Experiences", hi: "भक्तों के अनुभव" })}
          subtitle={languageText(language, { bn: "দিব্য কৃপায় যাঁদের জীবন ছুঁয়ে গেছে, তাঁদের কথা শুনুন", en: "Hear from those who have been touched by divine grace", hi: "दिव्य कृपा का अनुभव करने वालों की बातें सुनें" })}
        />

        <div ref={ref} className={`mx-auto max-w-3xl ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative rounded-2xl border border-border bg-card p-8 shadow-gold md:p-12">
            <Quote size={48} className="absolute left-6 top-6 text-primary/15" />
            <div className="relative">
              <p className="mb-6 font-heading text-lg leading-relaxed text-foreground md:text-xl">
                "{languageText(language, testimonials[current].text)}"
              </p>
              <div>
                <div className="font-display text-lg font-bold text-primary">{testimonials[current].name}</div>
                <div className="font-body text-sm text-muted-foreground">{testimonials[current].location}</div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === current ? "w-8 bg-primary" : "w-2 bg-border"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
