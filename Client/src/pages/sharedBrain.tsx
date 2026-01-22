import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BackendURL } from "../config";
import { Card } from "../components/card";
import { BrainIcon } from "../icons/brainIcon";

interface Content {
    _id: string;
    title: string;
    link: string;
    type: "tweet" | "video" | "article";
}

function SharedBrain() {
    const { shareLink } = useParams<{ shareLink: string }>();
    const [contents, setContents] = useState<Content[]>([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSharedContent = async () => {
            try {
                const response = await axios.get(`${BackendURL}/api/v1/brain/${shareLink}`);
                setContents(response.data.content);
                setUsername(response.data.username);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch shared brain:", error);
                setError("Failed to load shared brain. The link may be invalid or expired.");
                setLoading(false);
            }
        };

        if (shareLink) {
            fetchSharedContent();
        }
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-purple-600 mb-4 flex justify-center">
                        <BrainIcon />
                    </div>
                    <p className="text-gray-600">Loading shared brain...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 mb-4 text-5xl">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-purple-600">
                            <BrainIcon />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">{username}'s Brain</h1>
                    </div>
                    <p className="text-gray-500">Explore {username}'s saved content collection</p>
                </div>

                {contents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No content shared yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {contents.map((content) => (
                            <Card
                                key={content._id}
                                contentId={content._id}
                                title={content.title}
                                link={content.link}
                                type={content.type}
                                onDelete={() => {}}
                                isSharedView={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SharedBrain;
