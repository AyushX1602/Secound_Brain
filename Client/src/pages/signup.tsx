import { use, useRef } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { BackendURL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function signup() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            await axios.post(BackendURL + "/api/v1/signup", {
                username,
                password
            });
            alert("Signup Successful");
            navigate("/signin");
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed");
        }
    }
    return <div className="h-screen w-screen bg-grey-200 flex
    justify-center items-center">
        <div className="bg-white p-8 rounded-lg min-w-48 p-8">
        <Input ref={usernameRef} placeholder="Username"/>
        <Input ref={passwordRef} placeholder="Password"/>
        <div className="flex justify-center pt-4">
        <Button 
            onClick={signup}
            loading={false} 
            variant="primary" 
            text="Sign Up" 
            fullWidth={true}
        />
        </div>
     </div>
    </div>
}

export default signup;