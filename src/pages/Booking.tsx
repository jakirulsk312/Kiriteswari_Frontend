import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, Mail, MessageCircle, Phone, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";
import { toWhatsAppNumber } from "@/lib/contact";
import { sendAdminNotification } from "@/lib/notifications";

type Purohit = {
  _id: string;
  name: TextValue;
  type: "committee" | "purohit";
  phone: string;
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  serviceType: "puja",
  purohit: "",
  requestedDate: "",
  notes: "",
};

const BookingPage = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationSent, setNotificationSent] = useState<boolean | null>(null);
  const [purohits, setPurohits] = useState<Purohit[]>([]);
  const [purohitLoadFailed, setPurohitLoadFailed] = useState(false);
  const [lastBooking, setLastBooking] = useState<typeof initialForm | null>(null);

  useEffect(() => {
    let active = true;

    apiRequest<{ data?: Purohit[] }>("/members")
      .then((response) => {
        if (active) {
          setPurohits(Array.isArray(response.data) ? response.data.filter((member) => member.type === "purohit") : []);
        }
      })
      .catch(() => {
        if (active) setPurohitLoadFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submittedBooking = { ...formData };

    try {
      await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          serviceType: formData.serviceType,
          ...(formData.purohit ? { purohit: formData.purohit } : {}),
          requestedDate: formData.requestedDate,
          notes: formData.notes,
        }),
      });

      const requestedPurohit = purohits.find((member) => member._id === submittedBooking.purohit);
      const emailSent = await sendAdminNotification({
        subject: `New temple booking: ${submittedBooking.serviceType}`,
        message: [
          "A visitor submitted a new booking request.",
          "",
          `Service: ${submittedBooking.serviceType}`,
          `Name: ${submittedBooking.name}`,
          `Email: ${submittedBooking.email}`,
          `Phone: ${submittedBooking.phone}`,
          `Preferred date: ${submittedBooking.requestedDate || "Not provided"}`,
          `Requested purohit: ${requestedPurohit ? getLocalizedText(requestedPurohit.name, language) : "Not selected"}`,
          `Purohit phone: ${requestedPurohit?.phone || "Not available"}`,
          "",
          "Notes:",
          submittedBooking.notes || "None",
          "",
          `Review and respond: ${window.location.origin}/admin`,
        ].join("\n"),
        replyTo: submittedBooking.email,
      });

      setSubmitted(true);
      setNotificationSent(emailSent);
      setLastBooking(submittedBooking);
      setFormData(initialForm);
    } catch (error) {
      alert(error instanceof Error ? error.message : languageText(language, { bn: "বুকিং অনুরোধ পাঠানো যায়নি।", en: "Failed to submit booking request.", hi: "बुकिंग अनुरोध भेजा नहीं जा सका।" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPurohit = lastBooking?.purohit
    ? purohits.find((member) => member._id === lastBooking.purohit)
    : undefined;
  const whatsappBookingText = lastBooking
    ? [
        "Hello, I have submitted a temple service booking request.",
        `Name: ${lastBooking.name}`,
        `Phone: ${lastBooking.phone}`,
        `Service: ${lastBooking.serviceType}`,
        `Preferred date: ${lastBooking.requestedDate || "Not specified"}`,
        `Notes: ${lastBooking.notes || "None"}`,
      ].join("\n")
    : "";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background pt-28">
        <div className="container-temple mx-auto px-4 py-12">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{languageText(language, { bn: "সেবার অনুরোধ", en: "Seva Request", hi: "सेवा अनुरोध" })}</p>
            <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              {languageText(language, { bn: "পূজা বা মন্দিরের সেবা বুক করুন", en: "Book a Puja or Temple Service", hi: "पूजा या मंदिर सेवा बुक करें" })}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-1">
                  <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
                    <User size={16} className="text-primary" /> {languageText(language, { bn: "পূর্ণ নাম", en: "Full name", hi: "पूरा नाम" })}
                  </span>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder={languageText(language, { bn: "আপনার পূর্ণ নাম", en: "Your full name", hi: "आपका पूरा नाम" })}
                  />
                </label>

                <label className="space-y-2 md:col-span-1">
                  <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
                    <Mail size={16} className="text-primary" /> {languageText(language, { bn: "ইমেইল ঠিকানা", en: "Email address", hi: "ईमेल पता" })}
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="space-y-2 md:col-span-1">
                  <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
                    <Phone size={16} className="text-primary" /> {languageText(language, { bn: "ফোন নম্বর", en: "Phone number", hi: "फ़ोन नंबर" })}
                  </span>
                  <input
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="+91 98765 43210"
                  />
                </label>

                <label className="space-y-2 md:col-span-1">
                  <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
                    <CalendarClock size={16} className="text-primary" /> {languageText(language, { bn: "সেবার ধরন", en: "Service type", hi: "सेवा का प्रकार" })}
                  </span>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="puja">{languageText(language, { bn: "পূজা", en: "Puja", hi: "पूजा" })}</option>
                    <option value="purohit">{languageText(language, { bn: "পুরোহিত / আচার সেবা", en: "Purohit / Ritual Service", hi: "पुरोहित / अनुष्ठान सेवा" })}</option>
                    <option value="mela-stall">{languageText(language, { bn: "মেলার স্টল / অনুষ্ঠান সহায়তা", en: "Mela Stall / Event Support", hi: "मेला स्टॉल / कार्यक्रम सहायता" })}</option>
                  </select>
                </label>

                {formData.serviceType === "purohit" && (
                  <label className="space-y-2 md:col-span-2">
                    <span className="font-body text-sm font-medium text-foreground">
                      {languageText(language, { bn: "পুরোহিত বাছাই (ঐচ্ছিক)", en: "Choose a purohit (optional)", hi: "पुरोहित चुनें (वैकल्पिक)" })}
                    </span>
                    <select
                      name="purohit"
                      value={formData.purohit}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">
                        {languageText(language, { bn: "পরে মন্দিরের সঙ্গে আলোচনা করব", en: "I will discuss this with the temple", hi: "मैं मंदिर से बाद में चर्चा करूँगा/करूँगी" })}
                      </option>
                      {purohits.map((purohit) => (
                        <option key={purohit._id} value={purohit._id}>
                          {getLocalizedText(purohit.name, language)}{purohit.phone ? ` · ${purohit.phone}` : ""}
                        </option>
                      ))}
                    </select>
                    {purohitLoadFailed && (
                      <span role="status" className="block text-xs text-muted-foreground">
                        {languageText(language, { bn: "পুরোহিতদের তালিকা এখন লোড হয়নি। সদস্য তালিকা দেখুন বা অনুরোধ পাঠান।", en: "The priest list could not be loaded. You can still submit a request or view the member list.", hi: "पुजारियों की सूची लोड नहीं हुई। आप अनुरोध भेज सकते हैं या सदस्य सूची देख सकते हैं।" })}
                      </span>
                    )}
                  </label>
                )}

                <label className="space-y-2 md:col-span-2">
                  <span className="font-body text-sm font-medium text-foreground">{languageText(language, { bn: "পছন্দের তারিখ", en: "Preferred date", hi: "पसंदीदा तिथि" })}</span>
                  <input
                    type="date"
                    name="requestedDate"
                    value={formData.requestedDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="font-body text-sm font-medium text-foreground">{languageText(language, { bn: "নোট / প্রার্থনার অনুরোধ", en: "Notes / prayer request", hi: "टिप्पणी / प्रार्थना अनुरोध" })}</span>
                  <textarea
                    name="notes"
                    rows={5}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder={languageText(language, { bn: "আপনার পছন্দের আচার, পরিবারের তথ্য বা প্রার্থনার বিষয় লিখুন।", en: "Tell us your preferred ritual, family details, or prayer intentions.", hi: "अपना पसंदीदा अनुष्ठान, परिवार का विवरण या प्रार्थना का उद्देश्य लिखें।" })}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gradient-saffron px-6 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? languageText(language, { bn: "পাঠানো হচ্ছে...", en: "Submitting...", hi: "भेजा जा रहा है..." })
                  : languageText(language, { bn: "বুকিং অনুরোধ পাঠান", en: "Submit booking request", hi: "बुकिंग अनुरोध भेजें" })}
              </button>

              {submitted && (
                <div className="mt-4 space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    {languageText(language, { bn: "আপনার বুকিং অনুরোধ সফলভাবে পাঠানো হয়েছে। আমাদের দল শীঘ্রই যোগাযোগ করবে।", en: "Your booking request was submitted successfully. Our team will contact you shortly.", hi: "आपका बुकिंग अनुरोध सफलतापूर्वक भेजा गया है। हमारी टीम जल्द संपर्क करेगी।" })}
                  </p>
                  {notificationSent === false && (
                    <p className="pl-7 text-xs text-amber-800">
                      {languageText(language, { bn: "ইমেল সতর্কতা পাঠানো যায়নি, তবে আপনার বুকিং সংরক্ষিত হয়েছে।", en: "The email alert could not be sent, but your booking has been saved.", hi: "ईमेल सूचना नहीं भेजी जा सकी, लेकिन आपकी बुकिंग सहेज ली गई है।" })}
                    </p>
                  )}
                  {selectedPurohit?.phone && lastBooking && (
                    <div className="flex flex-wrap gap-2 pl-7">
                      <a
                        href={`https://wa.me/${toWhatsAppNumber(selectedPurohit.phone)}?text=${encodeURIComponent(whatsappBookingText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                      >
                        <MessageCircle size={16} />
                        {languageText(language, { bn: "WhatsApp-এ পুরোহিতকে পাঠান", en: "Message purohit on WhatsApp", hi: "WhatsApp पर पुरोहित को संदेश भेजें" })}
                      </a>
                      <a
                        href={`tel:${selectedPurohit.phone}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 px-3 py-2 text-sm font-semibold hover:bg-emerald-100"
                      >
                        <Phone size={16} />
                        {languageText(language, { bn: "ফোন করুন", en: "Call", hi: "कॉल करें" })}
                      </a>
                    </div>
                  )}
                  {lastBooking?.serviceType === "purohit" && !selectedPurohit && (
                    <a href="/members" className="ml-7 inline-block font-semibold underline underline-offset-2">
                      {languageText(language, { bn: "পুরোহিতদের ফোন ও WhatsApp নম্বর দেখুন", en: "View priests' phone and WhatsApp contacts", hi: "पुजारियों के फ़ोन और WhatsApp संपर्क देखें" })}
                    </a>
                  )}
                </div>
              )}
            </form>

            <aside className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-6 shadow-sm md:p-8">
              <h2 className="font-display text-3xl font-bold text-foreground">{languageText(language, { bn: "আমাদের সঙ্গে কেন বুক করবেন?", en: "Why book with us?", hi: "हमारे साथ बुकिंग क्यों करें?" })}</h2>
              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-primary" />
                  {languageText(language, { bn: "মন্দিরের আচার ও পূজার জন্য সুবিধাজনক অনলাইন সময় নির্ধারণ।", en: "Convenient online scheduling for temple rituals and pujas.", hi: "मंदिर के अनुष्ठानों और पूजा के लिए सुविधाजनक ऑनलाइन समय निर्धारण।" })}
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-primary" />
                  {languageText(language, { bn: "পারিবারিক প্রার্থনা ও উৎসবের অনুষ্ঠানে ব্যক্তিগত সহায়তা।", en: "Personalized support for family prayers and festival ceremonies.", hi: "पारिवारिक प्रार्थनाओं और उत्सव समारोहों के लिए व्यक्तिगत सहायता।" })}
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-primary" />
                  {languageText(language, { bn: "বিশেষ উপলক্ষ ও সেবার অনুরোধে মন্দিরের নিবেদিত সহায়তা।", en: "Dedicated temple assistance for special occasions and seva requests.", hi: "विशेष अवसरों और सेवा अनुरोधों के लिए मंदिर की समर्पित सहायता।" })}
                </li>
              </ul>

              <div className="mt-8 rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{languageText(language, { bn: "সাহায্য দরকার?", en: "Need help?", hi: "सहायता चाहिए?" })}</p>
                <p className="mt-3 font-body text-sm text-foreground">
                  {languageText(language, { bn: "জরুরি বা বড় অনুষ্ঠানের আয়োজনের জন্য মন্দির কার্যালয়ে ফোন বা বার্তা পাঠান।", en: "Call or message the temple office for urgent or large event arrangements.", hi: "तत्काल या बड़े आयोजन की व्यवस्था के लिए मंदिर कार्यालय को कॉल या संदेश करें।" })}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookingPage;
