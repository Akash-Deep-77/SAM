import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Institute } from "../models/institute.models.js";
import { Faculty } from "../models/faculty.models.js";
import { Student } from "../models/student.models.js";

export const verifyJWT = asyncHandler( async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
                throw new ApiError(401, "Unauthorized request")
            }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const institute = await Institute.findById(decodedToken?._id).select("-password -refreshToken")
        if (!institute) {            
                throw new ApiError(401, "Invalid Access Token")
            }
        
        req.institute = institute;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export const verifyFacultyJWT = asyncHandler( async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const faculty = await Faculty.findById(decodedToken?._id);
        if (!faculty) {            
            throw new ApiError(401, "Invalid Access Token");
        }
        req.faculty = faculty;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

export const verifyStudentJWT = asyncHandler( async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const student = await Student.findById(decodedToken?._id);
        if (!student) {            
            throw new ApiError(401, "Invalid Access Token");
        }
        req.student = student;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})