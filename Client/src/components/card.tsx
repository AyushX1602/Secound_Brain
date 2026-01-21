import { ShareIcon } from "../icons/shareIcon";
import { useEffect, useRef } from "react";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube" | "article";
}

declare global {
  interface Window {
    twttr: any;
  }
}

export function Card({ title, link, type }: CardProps) {
  const twitterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type !== "twitter") return;

    const loadTwitterWidget = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(twitterRef.current);
      }
    };

    // If script already loaded
    if (window.twttr) {
      loadTwitterWidget();
      return;
    }

    // Load script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      console.log("Twitter script loaded");
      loadTwitterWidget();
    };

    script.onerror = () => {
      console.error("Failed to load Twitter script");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [type, link]);

  return (
    <div className="p-8 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <div className="text-gray-500 pr-2">
            <ShareIcon />
          </div>
          {title}
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500"
        >
          <ShareIcon />
        </a>
      </div>

      {/* CONTENT */}
      {type === "twitter" && (
        <div ref={twitterRef}>
          <blockquote className="twitter-tweet" data-theme="light">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        </div>
      )}

      {type === "youtube" && (
        <iframe
          className="w-full rounded-md"
          src={link
            .replace("youtu.be/", "www.youtube.com/embed/")
            .replace("watch?v=", "embed/")
            .split("?")[0]}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}
