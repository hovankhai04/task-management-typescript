import { NextFunction, Request, Response } from "express";

export const register = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      code: 400,
      message: "Vui lòng nhập đầy đủ thông tin."
    });
  }

  next();
};