import { SidebarItem } from "./sideBarItem";
import { TwitterIcon } from "../icons/twitterIcon";
import { YoutubeIcon } from "../icons/youtubeIcon";
import { BrainIcon } from "../icons/brainIcon";

export function Sidebar() {
    return <div className="h-screen bg-white w-72 fixed left-0 top-0 border-r">
        <div className="pt-4">
            <div className=" flex text-2xl pt-4 items-center ">
                <div className="pr-2 text-purple-600"> <BrainIcon /></div>
               
                Secound Brain
            </div>
            <SidebarItem text="Twitter" icon={<TwitterIcon />} />
            <SidebarItem text="YouTube" icon={<YoutubeIcon />} />
        </div> 
    </div>
}