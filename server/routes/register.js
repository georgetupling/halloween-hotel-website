const express = require("express");
const router = express.Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const customerModel = require("../models/customer-model");

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

    const token = jwt.sign(
      {
        id: response.id,
        firstName: response.f_name,
        lastName: response.l_name,
        email: response.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .json({ status: "ok", message: "user registered successfully" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;
