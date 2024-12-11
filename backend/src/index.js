import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { ConnectDb } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";
import path, { dirname } from "path";

dotenv.config();
const Port = process.env.PORT;

const path = path.resolve();

app.use(
  cors({
    origin: `${process.env.REACT_APP_URL}`,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname , "../frontend", "dist" , "index.html"))
  });
}

server.listen(Port, () => {
  console.log(`Server is running on Port ${Port}`);
  ConnectDb();
});
