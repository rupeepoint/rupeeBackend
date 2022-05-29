import mongoose from "mongoose";

//Defining Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    panNumber: {
        type: String,
        required: true,
        trim: true
    },
   gender:{
       type: String,
       required: true,
       trim: true
   },
   dob:{
       type:String,
       required: true,
       trim: true
   },
   education:{
       type:String,
       required: true,
       trim: true
   },
   maritalStatus:{
       type:String,
       required: true,
       trim: true
   },
   pinCode:{
       type:String,
       required: true,
       trim: true
   },
   city:{
       type: String,
       required: true,
       trim:true
   },
   state:{
       type:String,
       required: true,
       trim:true
   },
   email:{
       type: String,
       required: true,
       trim: true
   },
   companyName:{
       type: String,
       required: true,
       trim:true
   },
   employmentType:{
       type: String,
       required: true,
       trim:true
   },
   monthlyIncome:{
       type:String,
       required: true,
       trim:true
   },
   referenceContactOne:{
       type:String,
       required: true,
       trim:true
   },
   referenceContactTwo:{
       type:String,
       required: true,
       trim:true
   },
   accountNumber:{
       type:String,
       required: true,
       trim:true
   },
   ifscCode:{
       type:String,
       required: true,
       trim:true
   },
   bankName:{
       type:String,
       required: true,
       trim:true
   },
   phone:{
       type:String,
       required: true,
       trim:true
   },
   amount:{
       type:String,
       required: true,
       trim:true
   },
   deviceId: {
    type:String,
    required: true,
    trim:true
}
})

//Model Definition
const AcceptedUserModel = mongoose.model("AcceptedUser",userSchema)

export default AcceptedUserModel