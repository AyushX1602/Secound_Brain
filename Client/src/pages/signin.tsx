import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BackendURL } from "../config";
import { Input } from "../components/input";
import { Button } from "../components/button";

export function signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    
    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        console.log("Attempting signin with:", { username, password });
        
        try {
            const response = await axios.post(BackendURL + "/api/v1/signin", {
                username,
                password
            });
            
            console.log("Signin response:", response.data);
            
            const jwtToken = response.data.token;
            localStorage.setItem("jwtToken", jwtToken);
            navigate("/dashboard");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Signin failed:", error.response?.data);
                alert(`Signin failed: ${error.response?.data?.message || "Invalid credentials"}`);
            } else {
                console.error("Signin failed:", error);
                alert("Signin failed");
            }
        }
    }

    return <div className="h-screen w-screen bg-grey-200 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg min-w-48 p-8">
            <Input placeholder="Username" ref={usernameRef}/>
            <Input placeholder="Password" ref={passwordRef} type="password"/>
            <Button onClick={signin} variant="primary" text="Sign In" fullWidth={true} loading={false}/>
        </div>
    </div>
}

export default signin;