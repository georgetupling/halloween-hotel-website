const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../client/build")));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

const roomRoutes = require("./routes/room");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");

app.use("/room", roomRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../client/build/index.html"));
});

const PORT = process.env.EXPRESS_PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
