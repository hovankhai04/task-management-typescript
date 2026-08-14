"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.changeMulti = void 0;
const task_enum_1 = require("../enums/task.enum");
const mongoose_1 = __importDefault(require("mongoose"));
const changeMulti = (req, res, next) => {
    const { ids, key, value } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
            code: 400,
            message: "Danh sách id không hợp lệ",
        });
    }
    if (!Object.values(task_enum_1.TaskAction).includes(key)) {
        return res.status(400).json({
            code: 400,
            message: "Action không hợp lệ",
        });
    }
    if (key === task_enum_1.TaskAction.STATUS &&
        !Object.values(task_enum_1.TaskStatus).includes(value)) {
        return res.status(400).json({
            code: 400,
            message: "Status không hợp lệ"
        });
    }
    const invalidId = ids.some((id) => typeof id !== "string" ||
        !mongoose_1.default.Types.ObjectId.isValid(id));
    if (invalidId) {
        return res.status(400).json({
            code: 400,
            message: "ObjectId không hợp lệ"
        });
    }
    if (ids.length > 100) {
        return res.status(400).json({
            code: 400,
            message: "Chỉ được xử lý tối đa 100 task."
        });
    }
    next();
};
exports.changeMulti = changeMulti;
const create = (req, res, next) => {
    const { title, status, timeStart, timeFinish, taskParentId, listUser, deleted, deletedAt, createdBy } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({
            code: 400,
            message: "Tiêu đề là bắt buộc."
        });
    }
    if (status &&
        !Object.values(task_enum_1.TaskStatus).includes(status)) {
        return res.status(400).json({
            code: 400,
            message: "Status không hợp lệ."
        });
    }
    if (timeStart && isNaN(Date.parse(timeStart))) {
        return res.status(400).json({
            code: 400,
            message: "timeStart không đúng định dạng."
        });
    }
    if (timeFinish && isNaN(Date.parse(timeFinish))) {
        return res.status(400).json({
            code: 400,
            message: "timeFinish không đúng định dạng."
        });
    }
    if (taskParentId &&
        !mongoose_1.default.Types.ObjectId.isValid(taskParentId)) {
        return res.status(400).json({
            code: 400,
            message: "Task cha không hợp lệ."
        });
    }
    if (listUser &&
        !Array.isArray(listUser)) {
        return res.status(400).json({
            code: 400,
            message: "Danh sách user không hợp lệ."
        });
    }
    if (deleted !== undefined ||
        deletedAt !== undefined ||
        createdBy !== undefined) {
        return res.status(400).json({
            code: 400,
            message: "Không được phép gửi các trường hệ thống."
        });
    }
    next();
};
exports.create = create;
