import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from '../middlewares/auth-middlewares.js'
//Route Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)




//Public Routes
router.get('/home', (req, res) => {
    res.send("welcome")
})

router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)



//Protected Routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)



router.post('/userDetails', UserController.SaveUserBasicDetails)
router.get('/userDetails', UserController.GetUserBasicDetails)

router.post('/Dashboard', UserController.DashBoardUpdate)

router.get('/Dashboard', UserController.DashBoardGet)

router.post("/details", UserController.DeleteUser)
router.post("/AcceptedUsers", UserController.AcceptedUsers)
router.get("/AcceptedUsers", UserController.AcceptedUserGet)
router.post("/LoanStatus", UserController.LoanStatus)
router.get("/GetDashStatus", UserController.GetDashStatus)
router.post("/SaveUserContact", UserController.SaveUserContact)
router.post("/FindUserContact", UserController.FindUserContactById)

router.post("/updateUserLoanStatus", UserController.updateUserLoanStatus)
router.get("/updateUserLoanStatus", UserController.getUpdatedLoanStatus)
router.post("/updateUserLoanStatusId", UserController.updateUserLoanStatusbyLoanId)



export default router