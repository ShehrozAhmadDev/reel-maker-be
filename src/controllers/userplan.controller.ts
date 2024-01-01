// controllers/userPlanController.ts
import { Request, Response } from "express";
import { Status } from "../types/enums";
import { UserPlan } from "../models";
import stripe from "stripe"; 

const stripeSecretKey = "your_stripe_secret_key"; 
const stripeWebhookSecret = "your_stripe_webhook_secret";
const stripeClient = new stripe(stripeSecretKey);

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    // Add your Stripe logic here to create a PaymentIntent
    // Retrieve the plan details and user information from req.body
    // Use Stripe SDK to create a PaymentIntent

    // Example:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: req.body.amount,
    //   currency: req.body.currency,
    //   // Add other necessary fields
    // });

    // Create a user plan in your MongoDB after successful payment
    const userPlan = new UserPlan({
      planId: req.body.planId,
      userId: req.body.userId,
      status: Status.PENDING,
      noOfVideosRemaining: 0, 
      paymentStatus: Status.PENDING,
      expiryDate: null, 
    });

    await userPlan.save();

    res.status(200).json({ message: "PaymentIntent created successfully", userPlan });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"] as string;

  let event: stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(payload, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.error("Error verifying webhook signature:", err);
    return res.status(400).json({ message: "Webhook signature verification failed" });
  }

  // Handle different events
  switch (event.type) {
    case "payment_intent.succeeded":
    //   const paymentIntent = event.data.object as stripe.PaymentIntent;
      // Handle successful payment event
      // Update user plan status, paymentStatus, and expiryDate in MongoDB
      // Example: 
      // const userPlan = await UserPlan.findOneAndUpdate(
      //   { paymentIntentId: paymentIntent.id },
      //   {
      //     status: Status.APPROVED,
      //     paymentStatus: Status.APPROVED,
      //     expiryDate: new Date(), // Set the actual expiry date based on your business logic
      //   },
      //   { new: true }
      // );
      break;
    
    case "payment_intent.payment_failed":
      // Handle payment failure event
      // Update user plan status and paymentStatus in MongoDB
      break;

    // Add more cases for other relevant events as needed

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
