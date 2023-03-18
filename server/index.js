const express = require("express");
const dotenv = require("dotenv").config();
const roomModel = require("./models/room-model");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const roomRoutes = require("./routes/room");
const customerRoutes = require("./routes/customer");
app.use("/room", roomRoutes);
app.use("/customer", customerRoutes);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
