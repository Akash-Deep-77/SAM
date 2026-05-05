import { Router } from "express";
import { 
    loginInstitute, 
    logoutInstitute, 
    registerInstitute,
    refreshAccessToken 
} from "../controllers/institute.controllers.js";
import { 
    getClasses, 
    addClass, 
    deleteClass 
} from "../controllers/clas.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(registerInstitute);
router.route("/login").post(loginInstitute);

//secured routes
router.route("/logout").post(verifyJWT, logoutInstitute)
router.route("/refresh-token").post(refreshAccessToken)

// Classes routes
router.route("/classes")
  .get(getClasses)
  .post(addClass);

router.route("/classes/:classId").delete(deleteClass);

export default router