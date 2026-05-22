import { Router } from "express";
import { addReminder ,deleteReminder,completeReminder ,getCompletedTasks,getPendingTasks } from "../controllers/sync.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/addreminder").post(verifyJWT,addReminder);
router.route("/deletereminder/:taskId").delete(verifyJWT, deleteReminder);
router.route("/completereminder/:taskId").patch(verifyJWT, completeReminder);
router.route("/pending").get(verifyJWT, getPendingTasks);
router.route("/completed").get(verifyJWT, getCompletedTasks);


export default router;