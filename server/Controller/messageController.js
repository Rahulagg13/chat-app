const asyncHandler = require("../utils/asyncHandler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");
const Message = require("../Models/MessageModel");

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name photo email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json(error);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({
      message: "Invalid data passed into request",
    });
  }
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name photo");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name photo email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

module.exports = { sendMessage, allMessages };
