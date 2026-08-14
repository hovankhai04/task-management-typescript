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
exports.detail = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../../../helpers/generate");
const message_1 = require("../constants/message");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existEmail = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existEmail) {
            return res.status(400).json({
                code: 400,
                message: "Email đã tồn tại!"
            });
        }
        req.body.password = (0, md5_1.default)(req.body.password);
        req.body.token = (0, generate_1.generateRandomString)(20);
        const user = new user_model_1.default(req.body);
        const data = yield user.save();
        const token = data.token;
        return res.status(201).json({
            code: 201,
            message: message_1.MESSAGE.CREATE_SUCCESS,
            token: token
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!user) {
            return res.status(400).json({
                code: 400,
                message: "Không tìm thấy tài khoản!"
            });
        }
        if ((0, md5_1.default)(password) !== user.password) {
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
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            code: 200,
            message: "Xem trang chi tiết tài khoản thành công!",
            user: req["user"]
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
exports.detail = detail;
