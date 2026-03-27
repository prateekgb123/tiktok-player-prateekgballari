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
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
const [commentText, setCommentText] = useState("");
const [comments, setComments] = useState([
  "Nice video 🔥",
  "Amazing content 😍"
]);
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

  {showComments && (
  <div className="commentModal" onClick={() => setShowComments(false)}>
    <div className="commentBox" onClick={(e) => e.stopPropagation()}>
      
      <h3>Comments</h3>

      <div className="commentList">
  {comments.map((c, i) => (
    <div key={i} className="commentItem">
      <img src={`https://i.pravatar.cc/40?img=${i}`} />
      <div className="commentContent">
        <div className="commentUser">@user{i}</div>
        <div>{c}</div>
      </div>
    </div>
  ))}
</div>

      <div className="commentInput">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add comment..."
        />
        <button
          onClick={() => {
            if (!commentText.trim()) return;
            setComments([...comments, commentText]);
            setCommentText("");
          }}
        >
          Post
        </button>
      </div>

    </div>
  </div>
)}
  
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
  color={liked ? "red" : "currentColor"}   // 🔥 stroke color
  fill={liked ? "red" : "none"}           // 🔥 fill inside
/>
          <span>{likes}</span>
        </button>

        <button
  className="iconBtn"
  onClick={(e) => {
    e.stopPropagation();
    setShowComments(true);
  }}
>
  <MessageCircle size={28} />
  <span>{comments.length}</span>
</button>

        <button
  className="iconBtn"
  onClick={async (e) => {
    e.stopPropagation();

    if (navigator.share) {
      await navigator.share({
        title: "Check this video",
        text: video.description,
        url: video.url
      });
    } else {
      navigator.clipboard.writeText(video.url);
      alert("Link copied!");
    }
  }}
>
  <Share2 size={28} />
</button>

        <button
  className="iconBtn"
  onClick={(e) => {
    e.stopPropagation();
    setSaved(!saved);
  }}
>
  <Bookmark
    size={28}
    color={saved ? "#ffd700" : "currentColor"} // gold color
    fill={saved ? "#ffd700" : "none"}
  />
  <span>{saved ? "Saved" : "Save"}</span>
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