import { useState } from "react";

export default function Overlay({ video }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overlay">
      <div className="user">
        <img src={video.user.avatar} alt="avatar" />
        <span>@{video.user.name}</span>
      </div>

      <p>
        {expanded ? video.description : video.description.slice(0, 50)}
        {video.description.length > 50 && (
          <span onClick={() => setExpanded(!expanded)}>
            {expanded ? " less" : "...more"}
          </span>
        )}
      </p>

      <span className="music">🎵 {video.music}</span>
    </div>
  );
}