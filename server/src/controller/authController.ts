import userModel from "../model/userModel";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/generateToken";

export const registeration = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await userModel.find({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hashed = await hashPassword(password);
    const UserData = new userModel({
      name: name,
      email: email,
      password: hashed,
    });
    const newUser = await UserData.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,  
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {}
};
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };
    console.log(decoded, "decoded token");
    const newAccessToken = generateRefreshToken(decoded.userId);
    return res.status(200).json({
      accessToken: newAccessToken,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
