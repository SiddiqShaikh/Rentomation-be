import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error connecting server", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
      io.on("connection", (socket) => {
        socket.emit("setup", "Youre connected to socket");
      });
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed", err);
  });
