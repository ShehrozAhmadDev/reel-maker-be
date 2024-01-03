import { model, Schema } from "mongoose";
import { Status } from "../types/enums";
import { ISubscriptionDocument } from "../types/types";

const subscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    subscriptionId: {type: String},
    planId: { type: String },
    priceId: {type: String},
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [Status.PENDING, Status.APPROVED, Status.EXPIRED, Status.CANCELLED],
      default: Status.PENDING,
    },
    noOfVideosRemaining: { type: Number },
    paymentStatus: {
      type: String,
      enum: [Status.PENDING, Status.APPROVED, Status.REJECTED],
      default: Status.PENDING,
    },
    expiryDate: { type: Date },
  },
  { timestamps: true, bufferTimeoutMS: 50000 }
);

const SubscriptionPlan = model<ISubscriptionDocument>("Subscription", subscriptionSchema);

export default SubscriptionPlan;
