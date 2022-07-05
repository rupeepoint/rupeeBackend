import express from "express";
const router = express.Router();

import Razorpay from 'razorpay'
// // import multer from 'multer'
// // import ImageModel from '../models/image';


const instance = new Razorpay({
    key_id: 'rzp_live_W3t5DLy9LjF01F',
    key_secret: 'KzWnnR6WUK8T4zEg9czAs7ML',
});


router.post('/getOrderId', (req, res) => {

    console.log(req.body)
    const options = {
        amount: req.body.amount*100,
        // curreny: 'INR'
    }
    instance.orders
        .create(options)
        .then((data) => {
            res.send({ 
                "data":{
                    orderId:data.id,
                    key_id:"rzp_live_W3t5DLy9LjF01F"
                },
                "meta": {
                    "StatusCode": 200,
                    "Status": "success",
                    "Message": `ok`
                }
               
            });
        })
        .catch((error) => {
            res.send({ sub: error, status: "failed" });
            

        })


})


export default router