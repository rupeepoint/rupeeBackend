import mongoose from "mongoose";

//Defining Schema
const userSchema = new mongoose.Schema({
    Contact: {
        type: String
    },
    deviceId:{
        type: String
    }
})

//Model Definition
const UserContactModel = mongoose.model("UserContact",userSchema)

export default UserContactModel