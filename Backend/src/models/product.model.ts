import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  productName: string;
  description: string;
  image: string;
  ProductOwner: mongoose.Types.ObjectId;
  idDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    productName: { type: String, required: true },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 200,
    },
    image: { type: String, required: true },
    ProductOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
