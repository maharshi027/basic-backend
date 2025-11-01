import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend as req.body
    const { fullName, email, username, password } = req.body
    console.log("Email:",email);
    
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    if(!email.includes("@")) {
        throw new ApiError(400, "Invalid email address")
    }

    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path 

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }
    if(!coverImageLocalPath){
        throw new ApiError(400, "cover Image is required")
    }

    // upload images to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(500, "Unable to upload avatar image")
    }

    // create user in db
    User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(User._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating user")
    }
    return res.status(201).json(
        new ApiResponse ( 200, createdUser, "User registered successfully" )
    )
})

export default registerUser;