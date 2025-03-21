// middlewares/authMiddleware.js
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded info to request object
    req.user = { userId: decoded.userId, userName: decoded.userName }; // Store userName
    next();
  } catch (err) {
    const errorMessage =
      err.name === "TokenExpiredError"
        ? "Unauthorized: Token expired"
        : "Unauthorized: Invalid token";
    return res.status(401).json({ message: errorMessage });
  }
};

module.exports = { authMiddleware };
