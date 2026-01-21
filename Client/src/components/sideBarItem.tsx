interface SidebarItemProps {
    text: string;
    icon: React.ReactElement;
}

export function SidebarItem({ text, icon }: SidebarItemProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <div className="w-6 h-6">
                {icon}
            </div>
            <div className="text-gray-700">
                {text}
            </div>
        </div>
    );
}