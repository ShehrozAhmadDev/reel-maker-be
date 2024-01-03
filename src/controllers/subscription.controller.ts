import { Request, Response } from "express";
import stripe from "stripe";
import Config from "../config";
import { Subscription, User } from "../models";
import { Status } from "../types/enums";
import { userFindById } from "../helpers";

const stripeWebhookSecret = Config.STRIPE_SECRET_KEY || "";
const stripeClient = new stripe(stripeWebhookSecret);

/**
 * Retrieves the list of subscription plans from Stripe.
 *
 */
export const getPlans = async (_req: Request, res: Response) => {
  const products = await stripeClient.products.list({
    expand: ["data.default_price"],
  });
  const mappedProducts = products.data.map((product: any) => {
    return {
      title: product.name,
      features: product.features.map((feature: any) => feature.name),
      price: product.default_price?.unit_amount,
      priceId: product.default_price?.id,
      productId: product.id,
    };
  });
  res.status(200).json({
    products: mappedProducts,
    status: 200,
  });
};

/**
 * Create Customer in stripe and add customerId in user model.
 *
 */
export const createCustomer = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  let stripeCustomerId = "";
  if (user) {
    if (user.stripeId) {
      stripeCustomerId = user.stripeId;
    } else {
      const customer = await stripeClient.customers.create({
        email: user.email,
        name: user.fullName,
      });

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { stripeId: customer.id },
        { new: true }
      );
      stripeCustomerId = updatedUser?.stripeId || "";
    }
  }
  res.cookie("customer", stripeCustomerId, { maxAge: 900000, httpOnly: true });
  res.status(200).json({ status: 200, customer: stripeCustomerId });
};

/**
 * Create Subscription in stripe on basis of customerId and priceId from plan.
 *
 * Create subscription as well in model.
 *
 * Send Client Id and Subscription Id
 */

export const createSubscription = async (req: Request, res: Response) => {
  const { customerId, priceId } = req.body;

  const user = await userFindById(req.user?.id);
  if (
    user?.subscriptionId instanceof Subscription &&
    user.subscriptionId.status !== Status.EXPIRED
  ) {
    res.status(400).json({status : 400 ,message:"User already subscribed to a plan" })
  }

  const subscription = await stripeClient.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  const invoice = subscription.latest_invoice as stripe.Invoice;
  const paymentIntent = invoice?.payment_intent as stripe.PaymentIntent;

  if (!paymentIntent?.client_secret) {
    res.status(400).json({status : 400 ,message:"Client secret not found in payment intent." })
  }

  if (subscription) {
    const newSubscription = new Subscription({
      subscriptionId: subscription.id,
      planId: subscription.items.data[0].price.product,
      priceId: priceId,
      userId: req.user?.id,
      status: Status.PENDING,
      noOfVideosRemaining: subscription.items.data[0].metadata.videos || 5,
      paymentStatus: Status.PENDING,
      expiryDate: new Date(subscription.current_period_end * 1000),
    });
    await newSubscription.save();
    await User.findByIdAndUpdate(req.user?.id, {subscriptionId: newSubscription._id });
  }
  const updatedUser = await userFindById(req.user?.id).populate("subscriptionId");

  res.status(200).json({
    status: 200,
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret,
    user: updatedUser
  });
};

/**
 * Update subscription of user
 *
 */
// export const updateSubscription = async (req: Request, res: Response) => {
//     const subscriptionId = req.body.subscriptionId;
//     const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);

//     const updatedSubscription = await stripeClient.subscriptions.update(subscriptionId, {
//       items: [{
//         id: subscription.items.data[0].id,
//         price: req.body.priceId,
//       }],
//       expand: ['latest_invoice.payment_intent'],
//     });

//     const invoice = updatedSubscription.latest_invoice as stripe.Invoice;
//     const paymentIntent = invoice.payment_intent as stripe.PaymentIntent;

//     if (!paymentIntent.client_secret) {
//       throw new Error('Client secret not found in payment intent.');
//     }

//     res.status(200).json({
//       subscriptionId: updatedSubscription.id,
//       clientSecret: paymentIntent.client_secret,
//     });
// };

/**
 * Returns all subscription of user
 *
 */

export const getUserSubscriptions = async (req: Request, res: Response) => {
  const customerId = req.params.customerId;

  const subscriptions = await stripeClient.subscriptions.list({
    customer: customerId,
    status: "all",
    expand: ["data.default_payment_method"],
  });
  const mappedSubscriptions = subscriptions.data.map((subscription) => {
    return {
      subId: subscription.id,
      startDate: subscription.current_period_start,
      endDate: subscription.current_period_end,
      customerId: subscription.customer,
      productId: subscription.items.data[0].plan.product,
      priceId: subscription.items.data[0].plan.id,
    };
  });
  res.status(200).json({ status: 200, subscriptions: mappedSubscriptions });
};

/**
 * Cancel subscription of user
 *
 * Update status in subscription model
 *
 */
export const cancelSubscription = async (req: Request, res: Response) => {
  const subscriptionId = req.params.subscriptionId;
  const deletedSubscription = await stripeClient.subscriptions.cancel(
    subscriptionId
  );
  if (deletedSubscription) {
    const user = await userFindById(req.user?.id);
    const updatedSubscription = Subscription.findByIdAndUpdate(
      user?.subscriptionId._id,
      { status: Status.CANCELLED }
    );
    res.status(200).json({ status: 200, subscription: updatedSubscription });
  } else {
    res.status(400).json({ message: "No Subscription Found" });
  }
};


/**
 * Resume subscription of user
 *
 */
export const resumeSubscription = async (req: Request, res: Response) => {
  const subscriptionId = req.params.subscriptionId;

  const subscription = await stripeClient.subscriptions.resume(
    subscriptionId,
    {
      billing_cycle_anchor: 'now',
    }   
);
  if (subscription) {
    const user = await userFindById(req.user?.id);
    const updatedSubscription = Subscription.findByIdAndUpdate(
      user?.subscriptionId._id,
      { status: Status.CANCELLED }
    );
    res.status(200).json({ status: 200, subscription: updatedSubscription });
  } else {
    res.status(400).json({ message: "No Subscription Found" });
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  const subscriptionId = req.params.subscriptionId;
  const subscription = await Subscription.findByIdAndUpdate(subscriptionId, {status: Status.APPROVED, paymentStatus: Status.APPROVED}, {new: true});
  if (subscription) {
    res.status(200).json({ status: 200, subscription: subscription });
  } else {
    res.status(400).json({ message: "No Subscription Found" });
  }
};