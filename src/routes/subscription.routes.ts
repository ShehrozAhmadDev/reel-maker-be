import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import { getPlans, createCustomer, createSubscription, getUserSubscriptions, cancelSubscription, approvePayment } from "../controllers/subscription.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/getPlans", catchErrors(getPlans) )
router.post("/createcustomer", verifyToken, catchErrors(createCustomer) )
router.post("/create", verifyToken, catchErrors(createSubscription))
router.get("/user/:customerId", verifyToken, catchErrors(getUserSubscriptions))
router.delete("/cancel/:subscriptionId", verifyToken, catchErrors(cancelSubscription))
router.post("/verifyPayment/:subscriptionId", verifyToken, catchErrors(approvePayment));

// router.post("/updatesubscription", verifyToken, catchErrors(updateSubscription))

export default router;
