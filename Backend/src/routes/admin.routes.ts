import { Router } from "express";
import {
  adminFetchProducts,
  toggleActiveStatus,
  fetchUser,
  fetchProducts,
} from "../controllers/admin.controller";

const router = Router();
router.route("/product").get(adminFetchProducts);
router.route("/toggleStatus/:userId").patch(toggleActiveStatus);
router.route("/filter/user").get(fetchUser);
router.route("/filter/products").get(fetchProducts);

export default router;
