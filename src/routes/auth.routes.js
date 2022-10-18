import { Router } from "express";
import { check } from "express-validator";
import { methods as userController } from "../controllers/auth.controller";
import validarCampos from "../middlewares/validarCampos";

const router = Router();

router.get("/", userController.getUsers);

router.post(
  "/new",
  [
    check("User", "El Nombre del Usuario es Obligatorio").not().isEmpty(),
    check("Name", "el Nombre es Obligatorio").not().isEmpty(),
    check("Rol", "el Rol es Obligatorio").not().isEmpty(),
    check("LastName", "el Apellido es Obligatorio").not().isEmpty(),
    check("Password", "El password es obligatorio y mas de 6 letras").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  userController.createUser
);

router.post(
  "/",
  [
    check("User", "Ingrese un Usuario").not().isEmpty(),
    check("Password", "Ingrese un Contraseña valida").isLength({ min: 6 }),
    validarCampos,
  ],
  userController.loginUser
);

export default router;
