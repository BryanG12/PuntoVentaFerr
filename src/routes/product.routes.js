import { Router } from 'express';
import { methods as productController } from '../controllers/product.controller';


const router = Router();



router.get('/',productController.getProducts);
router.get('/:id',productController.getProduct);
router.post('/',productController.addProduct);


export default router;
