import Task from "../models/task.model";
import { Request, Response } from "express"

import paginationHelper from "../../../helpers/pagination"
import searchHelper from "../../../helpers/search";

import { TaskAction, TaskStatus } from "../enums/task.enum";

export const index = async (req: Request, res: Response) => {
  // find
  interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp
  }

  const find: Find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status.toString();
  }
  // end find

  // Search
  const objectSearch = searchHelper(req.query);

  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  // End Search

  // Pagination
  const countTasks = await Task.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2
    },
    req.query,
    countTasks
  )
  // End Pagination

  // Sort
  const sort: Record<string, "asc" | "desc"> = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    const sortValue = req.query.sortValue.toString() as "asc" | "desc";

    sort[sortKey] = sortValue;
  }

  // End sort
  const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
  res.json(tasks);
}

export const detail = async (req: Request, res: Response) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false
  })
  res.json(task);
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const status: string = req.body.status;

    await Task.updateOne({ _id: id }, { status: status });

    res.status(200).json({
      code: 200,
      message: "Status thay đổi thành công!"
    })
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Không tồn tại!"
    })
  }
}

// PATCH /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids;
    const key = req.body.key as TaskAction;
    const value = req.body.value as TaskStatus;

    switch (key) {
      case TaskAction.STATUS:
        await Task.updateMany({ _id: { $in: ids } }, { status: value });

        return res.status(200).json({
          code: 200,
          message: "Status thay đổi thành công!"
        })

      case TaskAction.DELETE:
        await Task.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });

        return res.status(200).json({
          code: 200,
          message: "Xóa thành công!"
        })

      default:
        return res.status(400).json({
          code: 400,
          message: "Action không hợp lệ!"
        })
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error!"
    })
  }
}