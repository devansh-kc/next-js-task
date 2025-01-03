import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";

export async function adminFetchProducts(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = await User.find({}, { password: 0 });
    res.status(200).json({ user, message: "USers fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("something went wrong");
  }
}

export async function toggleActiveStatus(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (isActive !== "true" && isActive !== "false") {
      return res.status(400).json({
        success: false,
        message:
          "The 'isActive' parameter is required and must be either 'true' or 'false' as a string.",
      });
    }
    if (!userId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find existing user
    const exisitngUser = await User.findById(userId);
    if (!exisitngUser) {
      return res.status(404).json({
        success: false,
        message: "No User Found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: isActive },
      {
        new: true,
      }
    );
    res.status(200).json({ updatedUser, message: "User status updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("something went wrong");
  }
}

export async function fetchUser(req: Request, res: Response): Promise<any> {
  const { search, startDate, endDate } = req.query;

  const filter: any = {};

  // Keyword search across user fields
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } }, // Case-insensitive
      { email: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
    ];
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }
  try {
    const users = await User.find(filter, { password: 0 });
    res.status(200).json({ users, message: "users Fetched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("something went wrong");
  }
}

export async function fetchProducts(req: Request, res: Response): Promise<any> {
  try {
    const productsWithUserDetails = await Product.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "ProductOwner",
          foreignField: "_id",
          as: "Owner_Details",
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                phoneNumber: 1,
              },
            },
          ],
        },
      },
    ]);
    res
      .status(200)
      .json({ productsWithUserDetails, message: "Details ffetched" });
  } catch (error) {
    return res.status(500).json("something went wrong");
  }
}
