import { Router } from "express"
import { logInUser, logOutUser, registerUser } from "../controller/user.Controller.js";
import { jwtVerify, validatingIncomingUserRequest } from "../middleware/auth.middleware.js";


const router = Router();


router.route("/register").post(validatingIncomingUserRequest, registerUser)
router.route("/login").post(logInUser)
router.route("/logout").post(jwtVerify, logOutUser)


export { router }