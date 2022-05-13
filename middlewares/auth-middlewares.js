import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js"



var  checkUserAuth=async(req,res,next) => {
    let token
    const {authorization}=req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            //Get token from headers
            token=authorization.split(' ')[1]
          
            //Verify the token
            const {userId}=jwt.verify(token,process.env.JWT_SECRET)

        
            //Get User from token
            req.user=await UserModel.findById(userId).select('-password')

            next()
        } catch (error) {
            res.status(401).send({"status":"failed","message":"Unauthorized User"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized User,No Token"})
    }

}

export default checkUserAuth
