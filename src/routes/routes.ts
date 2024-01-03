import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import conversationRoutes from "./conversation.routes";
import messageRoutes from "./message.routes";
import projectRoutes from "./project.routes";
import planRoutes from "./plan.routes";
import subscriptionRoutes from "./subscription.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/conversation", conversationRoutes);
router.use("/message", messageRoutes);
router.use("/project", projectRoutes);
router.use("/plan", planRoutes);
router.use("/subscription", subscriptionRoutes);

export default router;
