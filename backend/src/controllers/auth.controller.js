import generateToken from "../lib/utlis.js"; // Fixed spelling
import UserModel from "../models/auth.model.js"; // Fixed casing
import bcrypt from "bcryptjs"; // Correct import casing
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, password, fullName, profilePic } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email }); // Pass an object with the email

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Fixed method name
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await UserModel.create({
      email,
      fullName,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      // Generate token and send response
      generateToken(newUser._id, res); // Assuming this sets a cookie or sends a token
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic, // Handle cases where profilePic is not provided
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup Controller:", error); // Log for debugging
    return res.status(500).json({ error: "Signup error from backend" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return  res.status(400).json({ message: "User Not Found" });
    }
    const isPasswordCorrect =await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    generateToken(existingUser._id ,res);

    res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    console.log(`Login Controller Error : ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Logout SuccessFully" });
  } catch (error) {
    console.log(`Logout controller Error: ${error}`);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async( req,res) =>{
  const {profilePic} = req.body;
  const userId = req.user._id
  try {
    if(!profilePic) {
      return   res.status(404).json({ message: "Profile Picture is Required" });
    }

    const uploadResult = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await UserModel.findByIdAndUpdate(userId , {profilePic:uploadResult.secure_url}, {new:true})
  

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser)

  } catch (error) {
    console.log(`updateProfile controller Error: ${error}`);


    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const authUserCheck = (req,res) =>{
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log(`authUserCheck controller Error: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

