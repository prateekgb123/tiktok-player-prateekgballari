import { useEffect, useRef, useState } from "react";
import { videos } from "../assets/Videos";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const isManualScroll = useRef(false);
  const scrollTimeout = useRef(null);

  // 🔥 Keyboard navigation
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

      if (e.key === " ") {
        e.preventDefault();
        const video = document.querySelector(".active video");
        if (video) {
          video.paused ? video.play() : video.pause();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🔥 Smooth scroll to active video
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const child = container.children[activeIndex];
    if (child) {
      child.scrollIntoView({ behavior: "smooth" });
    }

    // reset flag AFTER scroll finishes
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 600);

  }, [activeIndex]);

  // 🔥 Observer (ONLY when not manual)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !isManualScroll.current
          ) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
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
        <div
          key={video.id}
          data-index={index}
          className={`wrapper ${index === activeIndex ? "active" : ""}`}
        >
          <VideoCard video={video} active={index === activeIndex} />
        </div>
      ))}
    </div>
  );
}