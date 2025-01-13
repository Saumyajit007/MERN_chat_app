import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;
        // console.log(typeof(senderId))
        // console.log("message",message)
        // console.log("reciverId",receiverId)
        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });
        
        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        
        // console.log(gotConversation)
        let newMessage = await Message.create({
            senderID:senderId,
            reciverID:receiverId,
            message:message
        });

        // console.log(newMessage)

        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        
        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage  
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}