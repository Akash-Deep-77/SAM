import { Router } from "express";
import { 
    loginInstitute, 
    logoutInstitute, 
    registerInstitute 
} from "../controllers/institute.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(registerInstitute);
router.route("/login").post(loginInstitute);


//secured routes
router.route("/logout").post(verifyJWT, logoutInstitute)

export default router