import mongoose from "mongoose";

//Defining Schema
const userSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    LoanId: {
        type: String,
        required: true
    },
    LoanStatus: {
        type: String,
        required: true
    },
    Amount: {
        type: String,
        required: true
    },
    paymentLastDate: {
        type: String,
        required: true
    },
    signature:{
        type:String,
        required: true
    },
    pay_id: {
        type: String,
        required: true
    },
    order_id:{
        type:String,
        required: true
    },
    mobileNo:{
        type:String,
        required: true
    },
    emailId: {
        type:String,
        required: true
    }
})

//Model Definition
const UpdateOrderStatus = mongoose.model("UserLoanStatus", userSchema)

export default UpdateOrderStatus