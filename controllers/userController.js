import UserModel from '../models/Users.js';
import UserBasicDetails from '../models/UserBasicDetails.js';
import AcceptedUser from '../models/AcceptedUser.js';
import UpdateOrderStatus from '../models/UpdateOrderStatus.js';
// import bcrypt from 'bcrypt'
import DashBoard from '../models/DashBoard.js';
import UserContact from '../models/UserContact.js';
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js';
// import Razorpay from 'Razorpay'
// import multer from 'multer'
// import ImageModel from '../models/image';

// const keyId = "rzp_test_WJr8ZXtc873s02"
// const keySecret = "q3ZRb0Ld4JFVfZ9mPHHSd90k"



// const rzpInstance = new Razorpay({
//     key_id: keyId,
//     key_secret: keySecret
// })

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.send({ "status": "failed", "message": "Email already exists" })
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            email: email,
                            password: hashPassword,
                            name: name,
                            tc: tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({ email: email })
                        //Generate jwt token
                        const token = jwt.sign({ userId: saved_user._id }, process.env.JWT_SECRET, { expiresIn: '5d' })
                        res.status(201).send({ "status": "success", "message": "User Registered", "token": token })
                    } catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "message": "Unable to register" })
                    }


                } else {
                    res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }
        }
    }

    static userLogin = async (req, res) => {
        try {

            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((user.email == email) && isMatch) {

                        //Generate jwt token
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' })
                        res.send({ "status": "success", "message": "Welcome You are Logged In", "token": token })

                        // res.render({ "status": "success", "message": "done"})
                        // res.render()
                    } else {
                        res.send({ "status": "failed", "message": "Email or Password is not valid" })
                    }

                } else {
                    res.send({ "status": "failed", "message": "You are not registered User" })
                }

            } else {
                res.send({
                    "status": "failed", "message": "All fields are required"
                })
            }

        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unable to login" })
        }
    }
    static changeUserPassword = async (req, res) => {

        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const newhashPassword = await bcrypt.hash(password, salt)

                await UserModel.findByIdAndUpdate(req.user._id, {
                    $set: { password: newhashPassword }
                })
                res.send({ "status": "success", "message": "Password Changed successfully" })

            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }
    }

    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }

    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body
        if (email) {
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const secret = user._id + process.env.JWT_SECRET
                const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '15m' })
                const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`
                // console.log(link)

                //send email notification

                let info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: "Oglitz Software -> Password Reset Link",
                    html: `<a href=${link}>Click Here</a> to Reset Your Password`
                })





                res.send({ "status": "success", "message": "Password Reset Email Sent .. Please Check Your Email", "info": info })

            } else {
                res.send({ "status": "failed", "message": "Email doesn't exists" })
            }
        } else {
            res.send({ "status": "failed", "message": "Email Field is required" })
        }
    }

    static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET
        try {
            jwt.verify(token, new_secret)
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.send({
                        "status": "failed", "message": "New Password and Confirm password do not match"
                    })
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const newhashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(user._id, { $set: { password: newhashPassword } })
                    res.send({
                        "status": "success", "message": "Password Reset Successfully"
                    })
                }
            } else {
                res.send({
                    "status": "failed", "message": "All fields are required"
                })
            }

        } catch (error) {
            console.log(error)
            res.send({
                "status": "failed", "message": "Invalid Token"
            })
        }
    }

    static SaveUserBasicDetails = async (req, res) => {
        const { deviceId, phone, firstName, lastName, panNumber, gender, dob, education, maritalStatus, pinCode, city, state, email, companyName, employmentType, monthlyIncome, referenceContactOne, referenceContactTwo, accountNumber, ifscCode, bankName, loanId, panCardUrl, adhaarFrontUrl, adhaarBackUrl, livePhotoUrl, contactNameOne, contactNameTwo } = req.body

        console.log(req.body)

        if (deviceId && phone && firstName && lastName && panNumber && gender && dob && education && maritalStatus && pinCode && city && state && email && companyName && employmentType && monthlyIncome && referenceContactOne && referenceContactTwo && accountNumber && ifscCode && bankName && loanId && panCardUrl && adhaarFrontUrl && adhaarBackUrl && livePhotoUrl && contactNameOne && contactNameTwo) {

            const details = UserBasicDetails({
                phone: phone,
                firstName: firstName,
                lastName: lastName,
                panNumber: panNumber,
                gender: gender,
                dob: dob,
                education: education,
                maritalStatus: maritalStatus,
                pinCode: pinCode,
                city: city,
                state: state,
                email: email,
                companyName: companyName,
                employmentType: employmentType,
                monthlyIncome: monthlyIncome,
                referenceContactTwo: referenceContactTwo,
                referenceContactOne: referenceContactOne,
                accountNumber: accountNumber,
                ifscCode: ifscCode,
                bankName: bankName,
                deviceId: deviceId,
                loanId: loanId,
                panCardUrl: panCardUrl,
                adhaarFrontUrl: adhaarFrontUrl,
                adhaarBackUrl: adhaarBackUrl,
                livePhotoUrl: livePhotoUrl,
                contactNameOne: contactNameOne,
                contactNameTwo: contactNameTwo
            })

            await details.save()
            res.send({
                "status": "success", "message": "Your details are saved successfully"
            })



        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }



    }

    static GetUserBasicDetails = async (req, res) => {
        const data = await UserBasicDetails.find()
        res.send(
            // "meta": {
            //     "StatusCode": 200,
            //     "Status": "Success",
            //     "Message": "OK"
            // },
            data

        )
    }


    static DashBoardUpdate = async (req, res) => {
        const { maxLoanAmount } = req.body
        if (maxLoanAmount) {
            const amount = DashBoard({
                maxLoanAmount: maxLoanAmount
            })
            try {
                await DashBoard.findByIdAndUpdate(
                    { _id: "628495a8aa14d8e085d23790" }, {
                        $set: { maxLoanAmount: req.body.maxLoanAmount }
                    })

                res.send({
                    "meta": {
                        "StatusCode": 200,
                        "Status": "Success",
                        "Message": "OK"
                    },
                    "Data": "DashBoard Update successfully"
                })
            } catch (e) {
                res.send({ "status": "failed", "message": `${e.message}` })
            }
        } else {
            res.send({ "status": "failed", "message": "Please Insert Value" })
        }
    }

    static DashBoardGet = async (req, res) => {


        const data = await DashBoard.find()
        res.send({
            "meta": {
                "StatusCode": 200,
                "Status": "Success",
                "Message": "OK"
            },
            Data: data

        })

    }

    //     static uploadImg=async (req, res) => {


    // //storage 
    // const Storage = multer.diskStorage({
    //     destination: 'uploads',
    //     filename: (req, file, cb) => {
    //         cb(null, file.originalname)
    //     }
    // })

    // const upload = multer({
    //     storage: Storage
    // }).single('testImage')

    // app.post('/upload', (req, res) => {
    //     upload(req, res, (err) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             const newImage = new ImageModel({
    //                 name: req.body.name,
    //                 image: {
    //                     data: req.file.filename,
    //                     contentType: 'image/png'
    //                 }
    //             })

    //             newImage.save()
    //                 .then(() => res.send('sucessfully uploaded')).catch(err => console.log(err))
    //         }
    //     })
    // })

    //     }

    static DeleteUser = async (req, res) => {
        try {
            if (req.body._id) {
                await UserBasicDetails.deleteOne({ _id: req.body._id })
                res.send({
                    "meta": {
                        "StatusCode": 200,
                        "Status": "success",
                        "Message": `ok`
                    }
                })
            } else {
                res.send({
                    "meta": {
                        "StatusCode": 500,
                        "Status": "_id is mandatory",
                        "Message": `ok`
                    }
                })
            }

        } catch (err) {
            res.send({
                "meta": {
                    "StatusCode": 500,
                    "Status": "failed",
                    "Message": `${err}`
                }
            })
        }

    }
    static SearchUserDetailsById = async (req, res) => {

    }

    static AcceptedUsers = async (req, res) => {
        const { deviceId, amount, phone, _id, firstName, lastName, panNumber, gender, dob, education, maritalStatus, pinCode, city, state, email, companyName, employmentType, monthlyIncome, referenceContactOne, referenceContactTwo, accountNumber, ifscCode, bankName, loanId, panCardUrl, adhaarFrontUrl, adhaarBackUrl, livePhotoUrl, contactNameOne, contactNameTwo, sanctionedAmount, disbursedAmount, gst, service, processingAmount, rePaymentData } = req.body

        console.log(req.body)

        if (deviceId && amount && phone && firstName && lastName && panNumber && gender && dob && education && maritalStatus && pinCode && city && state && email && companyName && employmentType && monthlyIncome && referenceContactOne && referenceContactTwo && accountNumber && ifscCode && bankName && loanId && panCardUrl && adhaarFrontUrl && adhaarBackUrl && livePhotoUrl && contactNameOne && contactNameTwo && sanctionedAmount && disbursedAmount && gst && service && processingAmount && rePaymentData) {

            try {
                const details = AcceptedUser({
                    firstName: firstName,
                    lastName: lastName,
                    panNumber: panNumber,
                    gender: gender,
                    dob: dob,
                    education: education,
                    maritalStatus: maritalStatus,
                    pinCode: pinCode,
                    city: city,
                    state: state,
                    email: email,
                    companyName: companyName,
                    employmentType: employmentType,
                    monthlyIncome: monthlyIncome,
                    referenceContactTwo: referenceContactTwo,
                    referenceContactOne: referenceContactOne,
                    accountNumber: accountNumber,
                    ifscCode: ifscCode,
                    bankName: bankName,
                    phone: phone,
                    amount: amount,
                    deviceId: deviceId,
                    loanId: loanId,
                    panCardUrl: panCardUrl,
                    adhaarFrontUrl: adhaarFrontUrl,
                    adhaarBackUrl: adhaarBackUrl,
                    livePhotoUrl: livePhotoUrl,
                    contactNameOne: contactNameOne,
                    contactNameTwo: contactNameTwo,
                    sanctionedAmount: sanctionedAmount,
                    disbursedAmount: disbursedAmount,
                    gst: gst,
                    service: service,
                    processingAmount: processingAmount,
                    rePaymentData: rePaymentData

                })

                await details.save()
                await UserBasicDetails.deleteOne({ _id: _id })

                res.send({
                    "status": "success", "message": "User Accepted"
                })
            } catch (e) {
                res.send({
                    "status": "failed", "message": `${e}`
                })
            }


        } else {
            res.send({
                "status": "failed", "message": `All field is required`
            })
        }

    }


    static AcceptedUserGet = async (req, res) => {


        const data = await AcceptedUser.find()
        res.send(
            //     "meta": {
            //         "StatusCode": 200,
            //         "Status": "Success",
            //         "Message": "OK"
            //     },
            data

        )

    }

    static LoanStatus = async (req, res) => {

        console.log(req.body)

        const data = await AcceptedUser.findOne({ loanId: { $regex: req.body.LoanId } })
        if (data) {
            res.send({
                "meta": {
                    "StatusCode": 200,
                    "Status": "Success",
                    "Message": "OK"
                },
                Data: data
            })
        } else {
            res.send({
                "meta": {
                    "StatusCode": 200,
                    "Status": "Success",
                    "Message": "Pending..."
                },
                Data: data
            })
        }


    }

    static GetDashStatus = async (req, res) => {

        const acceptedUser = await AcceptedUser.count()
        const requestUser = await UserBasicDetails.count()
        // const acceptedUser=await AcceptedUser.count()
        // const acceptedUser=await AcceptedUser.count()

        res.send([
            {
                acceptedUser: acceptedUser,
                requestUser: requestUser
            }
        ])
    }

    static SaveUserContact = async (req, res) => {
        console.log(req.body.Contact)

        if (req.body.Contact) {
            const details = UserContact({
                Contact: `${req.body.Contact}`,
                deviceId: req.body.deviceId
            })

            await details.save()

            res.send({
                "meta": {
                    "StatusCode": 200,
                    "Status": "Success",
                    "Message": "OK"
                }
            })
        }


    }


    static FindUserContactById = async (req, res) => {
        const { LoginContactId } = req.body

        // if (true) {
        // const amount = DashBoard({
        //     maxLoanAmount: maxLoanAmount
        // })
        try {
            const user = await UserContact.findOne(
                { deviceId: LoginContactId }
            )
            if (user != null) {
                res.send(
                    // "meta": {
                    //     "StatusCode": 200,
                    //     "Status": "Success",
                    //     "Message": "OK"
                    // },
                    // "Data": {
                    [user]

                    // }
                )
            } else {
                res.send({
                    "meta": {
                        "StatusCode": 200,
                        "Status": "Success",
                        "Message": "OK"
                    },
                    "Data": "Not Found"
                })
            }


        } catch (e) {
            res.send({ "status": "failed", "message": `${e.message}` })
        }
        // } else {
        //     res.send({ "status": "failed", "message": "Please Insert Value" })
        // }
    }



    static getOrderId = async (req, res) => {

        const options = {
            amount: req.body.amount + "00",
            curreny: "INR",
            payment_capture: "1"
        }
        const rzpInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        })

        rzpInstance.orders.create(options, (err, order) => {
            console.log("this   " + order)

            const resObj = {
                keyId: keyId,
                orderId: "order.ID"
            }
            res.send(JSON.stringify(resObj))
        })



        // res.send({ "status": "getOrderId"})
    }

    static updateUserLoanStatus = async (req, res) => {
        console.log(req.body)

        const { deviceId, LoanId, LoanStatus, Amount, paymentLastDate, signature, pay_id, order_id, mobileNo, emailId } = req.body


        if (deviceId && LoanId && LoanStatus && Amount && paymentLastDate && signature && pay_id && order_id && mobileNo, emailId) {
            try {
                const data = UpdateOrderStatus({
                    deviceId: deviceId,
                    LoanId: LoanId,
                    LoanStatus: LoanStatus,
                    Amount: Amount,
                    paymentLastDate: paymentLastDate,
                    signature: signature,
                    pay_id: pay_id,
                    order_id: order_id,
                    mobileNo: mobileNo,
                    emailId: emailId
                })
                await data.save()
                res.send({ "status": "sucess", "message": "Status Update" })
            } catch (err) {
                res.send({ "status": "failed", "message": `${err.message}` })
            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }





    }

    static updateUserLoanStatusbyLoanId = async (req, res) => {
        console.log(req.body)

        const { deviceId, LoanId, LoanStatus, Amount, paymentLastDate, signature, pay_id, order_id, mobileNo, emailId } = req.body


        if (deviceId && LoanId && LoanStatus && Amount && paymentLastDate && signature && pay_id && order_id && mobileNo, emailId) {
            try {
                
                await UpdateOrderStatus.updateOne({ LoanId: LoanId }, {
                    $set: { deviceId: deviceId, 
                        LoanId: LoanId,
                        LoanStatus: LoanStatus,
                        Amount: Amount,
                        paymentLastDate: paymentLastDate,
                        signature: signature,
                        pay_id: pay_id,
                        order_id: order_id,
                        mobileNo: mobileNo,
                        emailId: emailId}
                })
                // await data.save()
                res.send({ "status": "sucess", "message": "Status Update" })
            } catch (err) {
                res.send({ "status": "failed", "message": `${err.message}` })
            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }
    }

    static getUpdatedLoanStatus = async (req, res) => {
        const data = await UpdateOrderStatus.find()
        res.send(
            //     "meta": {
            //         "StatusCode": 200,
            //         "Status": "Success",
            //         "Message": "OK"
            //     },
            data

        )
    }
}

export default UserController


