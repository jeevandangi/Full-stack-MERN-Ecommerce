import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { validationResult, check } from "express-validator"

const jwtVerify = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer", "");

        if (!token) {
            throw new ApiError(401, "Unathorized request")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password -refToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user

        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
})


// validating user register request 
const validatingIncomingUserRequest = [
    check('name')
        .trim()
        .notEmpty().withMessage("Name field is required")
        .matches(/^[A-Za-z\s]+$/).withMessage("Name must contain alphabet only")
        .isLength({ min: 4, max: 30 }),
    check('email')
        .notEmpty().withMessage("Email field is required")
        .isEmail().withMessage("Please enter a valid email"),
    check('phone')
        .notEmpty().withMessage("Phone field is required")
        .isNumeric().withMessage("Number field must contain number only")
        .isLength({ min: 10 }).withMessage("Number must be 10"),
    check('password')
        .notEmpty().withMessage("Password must be required")
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),

    check('address')
        .notEmpty().withMessage("Address must be required")
        .isLength({ min: 5 }).withMessage("Address must be 5 character"),


    (req, _, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new ApiError(400, "Invalid credential", errors)
        }
        next()

    }

];
export {
    jwtVerify,
    validatingIncomingUserRequest
}