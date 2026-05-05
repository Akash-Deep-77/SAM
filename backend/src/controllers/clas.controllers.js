import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Clas } from "../models/clas.models.js";
import { Subject } from "../models/subject.models.js";
import { Student } from "../models/student.models.js";

const getClasses = asyncHandler(async (req, res) => {
    try {
        const classes = await Clas.find()
            .populate("subjects")
            .populate("studentsEnrolled");
        
        if (!classes) {
            throw new ApiError(404, "No classes found");
        }

        return res.status(200).json(
            new ApiResponse(200, classes, "Classes fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching classes");
    }
});

const addClass = asyncHandler(async (req, res) => {
    try {
        const { year, semester, branch, section } = req.body;

        // Validation
        if (!year || !semester || !branch) {
            throw new ApiError(400, "Year, semester, and branch are required");
        }

        // Check if class already exists
        const existingClass = await Clas.findOne({
            year,
            semester,
            branch,
            section: section || null
        });

        if (existingClass) {
            throw new ApiError(409, "Class with these details already exists");
        }

        // Create new class
        const newClass = await Clas.create({
            year,
            semester,
            branch,
            section: section || "",
            subjects: [],
            studentsEnrolled: []
        });

        const createdClass = await Clas.findById(newClass._id)
            .populate("subjects")
            .populate("studentsEnrolled");

        return res.status(201).json(
            new ApiResponse(201, createdClass, "Class added successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error adding class");
    }
});

const deleteClass = asyncHandler(async (req, res) => {
    try {
        const { classId } = req.params;

        if (!classId) {
            throw new ApiError(400, "Class ID is required");
        }

        const deletedClass = await Clas.findByIdAndDelete(classId);

        if (!deletedClass) {
            throw new ApiError(404, "Class not found");
        }

        return res.status(200).json(
            new ApiResponse(200, deletedClass, "Class deleted successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error deleting class");
    }
});

export { getClasses, addClass, deleteClass };
