import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text:string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantClasses ={
    "primary":"bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md",
    "secondary":"bg-purple-100 hover:bg-purple-200 text-purple-700"
}

const defaultStyles="px-5 py-2.5 rounded-lg font-medium flex items-center transition-all duration-200"

export function Button({variant,text,startIcon,onClick, fullWidth, loading}:ButtonProps){
    return <button onClick={onClick} className={variantClasses[variant] +" "+ defaultStyles + 
        (fullWidth ? " w-full flex justify-center items-center" : "") +
     (loading ? " opacity-50 cursor-not-allowed" : "")}>
        <div className="pr-2">{startIcon}</div>
        {text}

    </button>
   
}