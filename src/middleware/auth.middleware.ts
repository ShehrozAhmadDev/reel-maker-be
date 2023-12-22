import { Request, Response , NextFunction} from "express";
import config from "../config";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { isAdmin } from "../helpers";

export const verifyToken = async (req:Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      res.status(403).send("Access Send");
    }
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
      const verified = jwt.verify(token, config.JWT_SECRET || "");
      if (verified && typeof verified === 'object' && 'id' in verified) {
        const userId = (verified as jwt.JwtPayload).id || "";
        const user = await User.findById(userId).select("-password");
        if(user){
            req.user = user;
        }
      }
      next();
    }

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const verifyIsAdmin = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const isAdminFound =await isAdmin(req?.user?.id || "")
    if(isAdminFound){
      next();
    }
    else{
      res.status(400).json({message: "You dont have access to this function"})
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


