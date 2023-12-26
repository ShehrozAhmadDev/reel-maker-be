import { model, Schema } from "mongoose";
import { IConversationDocument } from "../types/types";

const conversationSchema = new Schema<IConversationDocument>(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User"}]
  },
  { timestamps: true, bufferTimeoutMS: 50000 }
);


const Conversation = model<IConversationDocument>("Conversation", conversationSchema);

export default Conversation;