import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import {  verifyToken } from "../middleware/auth.middleware";
import { createPlan, deletePlanById, getAllPlans, getPlanById, updatePlanById } from '../controllers/plan.controller';

const router: Router = Router();

router.post('/',verifyToken, catchErrors(createPlan));

// Get all plans
router.get('/',verifyToken, catchErrors(getAllPlans));

// Get plan by ID
router.get('/:id',verifyToken ,catchErrors(getPlanById));

// Update plan by ID
router.put('/:id',verifyToken, catchErrors(updatePlanById));

// Delete plan by ID
router.delete('/:id', verifyToken, catchErrors(deletePlanById));
export default router;
