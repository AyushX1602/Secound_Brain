import mongoose from "mongoose";
import { model,Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGO_URL!);

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: {type:String, required: true}
})

export const UserModel =  model("User", UserSchema)

const contentTypes = ['video', 'article', 'tweet', 'link', 'document'];

const ConetentSchema = new Schema({
    title : {type: String, required: true},
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

export const contentModel = model("content", ConetentSchema);