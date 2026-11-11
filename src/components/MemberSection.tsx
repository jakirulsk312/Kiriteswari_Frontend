import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { toWhatsAppNumber } from "@/lib/contact";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

type MemberType = "committee" | "purohit";

interface Member {
  _id: string;
  name: TextValue;
  type: MemberType;
  templeRole: TextValue;
  professionDesignation?: TextValue;
  phone?: string;
}

interface MemberSectionProps {
  standalone?: boolean;
}

const MemberSection = ({ standalone = true }: MemberSectionProps) => {
  const { language } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [activeType, setActiveType] = useState<MemberType>("committee");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiRequest<{ data?: Member[] }>("/members")
      .then((response) => {
        if (active) setMembers(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("load-failed");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleMembers = members.filter((member) => member.type === activeType);

  return (
    <>
      {standalone && <Navbar />}
      <section className={`${standalone ? "min-h-screen pb-20 pt-28" : "section-padding"} bg-background`}>
        <div className="container-temple">
          <div className="mb-10 text-center">
            <p className="font-bengali text-sm font-semibold text-primary">{languageText(language, { bn: "শ্রী শ্রী৺রী কিরীটেশ্বরী মাতা জয়তী", en: "Victory to Sri Sri Kiriteswari Mata", hi: "श्री श्री किरीटेश्वरी माता की जय" })}</p>
            <h1 className="mt-2 font-bengali text-3xl font-bold text-foreground md:text-4xl">{languageText(language, { bn: "মন্দির পরিচালনা ও সেবকবৃন্দ", en: "Temple Committee & Priests", hi: "मंदिर समिति और पुजारी" })}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              {languageText(language, { bn: "মন্দির কমিটি এবং পূজারিদের হালনাগাদ তালিকা।", en: "Updated list of temple committee members and priests.", hi: "मंदिर समिति के सदस्यों और पुजारियों की नवीनतम सूची।" })}
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-xl border border-border bg-card p-1" role="tablist" aria-label={languageText(language, { bn: "সদস্যের তালিকা", en: "Member list", hi: "सदस्य सूची" })}>
              <button
                type="button"
                role="tab"
                aria-selected={activeType === "committee"}
                onClick={() => setActiveType("committee")}
                className={`rounded-lg px-5 py-2.5 font-bengali text-sm font-semibold transition-colors ${
                  activeType === "committee" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {languageText(language, { bn: "কমিটি তালিকা", en: "Committee", hi: "समिति" })}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeType === "purohit"}
                onClick={() => setActiveType("purohit")}
                className={`rounded-lg px-5 py-2.5 font-bengali text-sm font-semibold transition-colors ${
                  activeType === "purohit" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {languageText(language, { bn: "পুরোহিত তালিকা", en: "Priests", hi: "पुजारी" })}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted-foreground">{languageText(language, { bn: "তালিকা লোড হচ্ছে...", en: "Loading list...", hi: "सूची लोड हो रही है..." })}</p>
          ) : error ? (
            <p role="alert" className="py-12 text-center text-destructive">{languageText(language, { bn: "তালিকা লোড করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।", en: "Could not load the list. Please try again later.", hi: "सूची लोड नहीं हो सकी। कृपया थोड़ी देर बाद फिर प्रयास करें।" })}</p>
          ) : visibleMembers.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              {languageText(language, { bn: "এই তালিকায় এখনো কোনো নাম প্রকাশ করা হয়নি। তথ্যের জন্য মন্দির পরিচালনা কমিটির সঙ্গে যোগাযোগ করুন।", en: "No names have been published yet. Please contact the temple committee for information.", hi: "इस सूची में अभी तक कोई नाम प्रकाशित नहीं हुआ है। जानकारी के लिए मंदिर समिति से संपर्क करें।" })}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleMembers.map((member) => (
                <Card key={member._id} className="text-center shadow-sm transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-bengali text-xl text-foreground">{getLocalizedText(member.name, language)}</CardTitle>
                    <p className="font-bengali font-semibold text-primary">{getLocalizedText(member.templeRole, language)}</p>
                    {member.professionDesignation && (
                      <p className="text-sm text-muted-foreground">{getLocalizedText(member.professionDesignation, language)}</p>
                    )}
                    {member.phone && (
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <a
                          href={`tel:${member.phone}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Phone size={15} />
                          {languageText(language, { bn: "ফোন করুন", en: "Call", hi: "कॉल करें" })}
                        </a>
                        <a
                          href={`https://wa.me/${toWhatsAppNumber(member.phone)}?text=${encodeURIComponent(languageText(language, { bn: "নমস্কার, পুরোহিত সেবার বিষয়ে জানতে চাই।", en: "Hello, I would like to ask about purohit services.", hi: "नमस्ते, मैं पुरोहित सेवा के बारे में पूछना चाहता/चाहती हूँ।" }))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
                        >
                          <MessageCircle size={15} />
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      {standalone && <Footer />}
    </>
  );
};

export default MemberSection;
