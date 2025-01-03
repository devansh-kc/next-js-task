import { Router } from "express";
import {
  AddProduct,
  EditProduct,
  SoftDeleteProduct,
  FetchFilteredProduct,
} from "../controllers/product.controller";
import authenticate from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

const router = Router();

router.use(authenticate);

router.route("/").post(upload.single("ProductImage"), AddProduct);
router.route("/").get(FetchFilteredProduct);
router
  .route("/editProduct/:productId")
  .patch(upload.single("ProductImage"), EditProduct);
router.route("/delete/:productId").delete(SoftDeleteProduct);

export default router;
