import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

export default function ActionBar({
  video,
  liked,
  likes,
  onLike,
  onCommentClick,
  commentCount,
  setActionClick
}) {
  const [saved, setSaved] = useState(false);
  const [follow, setFollow] = useState(false);

  const handleAction = (cb) => (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setActionClick(true);
    cb && cb();
  };

  return (
    <div className="rightBar">
      {/* Avatar */}
      <img src={video?.user?.avatar} alt="avatar" />

      {/* Follow */}
      <button
        className="followBtn"
        onClick={handleAction(() => setFollow(!follow))}
      >
        {follow ? "Following" : "Follow"}
      </button>

      {/* ✅ Like — always rendered, no condition */}
      <button
        className="iconBtn"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          setActionClick(true);
          onLike();
        }}
      >
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
        onClick={handleAction(onCommentClick)}
      >
        <MessageCircle size={28} color="white" />
        <span>{commentCount}</span>
      </button>

      {/* Share */}
      <button
        className="iconBtn"
        onClick={handleAction(() => {
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
        })}
      >
        <Share2 size={28} color="white" />
      </button>

      {/* Save */}
      <button
        className="iconBtn"
        onClick={handleAction(() => setSaved(!saved))}
      >
        <Bookmark
          size={28}
          color={saved ? "#ffd700" : "white"}
          fill={saved ? "#ffd700" : "none"}
        />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>

      {/* Disc */}
      <div className="disc">
        <img src={video?.user?.avatar} alt="music" />
      </div>
    </div>
  );
}