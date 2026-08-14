import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập!"
      });
      return;
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      res.status(401).json({
        code: 401,
        message: "Token không hợp lệ!"
      });
      return;
    }

    const user = await User.findOne({
      token,
      deleted: false
    }).select("-password");

    if (!user) {
      res.status(401).json({
        code: 401,
        message: "Token không hợp lệ!"
      });
      return;
    }

    req["user"] = user;

    next();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      code: 500,
      message: "Internal Server Error"
    });

  }
};