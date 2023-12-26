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
  content: string;
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


export interface IConversationDocument extends Document, ITimestamps {
  members : mongoose.Types.ObjectId[];
}
export interface JwtPayload {
  id: string;
}
