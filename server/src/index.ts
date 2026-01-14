import express from "express";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken"; 
import {z} from "zod"; 
import bcrypt from "bcrypt";
import { contentModel, UserModel }  from "./db.js";
import { userMiddleware } from "./middleware.js";


const jwtSecretKey = "heyheyhey";

const app = express();

app.use(express.json());

app.post("/api/v1/signup", async(req,res)=>{
    const signupSchema = z.object({
        username : z.string().min(3),
        password : z.string().min(6).max(32)    
    });
     try{
        const {username, password} = signupSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password,5);
        await UserModel.create({
            username: username,
            password: hashedPassword
        })
        
        res.json({message:"signup successful"})
     }
     catch(err: any){
        if(err instanceof z.ZodError){
            res.status(400).json({error: "Invalid input", details: err.issues})
        } else if(err.code === 11000){
            res.status(409).json({error: "Username already exists"})
        } else {
            console.error("Signup error:", err);
            res.status(500).json({error: "Internal server error"})
        }
     }
})
 


app.post("/api/v1/signin",async(req,res)=>{
 const signinSchema = z.object({
    username : z.string().min(3),
    password : z.string().min(6).max(32)    
 });
    try{
        const{username, password} = signinSchema.parse(req.body);
        const user = await UserModel.findOne({ username: username});
        if(!user){
            return res.status(401).json({error: "Invalid username or password"});
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(!passwordMatch){
                return res.status(401).json({error: "Invalid username or password"});
            } else {
                const token = jwt.sign({userId: user._id}, jwtSecretKey);
                res.json({token});
            }
        }
    }
    catch(err:any){
        if(err instanceof z.ZodError){
            res.status(400).json({error: "Invalid input", details: err.issues})
        } else {
            console.error("Signin error:", err);
            res.status(500).json({error: "Internal server error"})
        }
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const { link, title, type, tags } = req.body;
        
        // Ensure userId exists (middleware should guarantee this)
        if (!req.userId) {
            return res.status(401).json({ 
                message: "Unauthorized - userId not found" 
            });
        }

        const content = await contentModel.create({
            title,
            link,
            type,
            tags,
            userId: new Types.ObjectId(req.userId) // Convert string to ObjectId
        });

        res.status(201).json({
            message: "Content created successfully",
            contentId: content._id
        });
    } catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({ 
            message: "Failed to create content" 
        });
    }
})

app.get("/api/v1/content", userMiddleware ,async (req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const contents = await contentModel.find({ userId:new Types.ObjectId(userId)}).populate("userId","username");
    res.json({contents});

})

app.delete("/api/v1/content",userMiddleware, async (req,res)=>{
    const contentId = req.body.contentId;

    await contentModel.deleteMany({ 
        contentId,
        userId : new Types.ObjectId(req.userId)
     });
     res.json({message: "Content deleted successfully"});
})

app.post("/api/v1/brain/share",(req,res)=>{

})

app.get("/api/v1/brain/:sharelink",(req,res)=>{

})

app.listen(3000,()=>{
    console.log("Server started on port 3000");
})