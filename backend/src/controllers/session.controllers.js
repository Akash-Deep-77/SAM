import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Session } from "../models/session.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";

const startSession = asyncHandler(async (req, res) => {
    const { classId, subjectId } = req.body;

    if (!classId || !subjectId) {
        throw new ApiError(400, "Class ID and Subject ID are required.");
    }

    const bleToken = crypto.randomUUID();

    const session = await Session.create({
        facultyStarted: req.faculty._id,
        class: classId,
        subject: subjectId,
        BLE_token: bleToken
        // endedAt will default to 2 mins from now as per the model
    });

    return res.status(201).json(
        new ApiResponse(201, { session, bleToken }, "Session started successfully")
    );
});

const endSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    const session = await Session.findOne({ 
        _id: sessionId, 
        facultyStarted: req.faculty._id 
    });

    if (!session) {
        throw new ApiError(404, "Session not found or you don't have permission.");
    }

    session.endedAt = new Date();
    await session.save();

    return res.status(200).json(
        new ApiResponse(200, session, "Session ended successfully")
    );
});

const getActiveSessionForFaculty = asyncHandler(async (req, res) => {
    const session = await Session.findOne({
        facultyStarted: req.faculty._id,
        endedAt: { $gt: new Date() } // still active
    }).sort({ startedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, session || null, "Active session fetched")
    );
});

const getActiveSessionForStudent = asyncHandler(async (req, res) => {
    // A student can see sessions for their branch/year/sem/section, but for simplicity
    // we assume the student queries for a specific class ID or we find sessions for their enrolled classes.
    // Assuming student UI will pass classId of the current live class.
    const { classId } = req.params;

    const session = await Session.findOne({
        class: classId,
        endedAt: { $gt: new Date() } // still active
    }).populate('facultyStarted', 'name').populate('subject', 'subjectName subjectCode');

    return res.status(200).json(
        new ApiResponse(200, session || null, "Active session for class fetched")
    );
});

export {
    startSession,
    endSession,
    getActiveSessionForFaculty,
    getActiveSessionForStudent
};
