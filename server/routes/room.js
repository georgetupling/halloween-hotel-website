const express = require("express");
const router = express.Router();
const roomModel = require("../models/room-model");

router.get("/", async (req, res) => {
  try {
    const response = await roomModel.getRooms();
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await roomModel.createRoom(req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await roomModel.getRoomById(req.params.id);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await roomModel.deleteRoom(req.params.id);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const response = await roomModel.patchRoom(req.params.id, req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;
