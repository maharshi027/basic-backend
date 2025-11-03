import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend as req.body and req.files 
    
    const { fullName, email, username, password } = req.body;
    
    // console.log("Request Body:", req.body);
    // console.log("Request Files:", req.files);
    
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    if(!email.includes("@")) {
        throw new ApiError(400, "Invalid email address")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        var coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // upload images to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(500, "Unable to upload avatar image")
    }

    const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
   })

// find created user by its id
    const createdUser = await User.findById(user._id).select(
                     "-password -refreshToken"
                    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating user")
    }
    return res.status(201).json(
        new ApiResponse ( 200, createdUser, "User registered successfully" )
    )
})
const loginUser = asyncHandler(async (req, res) => {
    // login user controller
    // req body -> data 
    // username or email dono se login
    // find user
    // compare password
    // accesss and referesh token generate
    // send cookies and response

    const { email, username, password } = req.body;
    if( !email || !username ) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [ {email} , { username } ]
    })
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const ispasswordValid = await user.isPasswordCorrect(password)
    if(!ispasswordValid){
        throw new ApiError(401, "Password is incorrect")
    }

    const generateAccessAndRefreshTokens = async (userId) => {
        try {
            const user = await User.findById(userId)
            user.accessToken = user.generateAccessToken()
            user.refreshToken = user.generateRefreshToken()

            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })

            return { accessToken, refreshToken }

        } catch (error) {
            throw new ApiError(500, "something Went Wrong, Token generation failed")
        }
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    // send tokens in http only cookies
    
    const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200).cookie("accesssToken",accessToken,options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, { user: loggedInuser, accessToken , refreshToken }, "User logged in successfully")
    )
}) 

const logoutUser = asyncHandler ( async ( req, res) => {
    // logout user controller
    // clear cookies
    // invalidate refresh token in db
    await User.findbyIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined }
     },{
        new :true
     })

     const options = {
        httpOnly : true,
        secure : true,      
     }
     return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, null, "User logged out successfully"))
})
export {
    registerUser,
    loginUser,
    logoutUser
}