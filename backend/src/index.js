import express from "express";
// import dotenv from "dotenv"; // You can keep this import if you wish, or remove if unused elsewhere
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { fileURLToPath } from 'url'; // Required for __dirname equivalent in ES Modules

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// REMOVE THIS LINE: dotenv.config();
// Or comment it out like this:
// dotenv.config();

// Get __dirname equivalent for ES Modules
const __filename = fileURLToPath(
    import.meta.url); // Add this for __dirname in ES Modules
const __dirname = path.dirname(__filename); // Add this for __dirname in ES Modules


const PORT = process.env.PORT || 5000; // This will now correctly read from .env because of the -r flag

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});