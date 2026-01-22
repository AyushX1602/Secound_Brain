import { ArticleIcon } from "../icons/ArticleIcon";
import { DeleteIcon } from "../icons/deleteIcon";
import { ShareIcon } from "../icons/shareIcon";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BackendURL } from "../config";

interface CardProps {
  title: string;
  link: string;
  type: "tweet" | "video" | "article";
  contentId: string;
  onDelete: () => void;
  isSharedView?: boolean;
}

declare global {
  interface Window {
    twttr: any;
  }
}

export function Card({ title, link, type, contentId, onDelete, isSharedView = false }: CardProps) {
  const twitterRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log("Card props - contentId:", contentId, "title:", title);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("jwtToken");
      console.log("Deleting content with ID:", contentId);
      
      const response = await axios.delete(`${BackendURL}/api/v1/content`, {
        data: { contentId },
        headers: {
          "Authorization": token
        }
      });
      
      console.log("Delete response:", response.data);
      onDelete();
    } catch (error) {
      console.error("Failed to delete:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        alert(`Failed to delete: ${error.response?.data?.message || error.message}`);
      } else {
        alert("Failed to delete content");
      }
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: link
        });
      } else {
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  useEffect(() => {
    if (type !== "tweet") return;

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
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-purple-500 flex-shrink-0">
            <ArticleIcon />
          </div>
          <span className="font-medium text-gray-800 truncate">{title}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {!isSharedView && (
            <>
              <button
                onClick={handleShare}
                className="text-gray-400 hover:text-purple-500 transition-colors cursor-pointer"
                title="Share"
              >
                <ShareIcon />
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <DeleteIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-grow">{type === "tweet" && (
        <div ref={twitterRef}>
          <blockquote className="twitter-tweet" data-theme="light">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        </div>
      )}

      {type === "video" && (
        <iframe
          className="w-full aspect-video rounded-lg"
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

      {type === "article" && (
        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-start gap-3">
            <div className="text-purple-500 mt-1">
              <ArticleIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{title}</h3>
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline flex items-center gap-1"
              >
                Read Article 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
              <p className="text-xs text-gray-500 mt-2 truncate">{link}</p>
            </div>
          </div>
        </div>
      )}</div>
    </div>
  );
}
