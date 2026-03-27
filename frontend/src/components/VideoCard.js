import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX
} from "lucide-react";

export default function VideoCard({ video, active }) {
  const ref = useRef();
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [follow, setFollow] = useState(false);

  // ✅ Auto play / pause
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

  // ✅ Play toggle
  const togglePlay = () => {
    if (!ref.current) return;

    if (play) {
      ref.current.pause();
    } else {
      ref.current.play().catch(() => {});
    }

    setPlay(!play);
  };

  // ✅ Double tap like
  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikes((l) => l + 1);
    }

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 700);
  };

  // ✅ Progress
  const handleTime = () => {
    const v = ref.current;
    if (v?.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  // ✅ Like button
  const handleLike = (e) => {
    e.stopPropagation();

    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div
  className="card"
  onClick={togglePlay}
  onDoubleClick={handleDoubleTap}

  // ✅ ADD THESE 2 LINES
  onMouseDown={() => ref.current?.pause()}
  onMouseUp={() => ref.current?.play()}
  onTouchStart={() => ref.current?.pause()}
onTouchEnd={() => ref.current?.play()}
>
  
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
{loading && <div className="loader" />}

      {/* ❤️ DOUBLE TAP HEART */}
      {showHeart && <div className="heartAnim">❤️</div>}

      {/* RIGHT ACTION BAR */}
      <div className="rightBar" onClick={(e) => e.stopPropagation()}>
        <img src={video.user.avatar} alt="avatar" />

        <button
          className="followBtn"
          onClick={() => setFollow(!follow)}
        >
          {follow ? "Following" : "Follow"}
        </button>

        <button className="iconBtn" onClick={handleLike}>
          <Heart
            size={28}
            fill={liked ? "red" : "none"}
            color={liked ? "red" : "white"}
          />
          <span>{likes}</span>
        </button>

        <button className="iconBtn">
          <MessageCircle size={28} />
          <span>{video.comments}</span>
        </button>

        <button className="iconBtn">
          <Share2 size={28} />
        </button>

        <button className="iconBtn">
          <Bookmark size={28} />
        </button>
      </div>

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

      {/* 🔊 SOUND */}
      <button
        className="muteBtn"
        onClick={(e) => {
          e.stopPropagation();
          setMute(!mute);
        }}
      >
        {mute ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>

      {/* 🎵 DISC */}
      <div className="disc" />

      {/* 📊 PROGRESS */}
      <div className="progress">
        <div style={{ width: progress + "%" }} />
      </div>
    </div>
  );
}