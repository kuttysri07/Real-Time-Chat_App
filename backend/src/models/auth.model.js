import mongoose from "mongoose";

const UserShema = new mongoose.Schema(
  {
    email: {
      require: true,
      type: String,
    },
    password: {
      require: true,
      type: String,
    },
    fullName: {
      require: true,
      type: String,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User",UserShema);

export default UserModel;


