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