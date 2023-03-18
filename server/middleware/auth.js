const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token is required for authorization");
    }
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}

module.exports = { verifyToken };
