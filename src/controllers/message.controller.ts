import { Request, Response } from "express";
import { Message } from "../models";

/**
 * Create new message in database
 */
export const sendMessage = async (req: Request, res: Response) => {
    const newMessage = new Message(req.body);
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
  };
  

  /**
 * Get all messages from conversation
 */
export const getConversationMessages = async (req: Request, res: Response) => {
    const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
  };
  