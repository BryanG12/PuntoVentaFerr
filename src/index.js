import app from "./app";

const main = () => {
  app.listen(app.get("port"));
  console.log(`Server corriendo en el puerto ${app.get("port")}`);
};

main();
