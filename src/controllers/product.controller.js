import { request, response } from "express";
import { pool } from "../database/database";

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

    if (Diferencia < 0 || CantidadProducto < 0) {
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
    };

    const [insertProduct] = await pool.query(
      "INSERT INTO tblProductos SET ?",
      product
    );

    res.json({ 
      insertProduct
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: `Error al ingresar productos`,
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
};
