import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Institute } from "../models/institute.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerInstitute = asyncHandler( async (req ,res) => {
    res.status(200).json({
        message: "ok"
    })
})

export { registerInstitute,

 }