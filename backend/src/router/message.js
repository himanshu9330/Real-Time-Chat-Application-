const express=require('express')
const {Message}=require('../models/message');
const { protectRouter } = require('../middleware/protect');
const { User } = require('../models/user');
const { cloudinary } = require('../lib/cloudinary');
const {getReceiverSocketId , io} = require('../lib/socket');

const getMessageRouter = (io) =>{
const message_router=express.Router();

message_router.get('/users', protectRouter, async(req, res)=>{
    try{
                  const loggedin=req.user;
                  const sideuser=await User.find({_id: { $ne: loggedin._id } }).select("-password")
                  return res.status(200).json(sideuser)
    }catch(error){
        console.log("error from get side user:", error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
})

message_router.get('/:id', protectRouter, async(req,res)=>{
    try{
    const {id:receiverId}=req.params
    const myId=req.user._id
   const message = await Message.find({
    $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId }
    ]
})
.sort({ createdAt: 1 }) // Added sorting
.populate('senderId', 'username profile'); 
    return res.status(200).json(message);
    }catch(error){
         console.error("Error fetching messages:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
})

message_router.post('/message/:id', protectRouter, async(req, res)=>{
      try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        // 1. Validate receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Recipient user not found" });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                // 2. Added upload options for better handling
                upload_preset: 'message_uploads',
                folder: 'message_attachments'
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            text,
            image: imageUrl,
            senderId,
            receiverId
        });

        await newMessage.save();
         
        const recevierSocketId = getReceiverSocketId(receiverId)
        if(recevierSocketId){
           io.to(recevierSocketId).emit("newMessage", newMessage);
          }

        // 3. Populate sender info before responding
        const populatedMessage = await Message.populate(newMessage, {
            path: 'senderId',
            select: 'username profile' // Only include necessary fields
        });

        // 4. Changed status code to 201 (Created)
        return res.status(201).json(populatedMessage);

      } catch (error) {
                // 5. Improved error logging
                console.error("Error sending message:", {
                    error: error.message,
                    receiverId: req.params.id,
                    senderId: req.user._id
                });
                return res.status(500).json({ 
                    message: "Failed to send message",
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
      }
})

   return message_router;
}

module.exports= getMessageRouter
