export default function PlayPauseIcon({ isPlaying }) {
  return (
    <div className="centerIcon">
      {isPlaying ? "⏸" : "▶"}
    </div>
  );
}
