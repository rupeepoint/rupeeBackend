import UserModel from '../models/Users.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js';



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

              let info=  await transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:user.email,
                    subject:"Oglitz Software -> Password Reset Link",
                    html:`<a href=${link}>Click Here</a> to Reset Your Password`
                })

              


                
                res.send({ "status": "success", "message": "Password Reset Email Sent .. Please Check Your Email","info":info })

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
            jwt.verify(token,new_secret)
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
}

export default UserController