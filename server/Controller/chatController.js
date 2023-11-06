const asyncHandler = require("../utils/asyncHandler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    return res.status(400).json({
      status: "failed",
      message: "UserId param not sent with request",
    });
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
    return;
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).json(FullChat);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).json({
      status: "fail",
      message: "Please Fill all field",
    });
  }
  let users = JSON.parse(req.body.users);
  console.log(users);

  if (users.length < 2) {
    return res.status(400).json({
      status: "fail",
      message: "More than 2 users are required to form the group",
    });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});
const renameGroupChat = asyncHandler(async (req, res) => {
  try {
    const { chatName, chatId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).json({
        message: "Chat Not Found",
      });
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const updatedMember = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedMember) {
      res.status(404).json({
        message: "Chat Not Found",
      });
    } else {
      res.status(200).json(updatedMember);
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const updatedMember = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedMember) {
      res.status(404).json({
        message: "Chat Not Found",
      });
    } else {
      res.status(200).json(updatedMember);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeFromGroup,
  addToGroup,
};
