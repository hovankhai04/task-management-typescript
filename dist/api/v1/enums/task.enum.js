"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.TaskAction = void 0;
var TaskAction;
(function (TaskAction) {
    TaskAction["STATUS"] = "status";
    TaskAction["DELETE"] = "delete";
})(TaskAction || (exports.TaskAction = TaskAction = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["DOING"] = "doing";
    TaskStatus["FINISH"] = "finish";
    TaskStatus["INITIAL"] = "initial";
    TaskStatus["PENDING"] = "pending";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
