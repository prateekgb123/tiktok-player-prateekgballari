import { useState } from "react";
import VideoFeed from "./components/VideoFeed";

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "dark" : "light"}>
      <button className="themeToggle" onClick={() => setDark(!dark)}>
        {dark ? "☀️" : "🌙"}
      </button>
      <VideoFeed />
    </div>
  );
}