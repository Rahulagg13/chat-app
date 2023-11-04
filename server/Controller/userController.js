const asyncHandler = require("../utils/asyncHandler");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "10h",
  });
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, photo } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please all fill all field");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    photo,
  });

  const token = signToken(newUser._id);
  if (newUser) {
    res.status(201).json({
      status: "Success",
      user: newUser,
      token,
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "error in register the user",
    });
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Incorrect Email or Password",
    });
  }

  const user = await User.findOne({ email });
  console.log(user);
  if (!user && !(await user.matchPassword(password, user.password))) {
    return res.status(401).json({
      status: "failed",
      message: "User not found",
    });
  }
  console.log(user._id);
  const token = signToken(user._id);

  res.status(200).json({
    status: "Success",
    message: "User Logged in successfully",
    user,
    token,
  });
});

const allUser = asyncHandler(async (req, res) => {
  const query = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // const users = await User.find(query);
  const users = await User.find({
    $and: [query, { _id: { $ne: req.user._id } }],
  });
  res.status(200).json({
    status: "success",
    users,
  });
});

module.exports = {
  registerUser,
  authUser,
  allUser,
};
