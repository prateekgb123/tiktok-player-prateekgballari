import { useRef, useEffect, useState } from "react";
import ActionBar from "./ActionBar";
import ProgressBar from "./ProgressBar";
import CommentModal from "./CommentModal";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoCard({ video, active }) {
  const ref = useRef();
  const lastTapRef = useRef(0);
  const isActionClick = useRef(false);

  // 🔥 NEW
  const isLongPress = useRef(false);
  const pressTimer = useRef(null);

  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video?.likes || 120);

  const [comments, setComments] = useState([
    { user: "user", text: "Nice 🔥" },
    { user: "user", text: "Amazing 😍" }
  ]);

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

    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 1000);
  };

  // progress
  const handleTime = () => {
    const v = ref.current;
    if (v?.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  // like button ONLY
  const handleLike = () => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikes((count) => count + (newLiked ? 1 : -1));
      return newLiked;
    });
  };

  // 🔥 LONG PRESS
  const handlePointerDown = () => {
    if (isActionClick.current) return;

    isLongPress.current = false;

    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;

      if (ref.current) {
        ref.current.pause();
        setPlay(false);
      }
    }, 250);
  };

  const handlePointerUp = () => {
    clearTimeout(pressTimer.current);

    if (isLongPress.current) {
      if (ref.current) {
        ref.current.play().catch(() => {});
        setPlay(true);
      }
    }
  };

  const handlePointerLeave = () => {
    clearTimeout(pressTimer.current);
  };

  // 🔥 TAP HANDLER (FIXED)
  const handleTap = () => {
    if (isActionClick.current) {
      setTimeout(() => (isActionClick.current = false), 100);
      return;
    }

    if (isLongPress.current) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      lastTapRef.current = 0;

      setShowHeart(true);

      if (!liked) {
        setLiked(true);
        setLikes((c) => c + 1);
      }

      setTimeout(() => setShowHeart(false), 600);
    } else {
      lastTapRef.current = now;

      setTimeout(() => {
        if (lastTapRef.current === now) {
          togglePlay();
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const addComment = (text) => {
    if (!text.trim()) return;
    setComments((prev) => [...prev, { user: "user", text }]);
  };
   const getShortText = (text) => {
  const words = text.split(" ");
  return words.slice(0, 2).join(" ");
};
  return (
    <div
      className="card"
      onClick={handleTap}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <video
        ref={ref}
        src={video.url}
        muted={mute}
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleTime}
        onLoadedData={(e) => {
          setLoading(false);
          e.target.classList.add("loaded");
        }}
      />

      {showPlayIcon && (
        <div className="playPauseIcon">
          {play ? <Pause size={80} /> : <Play size={80} />}
        </div>
      )}

      {loading && <div className="loader" />}
      {showHeart && <div className="heartAnim">❤️</div>}

      <ActionBar
        video={video}
        liked={liked}
        likes={likes}
        onLike={handleLike}
        commentCount={comments.length}
        onCommentClick={() => setShowComments(true)}
        setActionClick={(val) => (isActionClick.current = val)}
      />

      <div className="bottom">
  <p className="username">@{video.user.name}</p>



<p className="description">
  {expanded ? video.description : getShortText(video.description)}

  {video.description.split(" ").length > 2 && (
    <span
      className="moreBtn"
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(!expanded);
      }}
    >
      {expanded ? " less" : " ...more"}
    </span>
  )}
</p>
</div>

      <button
        className="muteBtn"
        onClick={(e) => {
          e.stopPropagation();
          setMute(!mute);
        }}
      >
        {mute ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>

      <ProgressBar progress={progress} />

      {showComments && (
        <CommentModal
          comments={comments}
          addComment={addComment}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}