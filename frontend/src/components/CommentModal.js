import { useState } from "react";

export default function CommentModal({ comments, addComment, onClose }) {
  const [text, setText] = useState("");

  return (
    <div className="commentModal" onClick={onClose}>
      <div className="commentBox" onClick={(e) => e.stopPropagation()}>
        <h3>Comments</h3>

        <div className="commentList">
          {comments.map((c, i) => (
            <div key={i} className="commentItem">
              <img
                src={`https://i.pravatar.cc/150?img=${i + 1}`}
                alt="user"
              />
              <div>
                <span>{c.user}</span>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="commentInput">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />

          <button
            onClick={() => {
              addComment(text);   // ✅ ONLY THIS
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