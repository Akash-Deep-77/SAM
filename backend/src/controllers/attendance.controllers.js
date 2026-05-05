import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Attendance } from "../models/attendance.models.js";
import { Session } from "../models/session.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const markAttendance = asyncHandler(async (req, res) => {
    const { bleToken, sessionId } = req.body;

    if (!bleToken || !sessionId) {
        throw new ApiError(400, "BLE Token and Session ID are required.");
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (new Date() > new Date(session.endedAt)) {
        throw new ApiError(400, "Session has ended. You cannot mark attendance anymore.");
    }

    if (session.BLE_token !== bleToken) {
        throw new ApiError(400, "Invalid BLE Token");
    }

    const existingAttendance = await Attendance.findOne({
        session: sessionId,
        student: req.student._id
    });

    if (existingAttendance) {
        throw new ApiError(400, "Attendance already marked for this session");
    }

    const attendance = await Attendance.create({
        session: sessionId,
        student: req.student._id
    });

    return res.status(201).json(
        new ApiResponse(201, attendance, "Attendance marked successfully")
    );
});

export { markAttendance };
