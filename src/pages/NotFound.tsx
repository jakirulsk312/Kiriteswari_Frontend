import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { languageText, useLanguage } from "@/lib/language";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{languageText(language, { bn: "দুঃখিত! পৃষ্ঠাটি পাওয়া যায়নি", en: "Oops! Page not found", hi: "क्षमा करें! पृष्ठ नहीं मिला" })}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {languageText(language, { bn: "হোম পেজে ফিরুন", en: "Return to Home", hi: "मुखपृष्ठ पर लौटें" })}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
