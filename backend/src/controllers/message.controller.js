import cloudinary from "../lib/cloudinary.js";
import UserModel from "../models/auth.model.js";
import MessageModel from "../models/message.model.js";
import{getReceiverSocketId ,io} from "../lib/socket.js"

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const filteredUser = await UserModel.find({
      _id: { $ne: loggedUser },
    }).select("-password");

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log(`Error in getUserForSlideBar Controller :${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  try {
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, reciverId: userToChatId },
        { senderId: userToChatId, reciverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(`Error in getMessages Controller :${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  const { image, text } = req.body;
  const { id: reciverId } = req.params;
  try {
    const myId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId: myId,
      reciverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(reciverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(`Error in sendMessage Controller :${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
