const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { allMessages, sendMessage } = require("../Controller/messageController");
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
