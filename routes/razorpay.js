import express from "express";
const router = express.Router();

import Razorpay from 'razorpay'
// // import multer from 'multer'
// // import ImageModel from '../models/image';


const instance = new Razorpay({
    key_id: 'rzp_test_QUFcsYoOj0f97O',
    key_secret: '5tlWQmSTweC4wzkSKQhGcdN1',
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
                    key_id:"rzp_test_QUFcsYoOj0f97O"
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