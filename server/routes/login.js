const express = require("express");
const router = express.Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const customerModel = require("../models/customer-model");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`login.js: email = ${email}, password = ${password}`);

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Email must be in valid format");
    }

    const foundUser = await customerModel.getCustomerByEmail(email);
    if (!foundUser) {
      throw new Error("User not found");
    }

    console.log(`login.js: foundUser.password=${foundUser.password}`);

    const isCorrectPassword = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isCorrectPassword) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign(
      {
        id: foundUser.id,
        firstName: foundUser.f_name,
        lastName: foundUser.l_name,
        email: foundUser.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.cookie("token", token, { httpOnly: true, domain: "localhost" });
    res.status(200).json({ status: "ok", message: "logged in successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;
