import express from "express";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken"; 
import {z} from "zod"; 
import bcrypt from "bcrypt";
import { contentModel, UserModel,LinksModel }  from "./db.js";
import { userMiddleware } from "./middleware.js";
import { random } from "./utils.js";
import cors from "cors";

const jwtSecretKey = "heyheyhey";
const app = express();
app.use(cors());
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
    
    console.log("Delete request - contentId:", contentId);
    console.log("Delete request - userId:", req.userId);

    if (!contentId) {
        return res.status(400).json({ message: "Content ID is required" });
    }

    try {
        const result = await contentModel.deleteOne({ 
            _id: new Types.ObjectId(contentId),
            userId: new Types.ObjectId(req.userId)
        });
        
        console.log("Delete result:", result);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Content not found or unauthorized" });
        }
        
        res.json({message: "Content deleted successfully"});
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete content" });
    }
})

app.post("/api/v1/brain/share",userMiddleware, async (req,res)=>{
    const share = req.body.share;
    if(share){
        // Check if link already exists
        const existingLink = await LinksModel.findOne({userId: new Types.ObjectId(req.userId)});
        if(existingLink){
            return res.json({
                message: "Share link already exists",
                hash: existingLink.hash
            });
        }
        
        // Create new link
        const newLink = await LinksModel.create({
            userId: new Types.ObjectId(req.userId),
            hash: random(10)
        })
        
        res.json({
            message: "Share link created",
            hash: newLink.hash
        });
    }else {
        await LinksModel.deleteOne({userId: new Types.ObjectId(req.userId)});
        res.json({message: "Share link deleted"});
    }
})

app.get("/api/v1/brain/:sharelink",async(req,res)=>{
    try {
        const hash = req.params.sharelink;
        const link = await LinksModel.findOne({hash});
        if(!link){
            return res.status(404).json({message: "Share link not found"});
        }
        const content = await contentModel.find({
            userId: link.userId
        })
        
        const user = await UserModel.findById(link.userId);
        
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.json({content, username: user.username});
    } catch (error) {
        console.error("Error fetching shared content:", error);
        res.status(500).json({message: "Internal server error"});
    }
})

// Wait for MongoDB connection before starting server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});