import { Router } from "express";
import { methods as productController } from "../controllers/product.controller";
import { uploadFile } from "../middlewares/storage";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", uploadFile.single("file"), productController.addProduct);
router.put("/:id", uploadFile.single("file"), productController.updateProduct);

export default router;
