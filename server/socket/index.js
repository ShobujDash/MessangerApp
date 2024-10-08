const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getConversation = require("../helper/getConversation");

const app = express();

// socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://shobujdasmessanger.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});



// online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect user", socket.id);
  const token = socket.handshake.auth.token;

  // current user details
  const user = await getUserDetailsFromToken(token);

  // create a room
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-pssword");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);

    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, reciver: userId },
        { sender: userId, reciver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // new message
  socket.on("new message", async (data) => {
    // check conversation is available both user

    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, reciver: data?.reciver },
        { sender: data?.reciver, reciver: data?.sender },
      ],
    });

    // if conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        reciver: data?.reciver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data.msgByUserId,
    });
    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      {
        _id: conversation?._id,
      },
      {
        $push: { messages: saveMessage?._id },
      }
    );

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, reciver: data?.reciver },
        { sender: data?.reciver, reciver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.reciver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReciver = await getConversation(data?.reciver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.reciver).emit("conversation", conversationReciver);
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  // seen mesage
  socket.on("seen", async (msgByUserId) => {
    const conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, reciver: msgByUserId },
        { sender: msgByUserId, reciver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    const conversationMessageId = conversation?.messages || [];
     const updateMessages = await MessageModel.updateMany(
       { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
       { $set: { seen: true } }
     );

    // send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReciver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReciver);
  });

  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnected user ", socket.id);
  });
});

module.exports = {
  app,
  server,
};
