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

export const create = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const {
    title,
    status,
    timeStart,
    timeFinish,
    taskParentId,
    listUser,
    deleted,
    deletedAt,
    createdBy
  } = req.body;

  // title
  if (!title || title.trim() === "") {
    return res.status(400).json({
      code: 400,
      message: "Tiêu đề là bắt buộc."
    });
  }

  // status
  if (
    status &&
    !Object.values(TaskStatus).includes(status)
  ) {
    return res.status(400).json({
      code: 400,
      message: "Status không hợp lệ."
    });
  }

  // timeStart
  if (timeStart && isNaN(Date.parse(timeStart))) {
    return res.status(400).json({
      code: 400,
      message: "timeStart không đúng định dạng."
    });
  }

  // timeFinish
  if (timeFinish && isNaN(Date.parse(timeFinish))) {
    return res.status(400).json({
      code: 400,
      message: "timeFinish không đúng định dạng."
    });
  }

  // taskParentId
  if (
    taskParentId &&
    !mongoose.Types.ObjectId.isValid(taskParentId)
  ) {
    return res.status(400).json({
      code: 400,
      message: "Task cha không hợp lệ."
    });
  }

  // listUser
  if (
    listUser &&
    !Array.isArray(listUser)
  ) {
    return res.status(400).json({
      code: 400,
      message: "Danh sách user không hợp lệ."
    });
  }

  // Không cho client truyền các field hệ thống
  if (
    deleted !== undefined ||
    deletedAt !== undefined ||
    createdBy !== undefined
  ) {
    return res.status(400).json({
      code: 400,
      message: "Không được phép gửi các trường hệ thống."
    });
  }

  next();

};