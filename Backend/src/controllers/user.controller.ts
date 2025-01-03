import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(req: Request, res: Response): Promise<any> {
  try {
    const { fullName, email, passWord, ConfirmPassword, phoneNumber } =
      req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ mmessage: "Invalid email format" });
    }
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ mmessage: "Phone number is not valid" });
    }
    console.log(passWord === ConfirmPassword);

    console.log("passwordRegex", passwordRegex.test(passWord));
    console.log("emailRegex", emailRegex.test(email));
    if (!passwordRegex.test(passWord)) {
      // Validate password format
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      });
    }

    // Further validation (e.g., matching passwords, checking duplicates, etc.)
    if (passWord !== ConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(passWord, 9);
    console.log(hashedPassword);
    const createdUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    await createdUser.save();
    const userId = createdUser._id.toString();
    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res
      .cookie("jwtToken", token)
      .status(201)
      .json({ createdUser, message: "User registered successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json("something went wrong");
  }
}

export async function loginUser(req: Request, res: Response): Promise<any> {
  try {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mmessage: "Invalid email format" });
    }

    const exisitngUser = await User.findOne({ email });
    if (!exisitngUser) {
      return res
        .status(400)
        .json({ message: "User not found, make sure the email is correct" });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      exisitngUser.password
    );
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const userId = exisitngUser._id.toString();

    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.cookie("jwtToken", token).status(201).json({
      success: true,
      exisitngUser,
      message: "User LoggedIn Successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error, message: "something went wrong" });
  }
}
