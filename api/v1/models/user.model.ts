import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true, // tạo các field createdAt, updatedAt khi tạo mới sản phẩm
  },
);

const User = mongoose.model('User', userSchema, 'users'); // tên Model/schema/collection

export default User;
