import express from "express";
import morgan from "morgan";

//Routes

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";

const app = express();

// configuracion
app.set("port", 3000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

export default app;
