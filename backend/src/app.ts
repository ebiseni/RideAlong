import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import vehicleRoutes from "./modules/vehicles/reg.routes";
import vehicleDocRoutes from "./modules/vehicles/doc.routes";

import { env } from "./lib/env";

// Route imports
// import authRoutes from "./modules/auth";
import routes from "./routes";

// Middleware imports
import { errorHandler } from "./middleware/errorHandler";

const app = express();

/**
 * Security headers
 */
app.use(helmet());

/**
 * CORS
 * Required because refresh tokens will be stored
 * in httpOnly cookies.
 */
// app.use(
//   cors({
//     origin: env.CLIENT_URL,
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "https://ridealong3-victoria-vees-projects.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
/**
 * Body parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "RideAlong API is running",
  });
});

/**
 * API routes
 */
// app.use("/api/auth", authRoutes);
app.use("/api", routes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/documents", vehicleDocRoutes);
/**
 * 404 Handler
 */
app.use((_req, res) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "Route not found",
  });
});

/**
 * Global Error Handler
 * Must always be the last middleware.
 */
app.use(errorHandler);
// In your backend server file (server.ts / app.ts)
app.set('etag', false); 
export default app;