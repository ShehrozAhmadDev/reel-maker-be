import { Types, Document } from "mongoose";
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

export interface IUserDocument extends userI, Document, ITimestamps {
  comparePassword(password: string): Promise<boolean>;
  getToken(): string;
  verified: boolean;
  role: string;
}

export interface JwtPayload {
  id: string;
}
