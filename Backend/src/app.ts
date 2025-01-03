import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./database";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(
  cors({
    origin: process.env.FRONTEND_ACCESS!,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Database Connection
connectToDatabase();

// ENV config
dotenv.config();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js!");
});

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// import ROUTES
import userRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import adminRoute from "./routes/admin.routes";

// User Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/admin", adminRoute);
