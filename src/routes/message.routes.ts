import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import { verifyToken } from "../middleware/auth.middleware";
import { sendMessage } from "../controllers/message.controller";
const router: Router = Router();

router.post("/", verifyToken, catchErrors(sendMessage));
router.get("/:conversationId", verifyToken, catchErrors(sendMessage));

export default router;
