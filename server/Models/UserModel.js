const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "This is Email is Already Exist"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "password must be 8 or more character long"],
    },
    photo: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified || !this.isNew) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (
  EnteredPassward,
  userPassword
) {
  return await bcrypt.compare(EnteredPassward, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
