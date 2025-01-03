import { Request, Response } from "express";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util";
import { Product } from "../models/product.model";

export async function AddProduct(req: Request, res: Response): Promise<any> {
  try {
    const { productName, description } = req.body;

    // Validate required fields
    if (!productName || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    if (description.length < 10 || description.length > 200) {
      return res
        .status(400)
        .json({ message: "Description must be between 10 and 200 characters" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const imageUrl = await uploadOnCloudinary(req.file.path);

    const createdProduct = new Product({
      productName,
      description,
      image: imageUrl.url,
      ProductOwner: req?.user?._id.toString(),
    });
    const savedProduct = await createdProduct.save();

    res.status(200).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "something went wrong" });
  }
}

export async function EditProduct(req: Request, res: Response): Promise<any> {
  const { productId } = req.params;
  const { productName, description } = req.body;

  try {
    // Validate productId
    if (!productId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (existingProduct.ProductOwner.toString() !== req.user?._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
    }

    // Initialize update object with existing values
    const updateData = {
      productName: existingProduct.productName,
      description: existingProduct.description,
      image: existingProduct.image,
    };

    // Update only provided fields
    if (productName) {
      updateData.productName = productName;
    }

    if (description) {
      // Validate description only if it's provided
      if (description.length < 10 || description.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Description must be between 10 and 200 characters",
        });
      }
      updateData.description = description;
    }

    // Handle image update only if new image is provided
    if (req.file) {
      try {
        const imageUploadResult = await uploadOnCloudinary(req.file.path);
        if (!imageUploadResult?.url) {
          throw new Error("Failed to upload image");
        }

        // Only delete old image after successful upload of new one
        await deleteFromCloudinary(existingProduct.image);
        updateData.image = imageUploadResult.url;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Failed to process image",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Update product with new or existing values
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
export async function SoftDeleteProduct(
  req: Request,
  res: Response
): Promise<any> {
  const { productId } = req.params;

  try {
    if (!productId || typeof productId !== "string" || !productId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (existingProduct.ProductOwner.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized",
      });
    }
    const softDeleteData = await Product.findByIdAndUpdate(
      productId,
      {
        idDeleted: true,
      },
      {
        new: true,
      }
    );
    console.log(softDeleteData);
    softDeleteData!.save();
    return res.status(200).json({
      success: true,
      softDeleteData,
      message: "Request for deleting product added suceefully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "something went wrong" });
  }
}

export async function FetchFilteredProduct(
  req: Request,
  res: Response
): Promise<any> {
  const { search, startDate, endDate } = req.query;
  console.log(search, startDate, endDate);

  const filter: any = { idDeleted: false };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }
  try {
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
}
