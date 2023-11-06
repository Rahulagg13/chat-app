require("dotenv").config({ path: "./config.env" });
const express = require("express");

const app = express();
const cors = require("cors");
const connectToMongoose = require("./db");
const morgan = require("morgan");
const userRouter = require("./Routes/userRouter");
const chatRouter = require("./Routes/chatRouter");
const messageRouter = require("./Routes/messageRouter");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("*", (req, res) => {
  res.send("<h1>Page not found</h1>");
});

connectToMongoose();
const server = app.listen(process.env.PORT || 9000, () => {
  console.log(`App is runnnig on ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("server connection");
  socket.on("individual_room", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("individual_room", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
