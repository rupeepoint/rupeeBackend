import mongoose from "mongoose";

const connectDb=async(DATABASE_URL)=>{
    try{
        const DB_OPTIONS ={
            dbName:"authDb"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log("Connected Successfully")

    }catch(e){
        console.log("Error: "+e)
    }
}

export default connectDb