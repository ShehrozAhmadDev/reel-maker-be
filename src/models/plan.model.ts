import { model, Schema } from "mongoose";
import { IPlanDocument } from "../types/types";

const planSchema = new Schema<IPlanDocument>(
  {
    title: { type: String, require: true },
    description: { type: String },
    price: { type: Number },
    noOfVideos: { type: Number },
    duration: { type: Number },
    features: [{type: String}],
  },
  { timestamps: true, bufferTimeoutMS: 50000 }
);

const Plan = model<IPlanDocument>("Plan", planSchema);

export default Plan;
