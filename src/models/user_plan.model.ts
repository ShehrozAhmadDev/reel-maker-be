import { model, Schema } from "mongoose";
import { IUserPlanDocument } from "../types/types";
import { Status } from "../types/enums";

const userPlanSchema = new Schema<IUserPlanDocument>(
  {
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [Status.PENDING, Status.APPROVED, Status.EXPIRED],
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

const UserPlan = model<IUserPlanDocument>("UserPlan", userPlanSchema);

export default UserPlan;
