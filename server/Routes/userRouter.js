const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  allUser,
} = require("../Controller/userController");
router.route("/").post(registerUser).get(protect, allUser);
router.route("/login").post(authUser);

module.exports = router;
