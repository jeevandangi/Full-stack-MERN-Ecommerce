import { Router } from "express"
import { logInUser, logOutUser, registerUser } from "../controller/user.Controller.js";


const router = Router();


router.route("/register").post(registerUser)
router.route("/login").post(logInUser)
router.route("/logout").post(logOutUser)


export { router }