"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const register = (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }
    next();
};
exports.register = register;
