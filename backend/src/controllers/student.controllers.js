import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.models.js";
import { Institute } from "../models/institute.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        const accessToken = jwt.sign(
            {
                _id: student._id,
                email: student.email,
                universityRollNo: student.universityRollNo
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
        );
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerStudent = asyncHandler(async (req, res) => {
    const { name, universityRollNo, instId, branch, year, semester, section, email } = req.body;

    if ([name, universityRollNo, instId, branch, year, semester, email].some((field) => field?.toString().trim() === "")) {
        throw new ApiError(400, "Required fields cannot be empty.");
    }

    const institute = await Institute.findOne({ instId });
    if (!institute) {
        throw new ApiError(404, "Invalid Institute ID");
    }

    const existedStudent = await Student.findOne({ 
        $or: [{ universityRollNo: universityRollNo.toUpperCase() }, { email }]
    });
    
    if (existedStudent) {
        throw new ApiError(409, "Student with this roll number or email already exists");
    }

    const student = await Student.create({
        institute: institute._id,
        name,
        universityRollNo,
        branch,
        year,
        semester,
        section,
        email
    });

    return res.status(201).json(
        new ApiResponse(201, student, "Student registered successfully.")
    );
});

const loginStudent = asyncHandler(async (req, res) => {
    const { instId, universityRollNo } = req.body;

    if (!instId || !universityRollNo) {
        throw new ApiError(400, "Institute ID and Roll No are required.");
    }

    const institute = await Institute.findOne({ instId });
    if (!institute) {
        throw new ApiError(404, "Invalid Institute ID");
    }

    const student = await Student.findOne({ 
        institute: institute._id, 
        universityRollNo: universityRollNo.toUpperCase() 
    });

    if (!student) {
        throw new ApiError(404, "Student not found.");
    }

    const { accessToken } = await generateAccessAndRefreshTokens(student._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { student, accessToken },
                "Student logged in successfully"
            )
        );
});

const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student._id).populate('institute');
    return res.status(200).json(
        new ApiResponse(200, student, "Profile fetched successfully")
    );
});

export {
    registerStudent,
    loginStudent,
    getStudentProfile
};
