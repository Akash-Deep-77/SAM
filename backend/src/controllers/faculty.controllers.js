import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Faculty } from "../models/faculty.models.js";
import { Institute } from "../models/institute.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (facultyId) => {
    try {
        const faculty = await Faculty.findById(facultyId);
        
        // Since we don't have these methods on the faculty model, we create the token manually
        const accessToken = jwt.sign(
            {
                _id: faculty._id,
                email: faculty.email,
                facultyIdNumber: faculty.facultyIdNumber
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
        );

        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerFaculty = asyncHandler(async (req, res) => {
    const { insIdS, name, gender, email } = req.body;

    if ([insIdS, name, gender, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.");
    }

    const institute = await Institute.findOne({ instIdS });
    if (!institute) {
        throw new ApiError(404, "Invalid Institute ID-S");
    }

    const existedFaculty = await Faculty.findOne({ email });
    if (existedFaculty) {
        throw new ApiError(409, "Faculty with this email already exists");
    }

    // Auto-generate FIN for simplicity and auto-approve for testing
    const facultyIdNumber = `FIN${Math.floor(1000 + Math.random() * 9000)}`;

    const faculty = await Faculty.create({
        insIdS,
        name,
        gender,
        email,
        facultyIdNumber,
        status: 'Approved' // auto-approve for simplicity
    });

    // Add to institute
    institute.faculty.push(faculty._id);
    await institute.save({ validateBeforeSave: false });

    return res.status(201).json(
        new ApiResponse(201, faculty, "Faculty registered successfully.")
    );
});

const loginFaculty = asyncHandler(async (req, res) => {
    const { insIdS, facultyIdNumber } = req.body;

    if (!insIdS || !facultyIdNumber) {
        throw new ApiError(400, "Institute ID-S and FIN are required.");
    }

    const faculty = await Faculty.findOne({ insIdS, facultyIdNumber: facultyIdNumber.toUpperCase() });
    if (!faculty) {
        throw new ApiError(404, "Invalid credentials or Faculty not found.");
    }

    if (faculty.status !== 'Approved') {
        throw new ApiError(403, "Faculty registration is still pending approval.");
    }

    const { accessToken } = await generateAccessAndRefreshTokens(faculty._id);

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
                { faculty, accessToken },
                "Faculty logged in successfully"
            )
        );
});

const getFacultyProfile = asyncHandler(async (req, res) => {
    const faculty = await Faculty.findById(req.faculty._id).populate('subjects').populate('classes');
    return res.status(200).json(
        new ApiResponse(200, faculty, "Profile fetched successfully")
    );
});

const getFacultyClasses = asyncHandler(async (req, res) => {
    const faculty = await Faculty.findById(req.faculty._id)
        .populate('classes')
        .populate({
            path: 'timetableAssociated',
            populate: { path: 'class' }
        });
    return res.status(200).json(
        new ApiResponse(200, faculty, "Classes fetched successfully")
    );
});

export {
    registerFaculty,
    loginFaculty,
    getFacultyProfile,
    getFacultyClasses
};
