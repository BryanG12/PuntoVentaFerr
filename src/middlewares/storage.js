import multer from "multer";
import path from "path";
import fs from "fs/promises";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${file.originalname}.${ext}`);
  },
});

export const uploadFile = multer({ storage });

export const deleteImage = (Image) => {
  const pathImage = path.join(__dirname, "../uploads/" + Image);
  fs.unlink(pathImage)
    .then(() => {
      console.log("Imagen Eliminada");
    })
    .catch((err) => {
      console.log(`el archivo no fue eliminado: ${err}`);
    });
};
