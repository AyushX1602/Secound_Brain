import { useState } from "react";
import { Button } from "./components/button";
import { Card } from "./components/card";
import { CreateContentModal } from "./components/CreateContentModal";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/shareIcon";
import { Sidebar } from "./components/sidebar";
function App() {

  const[modalOpen,setModalOpen]= useState(false);

  return (
    <div className="p-4">
      <Sidebar />
      <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
      <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} /> 
      <div className="flex justify-end  gap-4">
      <Button variant="secondary" text="share brain" startIcon={<ShareIcon />}></Button>

      <Button onClick={() => setModalOpen(true)} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button> 
      </div>

      <div className="flex gap-4">
      <Card type="twitter" link="https://x.com/AyushX1602/status/1992647906487304221" title="trump chicha" />
      <Card type="youtube" link="https://youtu.be/xz-vkzhvKc4?si=7awuGZU3A_cp29ac" title="ratatata" />
      </div>
    </div>
    </div>
  );
}

export default App;