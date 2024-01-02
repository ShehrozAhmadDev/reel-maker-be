import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import { getPlans, createCustomer, createSubscription, updateSubscription, getUserSubscriptions, cancelSubscription } from "../controllers/userplan.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router: Router = Router();

// router.post('/create-payment',verifyToken, catchErrors(createPaymentIntent));
router.get("/getPlans", catchErrors(getPlans) )
router.post("/createcustomer", verifyToken, catchErrors(createCustomer) )
router.post("/createsubscription", verifyToken, catchErrors(createSubscription))
router.post("/updatesubscription", verifyToken, catchErrors(updateSubscription))
router.get("/subscriptions/:customerId", verifyToken, catchErrors(getUserSubscriptions))
router.delete("/cancelsubscription/:subscriptionId", verifyToken, catchErrors(cancelSubscription))

export default router;
