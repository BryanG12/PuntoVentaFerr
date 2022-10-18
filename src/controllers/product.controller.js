import { request, response } from "express";
import { pool } from "../database/database";
import { deleteImage } from "../middlewares/storage";
import fs from "fs";
import path from "path";

const getProducts = async (req = request, res = response) => {
  try {
    const [product] = await pool.query("SELECT * FROM tblProductos");
    res.status(200).json({
      ok: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener productos",
    });
  }
};
const getProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const [product] = await pool.query(
      "SELECT * FROM tblProductos WHERE IdProducto=?",
      id
    );

    res.status(200).json({
      ok: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener productos",
    });
  }
};

const addProduct = async (req = request, res = response) => {
  try {
    const {
      Producto,
      PrecioProducto,
      DescripcionProducto,
      CantidadProducto,
      PrecioCompraProducto,
    } = req.body;

    const NombreProducto = removeSpaces(Producto);

    const Codigo = generarCodigo(NombreProducto);

    const Diferencia = (PrecioProducto - PrecioCompraProducto).toFixed(2); //* Diferencia "Ganancia del producto" .toFixed(2)

    // *? Iniciando Variables de imagenes
    let FileName = "";
    let Data = "";
    let TypeImage = "";

    if (req.file) {
      FileName = req.file.filename;
      Data = fs.readFileSync(path.join(__dirname, "../uploads/" + FileName));
      TypeImage = req.file.originalname.split(".").pop();
    }

    if (Diferencia < 0 || CantidadProducto < 0) {
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return res.status(400).json({
        ok: false,
        msg: "Esta ingresando datos con valor negativo, verifique!",
      });
    }

    const [verificarProducto] = await pool.query(
      "SELECT COUNT(*) as Product FROM tblProductos WHERE tblProductos.NombreProducto = ?",
      NombreProducto
    );

    const existeProductoSimilar = verificarProducto[0].Product;

    if (!!existeProductoSimilar) {
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return res.status(400).json({
        ok: false,
        msg: `El producto ${NombreProducto} ya se existe en stock`,
      });
    }

    const product = {
      Codigo,
      NombreProducto,
      PrecioProducto,
      DescripcionProducto,
      CantidadProducto,
      PrecioCompraProducto,
      Diferencia,
      TypeImage,
      Data,
    };

    const [insertProduct] = await pool.query(
      "INSERT INTO tblProductos SET ?",
      product
    );

    res.json({
      insertProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: `Error al ingresar producto, verifique los datos porfavor`,
    });
  }
};

const updateProduct = async (req = request, res = response) => {
  try {
    const { id: IdProducto } = req.params;
    const {
      Producto,
      PrecioProducto,
      DescripcionProducto,
      CantidadProducto,
      PrecioCompraProducto,
    } = req.body;

    const [existeProduct] = await pool.query(
      "SELECT COUNT(*) AS existencia, TypeImage, Data, FileName FROM tblProductos where IdProducto = ?",
      IdProducto
    );

    if (!!!existeProduct[0].existencia) {
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return res.status(400).json({
        ok: false,
        msg: "El producto no existe",
      });
    }

    const NombreProducto = removeSpaces(Producto);

    const Codigo = generarCodigo(NombreProducto);

    const Diferencia = (PrecioProducto - PrecioCompraProducto).toFixed(2); //* Diferencia "Ganancia del producto" .toFixed(2)

    if (Diferencia < 0 || CantidadProducto < 0) {
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return res.status(400).json({
        ok: false,
        msg: "Esta ingresando datos con valor negativo, verifique!",
      });
    }

    // *? Iniciando Variables de imagenes
    let Data = "";
    let TypeImage = "";
    let FileName = "";

    //*! si ya tenia imagen almacenada y no cambia
    if (!!existeProduct[0].TypeImage) {
      if (!req.file) {
        Data = existeProduct[0].Data;
        TypeImage = existeProduct[0].TypeImage;
        FileName = existeProduct[0].FileName;
      }
    }

    //TODO: Si existe imagen, obtener datos binarios Y actualizar
    if (req.file) {
      FileName = req.file.filename;
      Data = fs.readFileSync(path.join(__dirname, "../uploads/" + FileName));
      TypeImage = req.file.originalname.split(".").pop();
    }

    const product = {
      Codigo,
      NombreProducto,
      PrecioProducto,
      DescripcionProducto,
      CantidadProducto,
      PrecioCompraProducto,
      Diferencia,
      FileName,
      TypeImage,
      Data,
    };

    const [updateProduct] = await pool.query(
      "UPDATE tblProductos SET ? WHERE IdProducto = ?",
      [product, IdProducto]
    );

    res.json({
      updateProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: `Error al actualizar producto, verifique los datos por favor`,
    });
  }
};

const generarCodigo = (NombreProducto) => {
  let Codigo = "";
  const texto = NombreProducto.split(" ");

  texto.forEach((element) => {
    if (element[0] !== undefined) {
      Codigo += element[0];
    }
  });

  return Codigo;
};

const removeSpaces = (product) => {
  let trimProducto = product.trim();
  const producto = trimProducto.split(" ");
  let NombreProducto = "";

  producto.forEach((element) => {
    if (element[0] !== undefined) {
      NombreProducto += `${element} `;
    }
  });
  NombreProducto = NombreProducto.trim();
  NombreProducto = NombreProducto.toUpperCase();
  return NombreProducto;
};

export const methods = {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
};
