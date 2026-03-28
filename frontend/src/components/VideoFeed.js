import { useEffect, useRef, useState } from "react";
import { videos } from "../assets/Videos";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  const containerRef = useRef(null);

  // 🔥 clone videos
  const loopedVideos = [
    videos[videos.length - 1],
    ...videos,
    videos[0]
  ];

  const [activeIndex, setActiveIndex] = useState(1); // start from first real video

  const isManualScroll = useRef(false);

  // 🔥 scroll to correct position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const child = container.children[activeIndex];
    if (child) {
      child.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeIndex]);

  // 🔥 infinite loop fix (IMPORTANT)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      // last clone → jump to first real
      if (activeIndex === loopedVideos.length - 1) {
        setTimeout(() => {
          setActiveIndex(1);
          container.scrollTo({
            top: container.clientHeight * 1,
            behavior: "auto"
          });
        }, 300);
      }

      // first clone → jump to last real
      if (activeIndex === 0) {
        setTimeout(() => {
          setActiveIndex(videos.length);
          container.scrollTo({
            top: container.clientHeight * videos.length,
            behavior: "auto"
          });
        }, 300);
      }
    };

    handleScrollEnd();
  }, [activeIndex]);

  // 🔥 keyboard navigation (loop safe)
  useEffect(() => {
    const handleKey = (e) => {
  if (e.key === "ArrowUp") {
    setActiveIndex((prev) => prev + 1); // 🔥 next
  }

  if (e.key === "ArrowDown") {
    setActiveIndex((prev) => prev - 1); // 🔥 previous
  }
};

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🔥 observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
      {loopedVideos.map((video, index) => (
        <div
          key={index}
          data-index={index}
          className={`wrapper ${
            index === activeIndex ? "active" : ""
          }`}
        >
          <VideoCard video={video} active={index === activeIndex} />
        </div>
      ))}
    </div>
  );
}