// Not sure this route needs to exist TBH

const express = require("express");
const router = express.Router();
const validator = require("validator");
const customerModel = require("../models/customer-model");

router.get("/", async (req, res) => {
  try {
    const response = await customerModel.getCustomers();
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
    const { fName, lName, gender, dob, phoneNumber, email, password } =
      req.body;

    if (
      !fName ||
      !lName ||
      !gender ||
      !dob ||
      !phoneNumber ||
      !email ||
      !password
    ) {
      throw new Error("All fields are required");
    }

    if (!validator.isAlpha(fName)) {
      throw new Error("First name must contain only letters");
    }

    if (!validator.isAlpha(lName)) {
      throw new Error("Last name must contain only letters");
    }

    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      throw new Error("Gender must be male, female or other");
    }

    if (!validator.isISO8601(dob)) {
      throw new Error("Date of birth must be in ISO 8601 format");
    }

    const cleanPhoneNumber = phoneNumber.replace(/\s/g, "");
    if (
      !validator.isNumeric(cleanPhoneNumber) ||
      !validator.isLength(cleanPhoneNumber, { min: 10, max: 11 })
    ) {
      throw new Error("Phone number must be in a valid format");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Email must be in valid format");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Password must be strong");
    }

    const response = await customerModel.createCustomer(req.body);
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
    const response = await customerModel.getCustomerById(req.params.id);
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
    const response = await customerModel.deleteCustomer(req.params.id);
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
    const response = await customerModel.patchCustomer(req.params.id, req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;
