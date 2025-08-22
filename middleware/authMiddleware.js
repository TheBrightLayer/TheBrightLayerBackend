// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // role check (only if specific roles are required)
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Forbidden: insufficient rights" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token invalid" });
    }
  };
};



module.exports = authMiddleware;
