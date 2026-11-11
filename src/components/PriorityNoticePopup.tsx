import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BellRing } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api";
import { getLocalizedText, languageText, TextValue, useLanguage } from "@/lib/language";

type Announcement = {
  _id: string;
  title: TextValue;
  message: TextValue;
  category?: TextValue;
  priority?: string;
  showPopup?: boolean;
};

const PriorityNoticePopup = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState<Announcement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    if (location.pathname.startsWith("/admin")) {
      return () => {
        active = false;
      };
    }

    const loadPriorityNotice = async () => {
      try {
        const response = await apiRequest<{ data?: Announcement[] }>("/announcements");
        const priorityNotice = response.data?.find((announcement) => {
          const hasText = getLocalizedText(announcement.title, language) || getLocalizedText(announcement.message, language);
          return announcement.priority === "high" && announcement.showPopup !== false && Boolean(hasText);
        });

        if (!active || !priorityNotice) return;
        if (localStorage.getItem(`kiriteswari-dismissed-notice-${priorityNotice._id}`)) return;
        setNotice(priorityNotice);
        setOpen(true);
      } catch (error) {
        console.error("Failed to load homepage priority notice", error);
      }
    };

    loadPriorityNotice();
    return () => {
      active = false;
    };
  }, [language, location.pathname]);

  const dismiss = () => {
    if (notice) {
      localStorage.setItem(`kiriteswari-dismissed-notice-${notice._id}`, "true");
    }
    setOpen(false);
  };

  if (!notice || location.pathname.startsWith("/admin")) return null;

  const title = getLocalizedText(notice.title, language);
  const message = getLocalizedText(notice.message, language);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss();
        else setOpen(true);
      }}
    >
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-rose-200 bg-rose-50 p-6 sm:p-8">
        <DialogHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BellRing size={24} aria-hidden="true" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {getLocalizedText(notice.category, language) ||
              languageText(language, { bn: "জরুরি বিজ্ঞপ্তি", en: "Important notice", hi: "महत्वपूर्ण सूचना" })}
          </p>
          <DialogTitle className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {title || languageText(language, { bn: "বিশেষ বিজ্ঞপ্তি", en: "Special notice", hi: "विशेष सूचना" })}
          </DialogTitle>
          {message && (
            <DialogDescription className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {message}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-4 flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            {languageText(language, { bn: "এখন এড়িয়ে যান", en: "Skip now", hi: "अभी छोड़ें" })}
          </button>
          <button
            type="button"
            onClick={() => {
              dismiss();
              navigate("/booking");
            }}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {languageText(language, { bn: "বুকিং করতে এগিয়ে যান", en: "Continue to booking", hi: "बुकिंग के लिए आगे बढ़ें" })}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityNoticePopup;
