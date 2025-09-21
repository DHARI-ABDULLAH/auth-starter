import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// [A1] What — JWT auth middleware — Why — protect routes — Result: attach decoded payload to req.user

export interface AuthRequest extends Request {
  user?: any;
}

export function verifyJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = parts[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const secret: string = process.env.JWT_SECRET ?? "";
  if (!secret) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    (req as AuthRequest).user = decoded;
    return next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}


