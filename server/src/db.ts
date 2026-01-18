import mongoose from "mongoose";
import { model,Schema } from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('MongoDB URL:', process.env.MONGO_URL); // Debug line to verify

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
    // authorId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

export const contentModel = model("content", ConetentSchema);   

const LinksSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hash: { type: String, required: true, unique: true }
});

export const LinksModel = mongoose.model("Links", LinksSchema);