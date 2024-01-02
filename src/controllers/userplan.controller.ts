import { Request, Response } from "express";
import stripe from "stripe"; 
import Config from "../config";
import { User } from "../models";

const stripeWebhookSecret = Config.STRIPE_SECRET_KEY || "";
const stripeClient = new stripe(stripeWebhookSecret);



export const getPlans =async (_req: Request, res: Response) => {
    const products = await stripeClient.products.list({
      expand: ['data.default_price']
    });
    console.log(products);
    const mappedProducts = products.data.map((product: any)=>{
      return {
        title: product.name,
        features: product.features.map((feature: any)=> feature.name) ,
        price: product.default_price?.unit_amount ,
        priceId: product.default_price?.id,
        productId: product.id ,
      }
    })
    res.send({
      products: mappedProducts,
    });
  };


  export const createCustomer = async (req: Request, res: Response) => {
    try {
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
  
         const updatedUser = await User.findByIdAndUpdate(user._id,{stripeId: customer.id},{new: true});
          stripeCustomerId = updatedUser?.stripeId || "";
        }
      }
      res.cookie('customer', stripeCustomerId, { maxAge: 900000, httpOnly: true });
      res.status(200).send({ customer: stripeCustomerId });
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


  export const createSubscription =async (req: Request, res: Response) => {
    const {customerId, priceId} = req.body;
      const subscription = await stripeClient.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      if (subscription.latest_invoice && typeof subscription.latest_invoice === 'object') {
        const invoice = subscription.latest_invoice as stripe.Invoice;
  
        if (invoice.payment_intent && typeof invoice.payment_intent === 'object') {
          const paymentIntent: stripe.PaymentIntent = invoice.payment_intent as stripe.PaymentIntent;
          if(req.user){
            await User.findByIdAndUpdate(req.user.id,{subscriptionId: subscription.id},{new: true});
          }
          if (paymentIntent.client_secret) {
            res.send({
              subscriptionId: subscription.id,
              clientSecret: paymentIntent.client_secret,
            });
            return;
          }
        }
      }
  };


  export const updateSubscription =async (req: Request, res: Response) => {
      const subscription = await stripeClient.subscriptions.retrieve(
        req.body.subscriptionId
      );
      const updatedSubscription = await stripeClient.subscriptions.update(
        req.body.subscriptionId, {
          items: [{
            id: subscription.items.data[0].id,
            price: req.body.priceId,
          }],
          expand: ['latest_invoice.payment_intent'],
        }
      );

        const invoice = updatedSubscription.latest_invoice as stripe.Invoice;
        const paymentIntent: stripe.PaymentIntent = invoice.payment_intent as stripe.PaymentIntent;
        console.log(paymentIntent)
          if (paymentIntent.client_secret) {
            res.send({
              subscriptionId: updatedSubscription.id,
              clientSecret: paymentIntent.client_secret,
            });
            return;
          }
    }



    export const getUserSubscriptions = async (req: Request, res: Response)=>{
      const customerId = req.params.customerId;

      const subscriptions = await stripeClient.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      });
      const mappedSubscriptions = subscriptions.data.map((subscription)=>{
        return {
          subId: subscription.id,
          startDate: subscription.current_period_start ,
          endDate: subscription.current_period_end,
          customerId: subscription.customer,
          productId: subscription.items.data[0].plan.product,
          priceId: subscription.items.data[0].plan.id,
        }
      })
      res.status(200).json(mappedSubscriptions);
    }

    export const cancelSubscription = async (req: Request, res: Response)=>{
      const subscriptionId = req.params.subscriptionId;
      const deletedSubscription = await stripeClient.subscriptions.cancel(subscriptionId)
      if(deletedSubscription){
        await User.findByIdAndUpdate(req.user?.id, {subscriptionId: ""},{new: true});
        res.status(200).json({ status: 200, subscription: deletedSubscription });
      }
      else{
        res.status(400).json({ message: "No Subscription Found" });
      }
    }