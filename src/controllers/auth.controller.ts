import { Request, Response } from "express";
import { userFind, userExists, validateEmail } from "../helpers";
import { User } from "../models";
import { IUserDocument } from "../types/types";

/**
 * Login user and returns jwt token of user
 */
export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req?.body;

  const user = await userFind({
    email: email.toLowerCase(),
  });
  if (!user) {
    return res.status(401).json({ message: "User not exists on this email" });
  }
  if (!(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Email/Password does not match" });
  }

  if (!user.verified) {
    return res.status(401).json({ message: "User not verified!" });
  }

  const token = await user.getToken();
  return res.status(200).json({
    status: 200,
    message: "Logged In",
    token,
    user: user,
  });
};

/**
 * Creates new instance of User in database
 */
export const signUp = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    password,
  }: {
    fullName: string;
    email: string;
    password: string;
  } = req?.body;

  if (await userExists(email)) {
    return res
      .status(500)
      .json({ message: `User already registered with this email ${email}` });
  }

  if (!(await validateEmail(email))) {
    return res
      .status(500)
      .json({ message: "Please enter correct email address" });
  }
  const user = await User.create({
    fullName,
    email,
    password,
  });

  return res.status(200).json({
    status: 200,
    message: `User signed up successfully, ${email}`,
    user: user,
  });
};

/**
 * Get :Logged In User Profile from database
 */
export const myProfile = async (
  req: Request,
  res: Response
): Promise<Response<IUserDocument>> => {
  const user = await User.findById(req?.user?._id).select("-password");
  return res.status(200).json({ user });
};
