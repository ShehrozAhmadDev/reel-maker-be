import mongoose, { Types, Document } from "mongoose";
import { ReadStream } from "fs";
import { Model } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
interface userI {
  fullName: string;
  email: string;
  password: string;
}

interface messageI {
  text: string;
}


export interface IUserDocument extends userI, Document, ITimestamps {
  comparePassword(password: string): Promise<boolean>;
  getToken(): string;
  verified: boolean;
  role: string;
}

export interface IMessageDocument extends messageI, Document, ITimestamps {
  senderId : mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
}
export interface IPlanDocument extends  Document, ITimestamps {
  title : string;
  description: string;
  price: number;
  noOfVideos: number;
  duration: number;
}


export interface IUserPlanDocument extends  Document, ITimestamps {
  planId : mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: string;
  noOfVideosRemaining: number;
  paymentStatus: string;
  expiryDate: Date;
}

export interface IProjectDocument extends  Document, ITimestamps {
  title : string;
  description: string;
  link: string;
  userPlan:  mongoose.Types.ObjectId;
  createdBy:mongoose.Types.ObjectId;
}




export interface IConversationDocument extends Document, ITimestamps {
  members : mongoose.Types.ObjectId[];
}
export interface JwtPayload {
  id: string;
}
