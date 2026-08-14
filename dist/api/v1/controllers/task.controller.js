"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = __importDefault(require("../../../helpers/search"));
const task_enum_1 = require("../enums/task.enum");
const message_1 = require("../constants/message");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false
        };
        if (req.query.status) {
            find.status = req.query.status.toString();
        }
        const objectSearch = (0, search_1.default)(req.query);
        if (req.query.keyword) {
            find.title = objectSearch.regex;
        }
        const countTasks = yield task_model_1.default.countDocuments(find);
        const objectPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 2
        }, req.query, countTasks);
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toString();
            const sortValue = req.query.sortValue.toString();
            sort[sortKey] = sortValue;
        }
        const tasks = yield task_model_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
        return res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield task_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        if (!task) {
            return res.status(404).json({
                code: 404,
                message: message_1.MESSAGE.NOT_FOUND
            });
        }
        return res.status(200).json(task);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const status = req.body.status;
        const result = yield task_model_1.default.updateOne({ _id: id, deleted: false }, { status: status });
        if (result.matchedCount === 0) {
            return res.status(404).json({
                code: 404,
                message: message_1.MESSAGE.NOT_FOUND
            });
        }
        return res.status(200).json({
            code: 200,
            message: message_1.MESSAGE.UPDATE_SUCCESS
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case task_enum_1.TaskAction.STATUS:
                const resultStatus = yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                if (resultStatus.matchedCount === 0) {
                    return res.status(404).json({
                        code: 404,
                        message: message_1.MESSAGE.NOT_FOUND
                    });
                }
                return res.status(200).json({
                    code: 200,
                    message: message_1.MESSAGE.UPDATE_SUCCESS
                });
            case task_enum_1.TaskAction.DELETE:
                const resultDelete = yield task_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
                if (resultDelete.matchedCount === 0) {
                    return res.status(404).json({
                        code: 404,
                        message: message_1.MESSAGE.NOT_FOUND
                    });
                }
                return res.status(200).json({
                    code: 200,
                    message: message_1.MESSAGE.DELETE_SUCCESS
                });
            default:
                return res.status(400).json({
                    code: 400,
                    message: message_1.MESSAGE.BAD_REQUEST
                });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, content, timeStart, timeFinish, listUser, taskParentId } = req.body;
        const task = new task_model_1.default({
            title,
            status,
            content,
            timeStart,
            timeFinish,
            listUser,
            taskParentId
        });
        const savedTask = yield task.save();
        return res.status(201).json({
            code: 201,
            message: message_1.MESSAGE.CREATE_SUCCESS,
            data: savedTask
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield task_model_1.default.updateOne({ _id: id }, req.body);
        return res.status(200).json({
            code: 200,
            message: message_1.MESSAGE.UPDATE_SUCCESS
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        yield task_model_1.default.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
        return res.status(200).json({
            code: 200,
            message: message_1.MESSAGE.DELETE_SUCCESS
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: message_1.MESSAGE.INTERNAL_SERVER_ERROR
        });
    }
});
exports.deleteTask = deleteTask;
