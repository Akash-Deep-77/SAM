import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Institute } from "../models/institute.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(instituteId) => {
    try {
        const institute = await Institute.findById(instituteId);
        const accessToken = institute.generateAccessToken()
        const refreshToken = institute.generateRefreshToken()
        // console.log("Generated refresh token:", refreshToken)

        institute.refreshToken = refreshToken
        await institute.save({ validateBeforeSave: false })
        // console.log("Saved user refreshToken:", institute.refreshToken)

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerInstitute = asyncHandler( async (req ,res) => {

    const {name, representativeName, designation, email, address, city, state, password} = req.body;
    // console.log("email: ", email);
    
    // checking if provided field are empty
    if (
        [name, representativeName, designation, email, address, city, state, password].some( (field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required.");
    }

    // checking if email is valid
    if (typeof email !== "string" || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim())){
        throw new ApiError(401, "Invalid Email Address.");
    }


    // checking if institute already exist 
    const existedInstitute = await Institute.findOne({
        $or: [{ name }, { email }]
    })
    if (existedInstitute){
        throw new ApiError(409, "Institute with this name or email already exist");
    }

    const institute = await Institute.create({
        name: name.toLowerCase(),
        representativeName: representativeName.toLowerCase(),
        designation,
        email,
        address,
        city,
        state,
        password
    })


    // checking if institute created successfully
   const createdInstitute = await Institute.findById(institute._id).select(
        "-password -refreshToken"
   )

   if ( !createdInstitute ){
        throw new ApiError(500, "Something went wrong while registering the institute.")
   }


   return res.status(201).json(
        new ApiResponse(201, createdInstitute, "Institute registered Successfully.")
   )
})

const loginInstitute = asyncHandler(async (req, res) => {
   
   const { email, instIdS, password }  = req.body;
   // console.log(email);
   if ( !instIdS && !email ) {
        throw new ApiError(400, "InstituteID-S or email is required.")
    }

    const institute = await Institute.findOne({
        $or: [ {instIdS}, {email} ]
    })
    if (!institute){
        throw new ApiError(404, "Institute does not exist.")
    }
     
    const isPasswordValid = await institute.isPasswordCorrect(password);
    if (!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(institute._id);

    const loggedInInstitute = await Institute.findById(institute._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                institute: loggedInInstitute, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const logoutInstitute = asyncHandler( async(req, res) => {
    await Institute.findByIdAndUpdate(
        req.institute._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const institute = await Institute.findById(decodedToken?._id)
    
        if (!institute) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== institute?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(institute._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getCurrentInstitute = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.institute,
        "Institute fetched successfully"
    ))
})




export { 
    registerInstitute,
    loginInstitute,
    logoutInstitute,
    refreshAccessToken,
    getCurrentInstitute 
 }