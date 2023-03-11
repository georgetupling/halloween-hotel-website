const express = require("express");
const dotenv = require("dotenv").config();
const merchantModel = require("./models/merchant-model");

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/", async (req, res) => {
  console.log("GET request recieved.");
  try {
    const response = await merchantModel.getMerchants();
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const response = await merchantModel.createMerchant(req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const response = await merchantModel.deleteMerchant(id);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
