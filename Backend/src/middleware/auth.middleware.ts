import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
// Authentication middleware
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token =
    req.cookies?.jwtToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const secretKey = process.env.JWT_Secret!;

  if (!secretKey) {
    return res.status(500).json({ message: "Secret key is not configured" });
  }

  // Verify and decode token
  const decodedToken = jwt.verify(token, secretKey);
  console.log(decodedToken);

  try {
    const user = await User.findById(decodedToken).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid  token" });
    }
    req.user = user;

    // Attach user info to request object

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
