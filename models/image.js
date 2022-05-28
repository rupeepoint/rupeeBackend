import mongoose from "mongoose";


const imageSchema=mongoose.Schema({
    name:{
        type: 'string',
        required: true
    },
    image:{
        data:Buffer,
        contentType: "imgage/png"
    }
})

const image = mongoose.model("imageModel",imageSchema);

export default image