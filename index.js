const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const connectCloudinary = require("./config/cloudinary");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const likeRouter = require("./routes/like");

const port = process.env.PORT || 3000;

// database connection
connectDB();

// cloudinary connection
connectCloudinary();

// adding middlewares
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// mounting routes
app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", commentRouter);
app.use("/api/v1", likeRouter);

// default routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
