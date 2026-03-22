const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

// const validateRequestBody = require("./middleware/validateRequestBody");
const errorHandler = require("./middleware/globalErrorHandler");

const adminRoutes = require("./routes/adminRoutes/index");
const userRoutes = require("./routes/userRoutes/index");

const envSecrets = require("./config/index");

const app = express();

/* ---------------------------------------------------
   BASIC APP CONFIG
--------------------------------------------------- */
// app.set("trust proxy", 1);
// app.disable("x-powered-by");

/* ---------------------------------------------------
   SECURITY HEADERS (FIXED CSP)
--------------------------------------------------- */
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://cdnjs.cloudflare.com",
//           "https://code.jquery.com",
//         ],
//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://fonts.googleapis.com",
//           "https://cdnjs.cloudflare.com",
//         ],
//         fontSrc: [
//           "'self'",
//           "https://fonts.gstatic.com",
//           "https://cdnjs.cloudflare.com",
//         ],
//         imgSrc: ["'self'", "data:", "https:"],
//         connectSrc: ["'self'", "http:", "https:"],
//       },
//     },
//     frameguard: { action: "deny" },
//     referrerPolicy: { policy: "no-referrer" },
//     hsts: envSecrets.ENABLE_HSTS
//       ? {
//           maxAge: 15552000,
//           includeSubDomains: true,
//           preload: true,
//         }
//       : false,
//   })
// );

/* ---------------------------------------------------
   HTTPS REDIRECT (ONLY IF ENABLED)
--------------------------------------------------- */
// if (envSecrets.NODE_ENV === "production" && envSecrets.ENFORCE_HTTPS) {
//   app.use((req, res, next) => {
//     if (req.secure || req.headers["x-forwarded-proto"] === "https") {
//       return next();
//     }
//     res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
//   });
// }

/* ---------------------------------------------------
   CORS CONFIG
--------------------------------------------------- */
const allowedOrigins = envSecrets.CORS_ORIGIN.split(",").map((o) => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        envSecrets.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 86400,
  }),
);

/* ---------------------------------------------------
   COMMON MIDDLEWARE
--------------------------------------------------- */
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
// app.use(validateRequestBody);
// app.use(hpp());
// app.use(compression());
// app.use(morgan(envSecrets.NODE_ENV === "production" ? "combined" : "dev"));

/* ---------------------------------------------------
   API ROUTES
--------------------------------------------------- */
app.use("/api/v1", adminRoutes);
app.use("/api/v1", userRoutes);

/* ---------------------------------------------------
   ADMIN FRONTEND
--------------------------------------------------- */
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

/* ---------------------------------------------------
   MAIN FRONTEND
--------------------------------------------------- */
app.use("/", express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/* ---------------------------------------------------
   API FALLBACK
--------------------------------------------------- */
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

/* ---------------------------------------------------
   ERROR HANDLER
--------------------------------------------------- */
app.use(errorHandler);

/* ---------------------------------------------------
   SERVER START
--------------------------------------------------- */
const connectServer = function () {
  try {
    const PORT = envSecrets.PORT || process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received: shutting down");
      server.close(() => {
        mongoose
          .disconnect()
          .then(() => console.log("MongoDB disconnected"))
          .finally(() => process.exit(0));
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
};

module.exports = connectServer;
