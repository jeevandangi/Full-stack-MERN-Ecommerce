import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiErrorHandler.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/apiResponse.js"


const refereshAndAccessToken = async (userId) => {
    try {
        const user = await User.findOne(userId)


        const refreshToken = user.generateRefreshToken()


        const accessToken = user.generateAccessToken()

        user.refToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went error during generating token")
    }

}

// Register user
const registerUser = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        phone,
        address
    } = req.body


    if (
        [name, email, password, phone, address].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All the fields are required")
    }
    const checkUser = await User.findOne({ email })
    if (checkUser) {
        throw new ApiError(409, "User already found")
    }

    const user = await User.create(
        {
            name: name,
            email: email,
            password: password,
            phone: phone,
            address: address
        })




    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError("500", "Something went wrong while registering user")
    }
    return res.status(201).json(
        new ApiResponse(200, "user created succesfully", createdUser)
    )

})

// Login user

const logInUser = asyncHandler(async (req, res) => {
    // req data from user
    // validate username and password
    // find user
    // password compare
    // ref token and acc token
    // send cookies

    const { email, password } = req.body
    console.log(email)
    if (!email && password) {
        throw new ApiError(400, "Email and password must be required");
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)


    if (!isPasswordValid) {
        throw new ApiError(404, "Password incorrect")
    }

    const { refreshToken, accessToken } = await refereshAndAccessToken(user._id)




    const logInUser = await User.findById(user._id).select("-password -refToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: logInUser, accessToken, refreshToken

                },
                "user login succesfully"
            )
        )







})



const logOutUser = asyncHandler((req, res) => {

})


export {
    registerUser,
    logInUser,
    logOutUser
}