import { NextFunction, Request, Response } from "express";
import { TaskAction, TaskStatus } from "../enums/task.enum";

import mongoose from "mongoose";

export const changeMulti = (req: Request, res: Response, next: NextFunction) => {
  const { ids, key, value } = req.body;

  // Xử lý ids
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      code: 400,
      message: "Danh sách id không hợp lệ",
    });
  }

  if (!Object.values(TaskAction).includes(key)) {
    return res.status(400).json({
      code: 400,
      message: "Action không hợp lệ",
    });
  }

  // Xử lý status
  if (
    key === TaskAction.STATUS &&
    !Object.values(TaskStatus).includes(value)
  ) {

    return res.status(400).json({
      code: 400,
      message: "Status không hợp lệ"
    });

  }

  // Xử lý ObjectId
  const invalidId = ids.some(
    (id: string) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidId) {

    return res.status(400).json({
      code: 400,
      message: "ObjectId không hợp lệ"
    });

  }

  next();
};