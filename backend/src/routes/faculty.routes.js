import { Router } from "express";
import { 
    registerFaculty, 
    loginFaculty, 
    getFacultyProfile, 
    getFacultyClasses 
} from "../controllers/faculty.controllers.js";
import { verifyFacultyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerFaculty);
router.route("/login").post(loginFaculty);

// Secured routes
router.route("/me").get(verifyFacultyJWT, getFacultyProfile);
router.route("/classes").get(verifyFacultyJWT, getFacultyClasses);

export default router;
