import { Router } from "express";
import { 
    startSession, 
    endSession, 
    getActiveSessionForFaculty,
    getActiveSessionForStudent
} from "../controllers/session.controllers.js";
import { verifyFacultyJWT, verifyStudentJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Faculty routes
router.route("/start").post(verifyFacultyJWT, startSession);
router.route("/end").post(verifyFacultyJWT, endSession);
router.route("/faculty/active").get(verifyFacultyJWT, getActiveSessionForFaculty);

// Student routes
router.route("/student/active/:classId").get(verifyStudentJWT, getActiveSessionForStudent);

export default router;
