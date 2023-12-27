import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import { verifyToken } from "../middleware/auth.middleware";
import { createConversation, getConversation } from "../controllers/conversation.controller";
const router: Router = Router();

router.post("/", verifyToken, catchErrors(createConversation));
router.get("/:userId", verifyToken, catchErrors(getConversation));

export default router;
