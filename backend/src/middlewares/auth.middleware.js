import UserModel from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    let decode = jwt.verify(token, process.env.SECRETKEY);

    if (!decode) {
      return res.status(400).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await UserModel.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "No user Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(`Error in ProtuctRoute Middleware : ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
