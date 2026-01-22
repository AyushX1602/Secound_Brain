import { useState } from "react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/shareIcon";
import { Sidebar } from "../components/sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BackendURL } from "../config";

function Dashboard() {

  const[modalOpen,setModalOpen]= useState(false);
  const[selectedFilter, setSelectedFilter] = useState('all');
  const[shareModalOpen, setShareModalOpen] = useState(false);
  const[shareLink, setShareLink] = useState('');
  const { contents, refresh } = useContent();
  
  const filteredContents = selectedFilter === 'all' 
    ? contents 
    : contents.filter(content => content.type === selectedFilter);
  
  const handleShareBrain = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(`${BackendURL}/api/v1/brain/share`, 
        { share: true },
        {
          headers: {
            "Authorization": token
          }
        }
      );
      
      const fullLink = `${window.location.origin}/share/${response.data.hash}`;
      setShareLink(fullLink);
      setShareModalOpen(true);
    } catch (error) {
      console.error("Failed to create share link:", error);
      alert("Failed to create share link");
    }
  };
  
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      <div className="ml-72 p-8">
        <CreateContentModal open={modalOpen} onClose={() => {
          setModalOpen(false);
          refresh();
        }} /> 
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Brain</h1>
            <p className="text-gray-500 mt-1">All your saved content in one place</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleShareBrain} variant="secondary" text="Share Brain" startIcon={<ShareIcon />}></Button>
            <Button onClick={() => setModalOpen(true)} variant="primary" text="Add Content" startIcon={<PlusIcon />}></Button> 
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShareModalOpen(false)}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Brain</h2>
                <p className="text-gray-600 mb-6">Anyone with this link can view your saved content</p>
                
                <div className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={shareLink} 
                    readOnly 
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <Button onClick={copyShareLink} variant="primary" text="Copy" />
                </div>
                
                <Button onClick={() => setShareModalOpen(false)} variant="secondary" text="Close" fullWidth={true} />
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredContents.map((content) => (
          <Card 
            key={content.id} 
            contentId={content.id}
            title={content.title} 
            link={content.link}
            type={content.type}
            onDelete={refresh}
          />
        ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;