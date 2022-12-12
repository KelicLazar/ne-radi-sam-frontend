import { useState } from "react";
import { useEffect } from "react";

const ToTop = () => {
  const [isVisible, setIsVisible] = useState(window.scrollY > 1000);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const listenToScroll = () => {
    let heightToHideFrom = 1500;
    const winScroll = window.scrollY;

    if (winScroll > heightToHideFrom) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <div onClick={scrollToTop} className={`arrow ${isVisible ? "" : "hidden"}`}>
      <i className="uil uil-arrow-up"></i>
    </div>
  );
};

export default ToTop;
