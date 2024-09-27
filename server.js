const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authMiddleware = require("./middlewares/auth");
const storyRoutes = require("./routes/story");
const fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const authRoutes = require("./routes/auth");

app.use("/api/story", authMiddleware, storyRoutes);

dotenv.config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_URL;
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use((req, res, next) => {
  const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date()}/n`;
  fs.appendFile("log.txt", log, (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use((err, req, res, next) => {
  let log;
  log = err.stack;
  log += `/n${req.method} - ${req.url} - ${req.ip} - ${new Date()}/n`;
  fs.appendFile("error.txt", log, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(500).send("Something went wrong");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(MONGO_URL)
    .then(() => "MongoDB connected")
    .catch((err) => console.log(err));
});
