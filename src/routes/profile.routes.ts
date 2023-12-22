import { Router } from "express";
import { myProfile } from "../controllers/auth.controller";
import { catchErrors } from "../middleware/error.middleware";
import { verifyToken } from "../middleware/auth.middleware";
const router: Router = Router();

//Get Home
router.get("/me", verifyToken,catchErrors(myProfile));

export default router;
