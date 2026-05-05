import { Router } from "express";
import { markAttendance } from "../controllers/attendance.controllers.js";
import { verifyStudentJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/mark").post(verifyStudentJWT, markAttendance);

export default router;
