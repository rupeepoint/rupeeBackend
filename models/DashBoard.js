import mongoose from "mongoose";

//Defining Schema
const userSchema = new mongoose.Schema({
    maxLoanAmount: {
        type: String,
        required: true,
        trim: true
    }
})

//Model Definition
const DashBoard = mongoose.model("DashBoardDetails",userSchema)

export default DashBoard