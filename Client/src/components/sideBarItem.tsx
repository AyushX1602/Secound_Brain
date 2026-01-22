interface SidebarItemProps {
    text: string;
    icon: React.ReactElement;
    active?: boolean;
    onClick?: () => void;
}

export function SidebarItem({ text, icon, active, onClick }: SidebarItemProps) {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                active 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            <div className="w-5 h-5">
                {icon}
            </div>
            <div className="font-medium">
                {text}
            </div>
        </div>
    );
}