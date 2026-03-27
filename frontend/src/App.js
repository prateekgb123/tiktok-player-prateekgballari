import { useState } from "react";
import { Sun, Moon } from "lucide-react"; // ✅ import icons
import VideoFeed from "./components/VideoFeed";

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      
      <button
        className="themeToggle"
        onClick={() => setDark(!dark)}
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <VideoFeed />
    </div>
  );
}