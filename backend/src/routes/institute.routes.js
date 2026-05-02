import { Router } from "express";
import { registerInstitute } from "../controllers/institute.controllers.js";

const router = Router()

router.route("/register").post(registerInstitute);

export default router