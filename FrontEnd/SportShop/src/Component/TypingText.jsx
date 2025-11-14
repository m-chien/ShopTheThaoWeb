import gsap from "gsap";
import { useEffect } from "react";

const TypingText = ({ text }) => {
  useEffect(() => {
    gsap.fromTo(
      ".jump-char",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.2, ease: "power1.out" },
    );
  }, []);

  return (
    <span style={{ whiteSpace: "pre" }}>
      {text.split("").map((char, i) => (
        <span key={i} className="jump-char" style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default TypingText;
