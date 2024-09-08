const { ConversationModel } = require("../models/ConversationModel");


const getConversation = async(currentUserId) => {
  if (currentUserId) {
      const currentUserConversation = await ConversationModel.find({
        $or: [{ sender: currentUserId }, { reciver: currentUserId }],
      })
        .sort({ updatedAt: -1 })
        .populate("messages")
        .populate("sender")
        .populate("reciver");

      const conversation = currentUserConversation.map((conv) => {
        const constUnseenMsg = conv?.messages?.reduce(
          (prev, curr) => {
            const msgByUserId = curr?.msgByUserId.toString();

            if (msgByUserId !== currentUserId) {
              return prev + (curr.seen ? 0 : 1);
            } else {
              return prev
            }
          },
          0
        );

        return {
          _id: conv?._id,
          sender: conv?.sender,
          reciver: conv?.reciver,
          unseenMsg: constUnseenMsg,
          lastMsg: conv?.messages[conv?.messages?.length - 1]
        };
      });

      return conversation
  }else{
      return []
    }
}

module.exports = getConversation;