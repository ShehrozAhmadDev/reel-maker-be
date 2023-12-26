import { Request, Response } from "express";
import { Conversation } from "../models";

/**
 * Creates new instance of Conversation in database
 */
export const createConversation = async (req: Request, res: Response) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
    const savedConversation = await newConversation.save();
    res.status(200).json({message: "Conversation created successfully", conversation:savedConversation}); 
  };
  

/**
 * Find conversations of user from database
 */
export const getConversation = async (req: Request, res: Response) => {
    const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
  };
  
  