import React, { useState } from "react";
import { MapPin, Phone, Train, Navigation, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { apiRequest } from "@/lib/api";
import { languageText, useLanguage } from "@/lib/language";
import { sendAdminNotification } from "@/lib/notifications";

const ContactSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const emailSent = await sendAdminNotification({
        subject: `New temple enquiry: ${formData.subject}`,
        message: [
          "A visitor submitted a new enquiry.",
          "",
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Phone: ${formData.phone || "Not provided"}`,
          `Subject: ${formData.subject}`,
          "",
          "Message:",
          formData.message,
          "",
          `Review and respond: ${window.location.origin}/admin`,
        ].join("\n"),
        replyTo: formData.email,
      });

      alert(emailSent
        ? languageText(language, { bn: "বার্তা সফলভাবে পাঠানো হয়েছে!", en: "Message sent successfully!", hi: "संदेश सफलतापूर्वक भेजा गया!" })
        : languageText(language, { bn: "আপনার বার্তা জমা হয়েছে, তবে ইমেল সতর্কতা পাঠানো যায়নি। প্রয়োজনে ফোনে যোগাযোগ করুন।", en: "Your message was saved, but the email alert could not be sent. Please contact us by phone if needed.", hi: "आपका संदेश सहेज लिया गया, लेकिन ईमेल सूचना नहीं भेजी जा सकी। आवश्यकता हो तो फ़ोन से संपर्क करें।" }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      alert(error instanceof Error
        ? error.message
        : languageText(language, { bn: "বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।", en: "Failed to send message. Please try again.", hi: "संदेश नहीं भेजा जा सका। कृपया फिर प्रयास करें।" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-section">
      <div className="container-temple">
        <SectionHeading
          title={languageText(language, { bn: "কীভাবে কিরীটেশ্বরী মন্দিরে পৌঁছাবেন", en: "How to Reach Kiriteswari Temple Murshidabad", hi: "किरीटेश्वरी मंदिर मुर्शिदाबाद कैसे पहुँचें" })}
          subtitle={languageText(language, {
            bn: "পশ্চিমবঙ্গের ৫১ শক্তিপীঠের অন্যতম কিরীটেশ্বরী মন্দিরে যাওয়ার ঠিকানা, পথনির্দেশ ও যাতায়াতের তথ্য",
            en: "Location, directions, transport options, and travel information for visiting Kiriteswari Mandir, one of the 51 Shakti Peethas in West Bengal",
            hi: "पश्चिम बंगाल के ५१ शक्तिपीठों में से एक किरीटेश्वरी मंदिर तक पहुँचने के लिए स्थान, मार्ग और यात्रा जानकारी",
          })}
        />

        <p className="mx-auto mb-10 max-w-3xl text-center font-body text-muted-foreground">
          {languageText(language, {
            bn: "কিরীটেশ্বরী মন্দির ভারতের পশ্চিমবঙ্গের মুর্শিদাবাদ জেলার কিরীটেশ্বরী গ্রামে অবস্থিত। সড়ক ও রেলপথে সহজেই মন্দিরে পৌঁছানো যায়। ভাগীরথী নদীর কাছে অবস্থিত মন্দিরটি লালবাগ শহর ও আশপাশের যাতায়াত কেন্দ্রগুলির সঙ্গে সুসংযুক্ত।",
            en: "Kiriteswari Temple is located in Kiriteswari village in the Murshidabad district of West Bengal, India. Devotees and tourists can easily reach the temple by road and railway. The temple lies near the Bhagirathi River and is well connected to Lalbag town and nearby transportation hubs.",
            hi: "किरीटेश्वरी मंदिर भारत के पश्चिम बंगाल के मुर्शिदाबाद जिले के किरीटेश्वरी गाँव में स्थित है। भक्त और पर्यटक सड़क और रेल से आसानी से मंदिर पहुँच सकते हैं। भागीरथी नदी के पास स्थित यह मंदिर लालबाग और आसपास के यातायात केंद्रों से अच्छी तरह जुड़ा है।",
          })}
        </p>

        <div ref={ref} className="grid gap-8 lg:grid-cols-2">
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <form className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-sm" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-body text-sm font-medium text-foreground">{languageText(language, { bn: "পূর্ণ নাম", en: "Full Name", hi: "पूरा नाम" })}</label>
                  <input name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={languageText(language, { bn: "আপনার নাম", en: "Your name", hi: "आपका नाम" })} />
                </div>

                <div>
                  <label className="mb-1.5 block font-body text-sm font-medium text-foreground">{languageText(language, { bn: "ইমেইল", en: "Email", hi: "ईमेल" })}</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-foreground">{languageText(language, { bn: "ফোন (ঐচ্ছিক)", en: "Phone (optional)", hi: "फ़ोन (वैकल्पिक)" })}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="+91 98765 43210" />
              </div>

              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-foreground">{languageText(language, { bn: "বিষয়", en: "Subject", hi: "विषय" })}</label>
                <input name="subject" required value={formData.subject} onChange={handleChange} className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={languageText(language, { bn: "কীভাবে সাহায্য করতে পারি?", en: "How can we help?", hi: "हम आपकी कैसे सहायता कर सकते हैं?" })} />
              </div>

              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-foreground">{languageText(language, { bn: "বার্তা", en: "Message", hi: "संदेश" })}</label>
                <textarea name="message" required value={formData.message} onChange={handleChange} rows={4} className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={languageText(language, { bn: "আপনার বার্তা...", en: "Your message...", hi: "आपका संदेश..." })} />
              </div>

              <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-saffron px-6 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">
                <Send size={16} />
                {isSubmitting
                  ? languageText(language, { bn: "পাঠানো হচ্ছে...", en: "Sending...", hi: "भेजा जा रहा है..." })
                  : languageText(language, { bn: "বার্তা পাঠান", en: "Send Message", hi: "संदेश भेजें" })}
              </button>
            </form>
          </div>

          <div className={`space-y-6 ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: languageText(language, { bn: "মন্দিরের ঠিকানা", en: "Temple Address", hi: "मंदिर का पता" }), value: languageText(language, { bn: "কিরীটেশ্বরী মন্দির, কিরীটেশ্বরী গ্রাম, নবগ্রাম, লালবাগ মহকুমা, মুর্শিদাবাদ, পশ্চিমবঙ্গ, ভারত", en: "Kiriteswari Temple, Kiriteswari Village, Nabagram, Lalbag Subdivision, Murshidabad, West Bengal, India", hi: "किरीटेश्वरी मंदिर, किरीटेश्वरी गाँव, नवग्राम, लालबाग उपखंड, मुर्शिदाबाद, पश्चिम बंगाल, भारत" }) },
                { icon: Train, label: languageText(language, { bn: "নিকটতম রেলস্টেশন", en: "Nearest Railway Station", hi: "निकटतम रेलवे स्टेशन" }), value: languageText(language, { bn: "আজিমগঞ্জ জংশন (৬ কিমি), দহাপাড়া ধাম (২ কিমি) এবং লালবাগ কোর্ট রোড (৫ কিমি)", en: "Azimganj JN Station (6 km), Dahapara Dham Station (2 km) and Lalbag Court Road Station (5 km)", hi: "आजिमगंज जंक्शन (६ किमी), दहापाड़ा धाम (२ किमी) और लालबाग कोर्ट रोड (५ किमी)" }) },
                { icon: Navigation, label: languageText(language, { bn: "অবস্থানের স্থানাঙ্ক", en: "Location Coordinates", hi: "स्थान निर्देशांक" }), value: languageText(language, { bn: "২৪°১২′০″ উত্তর ৮৮°১৩′৭″ পূর্ব — ভাগীরথী নদীর তীরে", en: "24°12′0″N 88°13′7″E — Near Bhagirathi River bank", hi: "२४°१२′०″ उत्तर ८८°१३′७″ पूर्व — भागीरथी नदी के तट के पास" }) },
                { icon: Phone, label: languageText(language, { bn: "NH12 থেকে সড়কপথ", en: "Road Connectivity From NH12", hi: "NH12 से सड़क संपर्क" }), value: languageText(language, { bn: "নবগ্রাম–লালবাগ রোড সরাসরি কিরীটেশ্বরী গ্রামের সঙ্গে যুক্ত", en: "Nabagram–Lalbag Road connects directly to Kiriteswari village", hi: "नवग्राम–लालबाग रोड सीधे किरीटेश्वरी गाँव से जुड़ता है" }) },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-saffron text-primary-foreground">
                    <item.icon size={18} />
                  </div>

                  <div>
                    <div className="font-body text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</div>
                    <div className="font-body text-sm text-foreground">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-border shadow-sm">
              <iframe
                title={languageText(language, { bn: "কিরীটেশ্বরী মন্দিরের মানচিত্র", en: "Kiriteswari Temple Map", hi: "किरीटेश्वरी मंदिर का नक्शा" })}
                src="https://www.google.com/maps?q=Kiriteswari%20Temple%20Murshidabad&output=embed"
                className="h-[280px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
