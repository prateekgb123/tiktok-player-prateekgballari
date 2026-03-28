import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark
} from "lucide-react";

export default function ActionBar({
  video,
  liked,
  likes,
  onLike,
  onCommentClick
}) {
  const [saved, setSaved] = useState(false);
  const [follow, setFollow] = useState(false);

  const [comments] = useState([
    "Nice video 🔥",
    "Amazing content 😍"
  ]);

  return (
    <div className="rightBar" onClick={(e) => e.stopPropagation()}>
      
      {/* Avatar */}
      <img src={video?.user?.avatar} alt="avatar" />

      {/* Follow */}
      <button
        className="followBtn"
        onClick={() => setFollow(!follow)}
      >
        {follow ? "Following" : "Follow"}
      </button>

      {/* Like */}
      <button className="iconBtn" onClick={onLike}>
        <Heart
          size={28}
          color={liked ? "red" : "white"}
          fill={liked ? "red" : "none"}
        />
        <span>{likes}</span>
      </button>

      {/* Comment */}
      <button
        className="iconBtn"
        onClick={(e) => {
          e.stopPropagation();
          onCommentClick();
        }}
      >
        <MessageCircle size={28} color="white" />
        <span>{comments.length}</span>
      </button>

      {/* Share */}
      <button
        className="iconBtn"
        onClick={(e) => {
          e.stopPropagation();
          if (navigator.share) {
            navigator.share({
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
        <Share2 size={28} color="white" />
      </button>

      {/* Save */}
      <button
        className="iconBtn"
        onClick={(e) => {
          e.stopPropagation();
          setSaved(!saved);
        }}
      >
        <Bookmark
          size={28}
          color={saved ? "#ffd700" : "white"}
          fill={saved ? "#ffd700" : "none"}
        />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>

      {/* 🎵 Rotating Disc */}
      <div className="disc">
        <img src={video?.user?.avatar} alt="music" />
      </div>
    </div>
  );
}