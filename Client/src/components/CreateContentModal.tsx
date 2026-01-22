import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./button";
import { Input } from "./input";
import axios from "axios";
import { BackendURL } from "../config";

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateContentModal({open, onClose}: CreateContentModalProps) {

enum contentType{
    video="video",
    tweet="tweet",
    article="article"
}


    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type,setType] = useState<contentType>(contentType.video);

    async function addContent(){
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const token = localStorage.getItem("jwtToken");
        
        if (!token) {
            alert("Please log in first");
            window.location.href = "/signin";
            return;
        }
        
        try {
            await axios.post(`${BackendURL}/api/v1/content`,{ 
                link,
                title,
                type
            },{
                headers:{
                    "Authorization": token
                }
            });
            
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert("Session expired. Please log in again.");
                    localStorage.removeItem("jwtToken");
                    window.location.href = "/signin";
                } else {
                    console.error("Error details:", error.response?.data);
                    alert(`Failed to add content: ${error.response?.data?.message || error.message}`);
                }
            }
        }
    }

    return <div>
        {open && <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Add Content</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <CrossIcon/>
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <Input ref={titleRef} placeholder={"Title"}/>
                        <Input ref={linkRef} placeholder={"Paste your link here"}/>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
                            <div className="flex gap-2">
                                <Button text="Video" variant={type === contentType.video ? "primary" : "secondary"} onClick={() => setType(contentType.video)}></Button>
                                <Button text="Tweet" variant={type === contentType.tweet ? "primary" : "secondary"} onClick={() => setType(contentType.tweet)}></Button>
                                <Button text="Article" variant={type === contentType.article ? "primary" : "secondary"} onClick={() => setType(contentType.article)}></Button>
                            </div>
                        </div>
                        
                        <div className="pt-4">
                            <Button onClick={addContent} variant="primary" text="Add to Brain" fullWidth={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </>}
    </div>
}
export default CreateContentModal;
