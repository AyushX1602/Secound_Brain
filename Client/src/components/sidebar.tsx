import { SidebarItem } from "./sideBarItem";
import { TwitterIcon } from "../icons/twitterIcon";
import { YoutubeIcon } from "../icons/youtubeIcon";
import { BrainIcon } from "../icons/brainIcon";
import { ArticleIcon } from "../icons/ArticleIcon";
import { AllContentIcon } from "../icons/AllContentIcon";

interface SidebarProps {
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
}

export function Sidebar({ selectedFilter, onFilterChange }: SidebarProps) {
    return <div className="h-screen bg-white w-72 fixed left-0 top-0 border-r border-gray-200 shadow-sm">
        <div className="p-6">
            <div className="flex text-2xl font-bold items-center text-gray-900 mb-8">
                <div className="mr-3 text-purple-600"> <BrainIcon /></div>
                Second Brain
            </div>
            <div className="space-y-2">
                <SidebarItem 
                    text="All Content" 
                    icon={<AllContentIcon />} 
                    active={selectedFilter === 'all'}
                    onClick={() => onFilterChange('all')}
                />
                <SidebarItem 
                    text="Tweets" 
                    icon={<TwitterIcon />} 
                    active={selectedFilter === 'tweet'}
                    onClick={() => onFilterChange('tweet')}
                />
                <SidebarItem 
                    text="Videos" 
                    icon={<YoutubeIcon />} 
                    active={selectedFilter === 'video'}
                    onClick={() => onFilterChange('video')}
                />
                <SidebarItem 
                    text="Articles" 
                    icon={<ArticleIcon />} 
                    active={selectedFilter === 'article'}
                    onClick={() => onFilterChange('article')}
                />
            </div>
        </div> 
    </div>
}