import { Request, Response } from "express";
import { Conversation } from "../models";
import { adminFind } from "../helpers";

/**
 * Creates new instance of Conversation in database
 */
export const createConversation = async (req: Request, res: Response) => {
  const { senderId } = req.body;
  const adminAccount =await adminFind();

  // Check if a conversation already exists with the same members
  if(adminAccount){
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, adminAccount._id] },
    });

    if (existingConversation) {
      // Conversation already exists, return the existing conversation
      return res.status(200).json({
        message: 'Conversation already exists',
        conversation: existingConversation,
      });
    }
    // Conversation doesn't exist, create a new one
    const newConversation = new Conversation({
      members: [senderId, adminAccount._id],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json({
      message: 'Conversation created successfully',
      conversation: savedConversation,
    });
  };
}

/**
 * Find conversations of user from database
 */
export const getConversation = async (req: Request, res: Response) => {
    const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
  };
  
  

  /**
 * Find conversations of user from database
 */
export const getAdminConversation = async (req: Request, res: Response) => {
  const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate('members', 'fullName email');
    res.status(200).json(conversation);
};

