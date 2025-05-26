import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {

    //Taking input from frontend
    const {fullName ,email,username ,password } = req.body
    
    //validating parameters
    if(fullName === "" || email === "" || username === "" || password === ""){
        throw new ApiError(402, "All fields are required")
    }

    // checking if user already exist
    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })
    console.log(existedUser);
    

    if(existedUser){
        throw new ApiError(409,"username or email already exist")
    }

    //files , checking for images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
    }

    //upload on claudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar is required")
    }

    //create user entry in database
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase(),
        email,
        password
    })

    //checking if user is registered successfully
    const createdUser = await User. findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")
    }

    //return response
    return res.status(201).json(
        new ApiResponse(200,"registered successfully")
    )
} )

export { registerUser }