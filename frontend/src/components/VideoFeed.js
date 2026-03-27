import { useEffect, useRef, useState } from "react";
import { videos } from "../assets/Videos";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const isManualScroll = useRef(false); // 🔥 FIX FLAG

  // ✅ Keyboard navigation (UP / DOWN)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        isManualScroll.current = true;
        setActiveIndex((prev) => (prev + 1) % videos.length);
      }

      if (e.key === "ArrowUp") {
        isManualScroll.current = true;
        setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ✅ Scroll to active video smoothly
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const child = container.children[activeIndex];
    if (child) {
      child.scrollIntoView({ behavior: "smooth" });
    }

    // 🔥 Reset manual flag after scroll completes
    const timer = setTimeout(() => {
      isManualScroll.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // ✅ Detect visible video (auto play sync)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 🔥 IMPORTANT FIX
          if (entry.isIntersecting && !isManualScroll.current) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.7 }
    );

    const elements = containerRef.current.children;
    Array.from(elements).forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="feed" ref={containerRef}>
      {videos.map((video, index) => (
        <div key={video.id} data-index={index} className="wrapper">
          <VideoCard video={video} active={index === activeIndex} />
        </div>
      ))}
    </div>
  );
}