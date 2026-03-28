import { useRef, useEffect, useState } from "react";
import ActionBar from "./ActionBar";
import ProgressBar from "./ProgressBar";
import CommentModal from "./CommentModal";
import { Volume2, VolumeX } from "lucide-react";

export default function VideoCard({ video, active }) {
  const ref = useRef();
  const lastTapRef = useRef(0);

  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(false);

  // 🔥 LIKE STATE (moved here)
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video?.likes || 120);

  // autoplay
  useEffect(() => {
    if (!ref.current) return;

    if (active) {
      ref.current.play().catch(() => {});
      setPlay(true);
    } else {
      ref.current.pause();
      setPlay(false);
    }
  }, [active]);

  // play/pause
  const togglePlay = () => {
    if (!ref.current) return;

    if (play) ref.current.pause();
    else ref.current.play().catch(() => {});
    setPlay(!play);
  };

  // progress
  const handleTime = () => {
    const v = ref.current;
    if (v?.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  // 🔥 LIKE HANDLER
  const handleLike = () => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikes((count) => (newLiked ? count + 1 : count - 1));
      return newLiked;
    });
  };

  // 🔥 DOUBLE TAP LOGIC
  const handleTap = () => {
    const now = Date.now();

    if (now - lastTapRef.current < 300) {
      // ❤️ DOUBLE TAP
      setShowHeart(true);

      // only LIKE (not unlike)
      if (!liked) {
        setLiked(true);
        setLikes((count) => count + 1);
      }

      setTimeout(() => setShowHeart(false), 600);
    } else {
      togglePlay();
    }

    lastTapRef.current = now;
  };

  return (
    <div className="card" onClick={handleTap}>
      
      {/* VIDEO */}
      <video
        ref={ref}
        src={video.url}
        muted={mute}
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleTime}
        onLoadedData={() => setLoading(false)}
      />

      {/* LOADER */}
      {loading && <div className="loader" />}

      {/* ❤️ HEART ANIMATION */}
      {showHeart && <div className="heartAnim">❤️</div>}

      {/* RIGHT ACTIONS */}
      <ActionBar
        video={video}
        liked={liked}
        likes={likes}
        onLike={handleLike}
        onCommentClick={() => setShowComments(true)}
      />

      {/* BOTTOM INFO */}
      <div className="bottom">
        <p>@{video.user.name}</p>

        <p>
          {expanded
            ? video.description
            : video.description.slice(0, 40)}

          {video.description.length > 40 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? " less" : "...more"}
            </span>
          )}
        </p>
      </div>

      {/* SOUND */}
      <button
        className="muteBtn"
        onClick={(e) => {
          e.stopPropagation();
          setMute(!mute);
        }}
      >
        {mute ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>

      {/* PROGRESS */}
      <ProgressBar progress={progress} />

      {/* COMMENTS */}
      {showComments && (
        <CommentModal onClose={() => setShowComments(false)} />
      )}
    </div>
  );
}