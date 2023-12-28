import { model, Schema } from "mongoose";
import { IProjectDocument } from "../types/types";

const projectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, require: true },
    description: { type: String },
    link: { type: String },
    userPlan: {type: Schema.Types.ObjectId, ref: "UserPlan"}
  },
  { timestamps: true, bufferTimeoutMS: 50000 }
);

const Project = model<IProjectDocument>("Project", projectSchema);

export default Project;
