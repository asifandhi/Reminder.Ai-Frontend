import { Router } from "express";
import { getAuthUrl ,handleCallback  } from "../controllers/calendar.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/auth").get(verifyJWT,getAuthUrl);
router.route("/callback").get(handleCallback);

 

export default router;