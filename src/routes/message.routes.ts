import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import { verifyToken } from "../middleware/auth.middleware";
import { getConversationMessages, sendMessage } from "../controllers/message.controller";
const router: Router = Router();

router.post("/", verifyToken, catchErrors(sendMessage));
router.get("/:conversationId", verifyToken, catchErrors(getConversationMessages));

export default router;
