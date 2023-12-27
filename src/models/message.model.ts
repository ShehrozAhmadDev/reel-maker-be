import { model, Schema } from "mongoose";
import { IMessageDocument } from "../types/types";

const messageSchema = new Schema<IMessageDocument>(
  {
    senderId: {  type: Schema.Types.ObjectId, ref: "User"},
    conversationId: {  type: Schema.Types.ObjectId, ref: "Conversation"},
    text: {type: String}
  },
  { timestamps: true, bufferTimeoutMS: 50000 }
);


const Message = model<IMessageDocument>("Message", messageSchema);

export default Message;