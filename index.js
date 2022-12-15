import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postsRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// this prefix section must put after the app.use(cors());
// this is to set prefix for postsRoutes to /posts/xxx
app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING!");
})

// const CONNECTION_URL = "mongodb+srv://sayhuan99:123123qweqwe@cluster-mern-memories.v9vp5dk.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((err) => console.error(err.message));
