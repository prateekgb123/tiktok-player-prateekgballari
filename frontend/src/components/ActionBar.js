import { useState } from "react";

export default function ActionBar({ video }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="actions">
      <button onClick={handleLike}>❤️ {likes}</button>
      <button>💬 {video.comments}</button>
      <button>🔗 {video.shares}</button>
      <button>🔖</button>
    </div>
  );
}