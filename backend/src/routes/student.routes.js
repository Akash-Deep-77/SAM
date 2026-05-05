import { Router } from "express";
import { 
    registerStudent, 
    loginStudent, 
    getStudentProfile 
} from "../controllers/student.controllers.js";
import { verifyStudentJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerStudent);
router.route("/login").post(loginStudent);

// Secured routes
router.route("/me").get(verifyStudentJWT, getStudentProfile);

export default router;
