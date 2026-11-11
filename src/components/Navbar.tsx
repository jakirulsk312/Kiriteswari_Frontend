import { useState, useEffect } from "react";
import { Flower2, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { languageLabel, languageText, Language, useLanguage } from "@/lib/language";

const navLinks = [
  { label: { bn: "পরিচিতি", en: "About", hi: "परिचय" }, href: "#about" },
  { label: { bn: "সময়সূচি", en: "Timings", hi: "समय-सारणी" }, href: "#timings" },
  { label: { bn: "গ্যালারি", en: "Gallery", hi: "चित्र दीर्घा" }, href: "#gallery" },
  { label: { bn: "ভিডিও", en: "Videos", hi: "वीडियो" }, href: "#videos" },
  { label: { bn: "উৎসব", en: "Events", hi: "उत्सव" }, href: "#events" },
  { label: { bn: "সেবা", en: "Services", hi: "सेवाएँ" }, href: "#services" },
  { label: { bn: "সদস্য", en: "Members", hi: "सदस्य" }, href: "/members" },
  { label: { bn: "যোগাযোগ", en: "Contact", hi: "संपर्क" }, href: "#contact" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  const languagePicker = (
    <select
      aria-label="Website language"
      value={language}
      onChange={(event) => setLanguage(event.target.value as Language)}
      className="rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
    >
      {(["bn", "en", "hi"] as const).map((option) => (
        <option key={option} value={option}>{languageLabel(option)}</option>
      ))}
    </select>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false); // close mobile menu

    if (href.startsWith("#")) {
      // scroll on same page
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: href } });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // navigate to another route
      navigate(href);
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[9999] transition-all duration-500 ${
        scrolled ? "bg-background/95 shadow-lg backdrop-blur-md" : "bg-background/90 backdrop-blur-md"
      }`}
    >
      <div className="container-temple flex min-h-16 items-center justify-between py-2 md:min-h-20">
        {/* Logo */}
        <Link to="/" className="flex max-w-[calc(100%-3.5rem)] items-center gap-2.5 font-display text-base font-bold leading-tight tracking-wide text-foreground sm:max-w-[55%] sm:text-lg 2xl:max-w-80">
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-300/60 bg-gradient-to-br from-rose-800 via-red-700 to-orange-600 text-amber-100 shadow-sm sm:size-10">
            <Flower2 size={22} strokeWidth={2.1} />
          </span>
          <span className="font-bengali">কিরীটেশ্বরী শক্তিপীঠ</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 2xl:flex">
          <div className="flex items-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className="whitespace-nowrap rounded-md px-2 py-2 font-body text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-primary xl:px-2.5 xl:text-sm"
              >
                {languageText(language, link.label)}
              </button>
            ))}
          </div>

          <div className="ml-1 flex shrink-0 items-center gap-2">
            {languagePicker}
            <Link
              to="/booking"
              className="rounded-lg border border-primary/30 bg-background px-4 py-2 font-body text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {languageText(language, { bn: "বুকিং", en: "Booking", hi: "बुकिंग" })}
            </Link>
            <Link
              to="/donate"
              className="rounded-lg bg-gradient-saffron px-5 py-2 font-body text-sm font-semibold text-primary-foreground shadow-saffron transition-transform hover:scale-105"
            >
              {languageText(language, { bn: "অনুদান দিন", en: "Donate Now", hi: "दान करें" })}
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="text-foreground 2xl:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background/98 backdrop-blur-lg 2xl:hidden">
          <div className="container-temple flex flex-col gap-2 py-4">
            <div className="grid grid-cols-2 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="rounded-md px-3 py-3 text-left font-body text-sm text-foreground hover:bg-muted hover:text-primary"
                >
                  {languageText(language, link.label)}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-2">
              {languagePicker}
              <Link
                to="/booking"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-primary/30 bg-background px-5 py-3 text-center font-body text-sm font-semibold text-foreground"
              >
                {languageText(language, { bn: "বুকিং", en: "Booking", hi: "बुकिंग" })}
              </Link>
              <Link
                to="/donate"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gradient-saffron px-5 py-3 text-center font-body text-sm font-semibold text-primary-foreground shadow-saffron"
              >
                {languageText(language, { bn: "অনুদান দিন", en: "Donate Now", hi: "दान करें" })}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
