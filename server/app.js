require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const connectToMongoose = require("./db");
const morgan = require("morgan");
const userRouter = require("./Routes/userRouter");
const chatRouter = require("./Routes/chatRouter");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("*", (req, res) => {
  res.send("<h1>Page not found</h1>");
});

connectToMongoose();
app.listen(process.env.PORT || 9000, () => {
  console.log(`App is runnnig on ${process.env.PORT}`);
});
