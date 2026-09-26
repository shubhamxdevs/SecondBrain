// 1. Sabse upar Node DNS ko import karke bypass servers set karein
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// 2. Ab aapke baaki ke imports
import "dotenv/config";
import express from "express";
import cors from "cors";
import { userMiddleware } from "./middleware.js";
import { connectDB } from "./db.js";
import userSignupRouter from "./routes/signup.js";
import userSigninRouter from "./routes/signin.js";
import postContentRouter from "./routes/postContent.js";
import getContentRouter from "./routes/getContent.js";
import deleteContentRouter from "./routes/deleteContent.js";
import shareContentRouter from "./routes/shareContent.js";
import contentLinkRouter from "./routes/contentLink.js";

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ cors first, before everything
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173" ,
    credentials: true
}));

app.use(express.json());

connectDB();

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/v1", userSignupRouter);
app.use("/api/v1", userSigninRouter);
app.use("/api/v1/content", userMiddleware, postContentRouter);
app.use("/api/v1/content", userMiddleware, getContentRouter);
app.use("/api/v1/delete", userMiddleware, deleteContentRouter);
app.use("/api/v1/brain/share", userMiddleware, shareContentRouter);
app.use("/api/v1/brain", contentLinkRouter);

app.listen(PORT, () => {
    console.log(`Server Started locally on the port: ${PORT}`);
});
