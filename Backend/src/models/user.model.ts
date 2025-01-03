import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Invalid email format.",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (phoneNumber: string) {
          return /^[0-9]{10}$/.test(phoneNumber);
        },
        message: "Phone number must be 10 digits.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
