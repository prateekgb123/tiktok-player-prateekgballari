import { useState } from "react";

export default function CommentModal({ onClose }) {
  const [comments, setComments] = useState([
    { user: "prateek", text: "Nice 🔥" },
  ]);
  const [text, setText] = useState("");

  return (
    <div className="commentModal" onClick={onClose}>
      <div className="commentBox" onClick={(e) => e.stopPropagation()}>
        <h3>Comments</h3>

        {/* COMMENT LIST */}
        <div className="commentList">
          {comments.map((c, i) => (
            <div key={i} className="commentItem">
              <img
                src={`https://i.pravatar.cc/150?img=${i + 1}`}
                alt="user"
              />
              <div className="commentContent">
                <span className="commentUser">{c.user}</span>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="commentInput">
          <input
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={() => {
              if (!text.trim()) return;
              setComments([
                ...comments,
                { user: "you", text }
              ]);
              setText("");
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}