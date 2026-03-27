import { useEffect, useRef, useState } from "react";

export default function VideoCard({ video, active }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(true);
  const [likes, setLikes] = useState(video.likes);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [follow, setFollow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    if (active) {
      const playPromise = ref.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      setPlay(true);
    } else {
      ref.current.pause();
      setPlay(false);
    }
  }, [active]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!ref.current) return;

    if (play) {
      ref.current.pause();
    } else {
      ref.current.play().catch(() => {});
    }

    setPlay(!play);
  };

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikes((l) => l + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleTime = () => {
    const v = ref.current;
    if (v?.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  let pressTimer;

  const handlePressStart = () => {
    pressTimer = setTimeout(() => {
      ref.current.pause();
    }, 200);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer);
    ref.current.play().catch(() => {});
  };

  return (
    <div
      className="card"
      onClick={togglePlay}
      onDoubleClick={handleDoubleTap}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
    >
      {loading && <div className="skeleton" />}

      <video
        ref={ref}
        src={video.url}
        muted={mute}
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setLoading(false)}
        onTimeUpdate={handleTime}
      />

      {showHeart && <div className="bigHeart">❤️</div>}

      <div className="rightBar">
        <img src={video.user.avatar} />
        <button onClick={() => setFollow(!follow)}>
          {follow ? "Following" : "Follow"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
            setLikes(liked ? likes - 1 : likes + 1);
          }}
        >
          ❤️ {likes}
        </button>

        <button>💬 {video.comments}</button>
        <button>🔗 {video.shares}</button>
        <button>🔖</button>
      </div>

      <div className="bottom">
        <p>@{video.user.name}</p>
        <p>{video.description}</p>
      </div>

      <button
        className="mute"
        onClick={(e) => {
          e.stopPropagation();
          setMute(!mute);
        }}
      >
        {mute ? "🔇" : "🔊"}
      </button>

      <div className="disc" />

      <div className="progress">
        <div style={{ width: progress + "%" }} />
      </div>
    </div>
  );
}
