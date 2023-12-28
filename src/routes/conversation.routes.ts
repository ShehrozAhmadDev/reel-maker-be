import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import { verifyIsAdmin, verifyToken } from "../middleware/auth.middleware";
import { createConversation, getAdminConversation, getConversation } from "../controllers/conversation.controller";
const router: Router = Router();

router.post("/", verifyToken, catchErrors(createConversation));
router.get("/:userId", verifyToken, catchErrors(getConversation));
router.get("/admin/:userId", verifyToken, verifyIsAdmin, catchErrors(getAdminConversation));

export default router;
