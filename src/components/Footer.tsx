
import { languageText, useLanguage } from "@/lib/language";

const Footer = () => {
  const { language } = useLanguage();
  const quickLinkLabels = [
    { en: "About", bn: "পরিচিতি", hi: "परिचय" },
    { en: "Timings", bn: "সময়সূচি", hi: "समय-सारणी" },
    { en: "Gallery", bn: "গ্যালারি", hi: "चित्र दीर्घा" },
    { en: "Events", bn: "উৎসব", hi: "उत्सव" },
    { en: "Services", bn: "সেবা", hi: "सेवाएँ" },
    { en: "Contact", bn: "যোগাযোগ", hi: "संपर्क" },
  ];

  return (
  <footer className="bg-temple-dark py-12">
    <div className="container-temple">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-display text-xl font-bold text-primary-foreground">
            <span className="text-primary">🙏</span>{" "}
            <span className="font-bengali">কিরীটেশ্বরী মন্দির</span>
          </h3>
          <p className="font-body text-sm leading-relaxed text-primary-foreground/60">
            <span className="mb-2 block font-bengali text-primary-foreground/80">
              {languageText(language, { bn: "শ্রী শ্রী৺রী কিরীটেশ্বরী মাতা জয়তী", en: "Victory to Sri Sri Kiriteswari Mata", hi: "श्री श्री किरीटेश्वरी माता की जय" })}
            </span>
            <span className="mb-3 block font-bengali text-xs leading-relaxed">
              <span aria-hidden="true" className="mr-1">🙏</span>
              শ্রী শ্রী৺রী কিরীটেশ্বরী মাতার নিত্য-সেবা, পূজা ও মন্দির সংস্কার পরিচালন কমিটি
            </span>
           
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-heading text-base font-semibold text-primary-foreground">
            {languageText(language, { bn: "দ্রুত লিংক", en: "Quick Links", hi: "त्वरित लिंक" })}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinkLabels.map((link) => (
              <a
                key={link.en}
                href={`#${link.en.toLowerCase()}`}
                className="font-body text-sm text-primary-foreground/60 transition-colors hover:text-primary"
              >
                {languageText(language, link)}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-heading text-base font-semibold text-primary-foreground">
            {languageText(language, { bn: "কীভাবে পৌঁছাবেন", en: "How to Reach", hi: "कैसे पहुँचें" })}
          </h4>
          <div className="space-y-1 font-body text-sm text-primary-foreground/60">
            <p>{languageText(language, { bn: "আজিমগঞ্জ জংশন: ৬ কিমি", en: "Azimganj JN Station: 6 km", hi: "आजिमगंज जंक्शन: ६ किमी" })}</p>
            <p>{languageText(language, { bn: "ডাহাপাড়া ধাম স্টেশন: ২ কিমি", en: "Dahapara Dham Station: 2 km", hi: "दहापाड़ा धाम स्टेशन: २ किमी" })}</p>
            <p>{languageText(language, { bn: "লালবাগ কোর্ট রোড স্টেশন: ৫ কিমি", en: "Lalbag Court Road Station: 5 km", hi: "लालबाग कोर्ट रोड स्टेशन: ५ किमी" })}</p>
            <p>{languageText(language, { bn: "পলসন্ডা মোড়, NH 12: ৯ কিমি", en: "Palsonda Morh, NH 12: 9 km", hi: "पलसोंडा मोड़, NH 12: ९ किमी" })}</p>
            <p>{languageText(language, { bn: "নবগ্রাম–লালবাগ রোড", en: "Nabagram–Lalbag Road", hi: "नवग्राम–लालबाग रोड" })}</p>
            <p className="text-primary">{languageText(language, { bn: "বছরের ৩৬৫ দিন খোলা", en: "Open all 365 days", hi: "वर्ष के सभी ३६५ दिन खुला" })}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center">
        <p className="font-body text-xs text-primary-foreground/40">
          {languageText(language, {
            bn: `© ${new Date().getFullYear()}শ্রী শ্রী কিরীটেশ্বরী মাতা জয়তী 🙏। সর্বস্বত্ব সংরক্ষিত। ভক্তিভরে নির্মিত 🙏`,
            en: `© ${new Date().getFullYear()} Glory to Sri Sri Kiriteswari Mata 🙏. All rights reserved. | Built with devotion 🙏`,
            hi: `© ${new Date().getFullYear()} श्री श्री किरीटेश्वरी माता की जय 🙏। सर्वाधिकार सुरक्षित। भक्ति से निर्मित 🙏`,
          })}
        </p>

        <p className="mt-2 font-body text-xs text-primary-foreground/40">
          {languageText(language, { bn: "নির্মাতা: ", en: "Developed by ", hi: "निर्माता: " })}
          <a
  href="https://jakirulsk.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-sky-500 hover:underline"
>
  Jakirul Sk
</a>

        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
