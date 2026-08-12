import Task from "../models/task.model";
import { Request, Response } from "express"

import paginationHelper from "../../../helpers/pagination"
import searchHelper from "../../../helpers/search";

import { TaskAction, TaskStatus } from "../enums/task.enum";

import { MESSAGE } from "../constants/message";

export const index = async (req: Request, res: Response) => {
  try {
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
    const objectPagination = paginationHelper(
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
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    });
  }
}

export const detail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      _id: id,
      deleted: false
    })
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: MESSAGE.NOT_FOUND
      });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    });

  }
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const status = req.body.status as TaskStatus;

    const result = await Task.updateOne({ _id: id }, { status: status });
    if (result.matchedCount === 0) {
      return res.status(404).json({
        code: 404,
        message: MESSAGE.NOT_FOUND
      });
    }

    return res.status(200).json({
      code: 200,
      message: MESSAGE.UPDATE_SUCCESS
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
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
        const resultStatus = await Task.updateMany({ _id: { $in: ids } }, { status: value });
        if (resultStatus.matchedCount === 0) {
          return res.status(404).json({
            code: 404,
            message: MESSAGE.NOT_FOUND
          });
        }

        return res.status(200).json({
          code: 200,
          message: MESSAGE.UPDATE_SUCCESS
        })

      case TaskAction.DELETE:
        const resultDelete = await Task.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
        if (resultDelete.matchedCount === 0) {
          return res.status(404).json({
            code: 404,
            message: MESSAGE.NOT_FOUND
          });
        }

        return res.status(200).json({
          code: 200,
          message: MESSAGE.DELETE_SUCCESS
        })

      default:
        return res.status(400).json({
          code: 400,
          message: MESSAGE.BAD_REQUEST
        })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    })
  }
}

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    const {
      title,
      status,
      content,
      timeStart,
      timeFinish,
      listUser,
      taskParentId
    } = req.body;
    const task = new Task({
      title,
      status,
      content,
      timeStart,
      timeFinish,
      listUser,
      taskParentId
    });
    const savedTask = await task.save();

    return res.status(201).json({
      code: 201,
      message: MESSAGE.CREATE_SUCCESS,
      data: savedTask
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    })
  }
}

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = String(req.params.id);

    await Task.updateOne({ _id: id }, req.body);
    return res.status(200).json({
      code: 200,
      message: MESSAGE.UPDATE_SUCCESS
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      code: 500,
      message: MESSAGE.INTERNAL_SERVER_ERROR
    })

  }
}