import Task from "../models/task.model";
import { Request, Response } from "express"

import paginationHelper from "../../../helpers/pagination"

export const index = async (req: Request, res: Response) => {
  // find
  interface Find {
    deleted: boolean;
    status?: string;
  }

  const find: Find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status.toString();
  }
  // end find

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