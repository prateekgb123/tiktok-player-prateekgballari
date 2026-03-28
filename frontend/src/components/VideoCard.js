import { useRef, useEffect, useState } from "react";
import ActionBar from "./ActionBar";
import ProgressBar from "./ProgressBar";
import CommentModal from "./CommentModal";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoCard({ video, active }) {
  const ref = useRef();
  const lastTapRef = useRef(0);
  const isActionClick = useRef(false);

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

  // ✅ This is ONLY for the ActionBar like button
  const handleLike = () => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikes((count) => count + (newLiked ? 1 : -1));
      return newLiked;
    });
  };

  // ✅ FIXED TAP HANDLER — double-tap manages its own state, never calls handleLike()
  const handleTap = () => {
    if (isActionClick.current) {
      isActionClick.current = false;
      return;
    }

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      lastTapRef.current = 0;

      // ✅ Directly mutate state — does NOT call handleLike()
      // This prevents double-firing when ActionBar like button is also hit
      setShowHeart(true);
      setLiked((prev) => {
        if (!prev) setLikes((c) => c + 1); // only +1 if not already liked
        return true; // double-tap always sets liked = true
      });
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
        onLoadedData={(e) => {
          setLoading(false);
          e.target.classList.add("loaded");
        }}
      />

      {/* PLAY ICON */}
      {showPlayIcon && (
        <div className="playPauseIcon">
          {play ? <Pause size={80} /> : <Play size={80} />}
        </div>
      )}

      {/* LOADER */}
      {loading && <div className="loader" />}

      {/* HEART */}
      {showHeart && <div className="heartAnim">❤️</div>}

      {/* ACTION BAR */}
      <ActionBar
        video={video}
        liked={liked}
        likes={likes}
        onLike={handleLike}
        commentCount={comments.length}
        onCommentClick={() => setShowComments(true)}
        setActionClick={(val) => (isActionClick.current = val)}
      />

      {/* BOTTOM */}
      <div className="bottom">
        <p>@{video.user.name}</p>
        <p>
          {expanded ? video.description : video.description.slice(0, 40)}
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

      {/* MUTE */}
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
        <CommentModal
          comments={comments}
          addComment={addComment}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}