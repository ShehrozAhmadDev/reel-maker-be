import { Router } from "express";
import { signUp, login } from "../controllers/auth.controller";
import { catchErrors } from "../middleware/error.middleware";

const router: Router = Router();

router.post("/register", catchErrors(signUp));
router.post("/login", catchErrors(login));


export default router;
