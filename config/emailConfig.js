import dotenv from 'dotenv';
dotenv.config()
import nodemailer from 'nodemailer';


let transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,//true for 465,false for other ports
    auth:{
        user:'rupeepoint1@gmail.com',//Admin gmail id
        pass:'Nu.Kvjp3qTK7z.H'//admin gmail password
    }
})

export default transporter