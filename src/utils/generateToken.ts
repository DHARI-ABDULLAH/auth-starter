import jwt from "jsonwebtoken";

// [A1] What — Issue JWT — Why — stateless auth — Result: signed token with user info

type Payload = {
  userId: string;
  name: string;
  email: string;
  serialNumber: string;
};

export function generateToken(payload: Payload): string {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}


