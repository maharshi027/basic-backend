import {Router} from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserChannelProfile } from "../controllers/subscription.controller.js";

const router = Router()

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

export default router;