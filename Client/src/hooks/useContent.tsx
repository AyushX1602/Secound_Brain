import axios from "axios";
import { useEffect, useState } from "react";
import { BackendURL } from "../config";

interface Content {
    id: string;
    title: string;
    link: string;
    type: "tweet" | "video" | "article";
}

export function useContent() {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            console.log("No token found, redirecting to signin");
            window.location.href = "/signin";
            return;
        }

        console.log("Fetching content with token:", token);

        axios.get(`${BackendURL}/api/v1/content`, {
            headers: {
                "Authorization": token
            }
        })
            .then((response) => {
                console.log("Content fetched successfully:", response.data);
                // Map _id to id and normalize types for frontend compatibility
                const mappedContents = response.data.contents.map((content: any) => {
                    // Normalize type: twitter -> tweet, youtube -> video
                    let normalizedType = content.type;
                    if (content.type === 'twitter') normalizedType = 'tweet';
                    if (content.type === 'youtube') normalizedType = 'video';

                    return {
                        ...content,
                        id: content._id,
                        type: normalizedType
                    };
                });
                setContents(mappedContents);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch contents:", error.response?.data);
                console.error("Error status:", error.response?.status);
                console.error("Full error:", error);
                if (error.response?.status === 401) {
                    console.log("Token invalid, clearing and redirecting");
                    alert("Session expired. Please sign in again.");
                    localStorage.removeItem("jwtToken");
                    setTimeout(() => {
                        window.location.href = "/signin";
                    }, 1000);
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        refresh();
    }, []);

    return { contents, refresh, loading };
}
export default useContent;