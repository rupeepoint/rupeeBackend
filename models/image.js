import mongoose from "mongoose";


const imageSchema=mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: 'string',
        required: true
    },
    image:{
        type: 'string',
        // required: true
    }
})

const image = mongoose.model("KycImageByUser",imageSchema);

export default image