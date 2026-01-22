import { RefObject } from "react";

interface InputProps {
    placeholder: string;
    ref: RefObject<HTMLInputElement>;
    type?: string;
}

export function Input({ placeholder, ref, type }: InputProps) {
    return <div>
        <input
            ref={ref}
            placeholder={placeholder}
            type={type || "text"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />
    </div>
}