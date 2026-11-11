import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="
        fixed bottom-6 right-6 z-50
        bg-primary text-white
        p-3 rounded-full
        shadow-lg
        transition-all duration-300
        hover:scale-110
        animate-bounce
      "
    >
      <ChevronUp size={26} />
    </button>
  );
};

export default ScrollToTopButton;
