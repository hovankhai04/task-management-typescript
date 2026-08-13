import User from "../models/user.model";
import { Request, Response } from "express"
import md5 from "md5";
import { generateRandomString } from "../../../helpers/generate";
import { MESSAGE } from "../constants/message";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false
    });
    if (existEmail) {
      return res.status(400).json({
        code: 400,
        message: "Email đã tồn tại!"
      });
    }

    req.body.password = md5(req.body.password);
    req.body.token = generateRandomString(20);

    const user = new User(req.body);
    const data = await user.save();

    const token = data.token;

    return res.status(201).json({
      code: 201,
      message: MESSAGE.CREATE_SUCCESS,
      token: token
    });

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    })
  }
}

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await User.findOne({
      email: email,
      deleted: false
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Không tìm thấy tài khoản!"
      });
    }

    if (md5(password) !== user.password) {
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu không đúng!"
      });
    }
    const token = user.token;

    return res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: token
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    })
  }
}