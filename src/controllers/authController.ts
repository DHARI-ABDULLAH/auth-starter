import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcrypt";

// [A1] What — Auth controller — Why — register/login endpoints — Result: user + JWT

export async function registerUser(req: Request, res: Response) {
  try {
    // eslint-disable-next-line no-console
    console.log("RegisterUser called", req.body);
    const { name, email, password, serialNumber } = req.body as {
      name: string;
      email: string;
      password: string;
      serialNumber: string;
    };

    if (!name || !email || !password || !serialNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, serialNumber });
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      serialNumber: user.serialNumber,
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        serialNumber: user.serialNumber,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed", error: (err as Error).message });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    // eslint-disable-next-line no-console
    console.log("LoginUser called", req.body);
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      serialNumber: user.serialNumber,
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        serialNumber: user.serialNumber,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: (err as Error).message });
  }
}


