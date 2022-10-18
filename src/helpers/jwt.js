import jwt from "jsonwebtoken";

const generateJWT = (uid, user) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, user };

    jwt.sign(
      payload,
      process.env.JWT_SECRETORPRIVATE,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(erro);
          reject("Error al generar el token");
        }
        resolve(token);
      }
    );
  });
};

export default generateJWT;
