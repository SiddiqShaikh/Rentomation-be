import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Replace with your client URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"], // Add other headers if needed
    credentials: true, // If you are sending cookies, set this to true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import complaintRouter from "./routes/complain.routes.js";
app.get("/", async (req, res) => {
  res.send("Server running");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/property", complaintRouter);

export { app };
