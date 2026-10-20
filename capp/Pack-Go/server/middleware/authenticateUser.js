// const jwt = require("jsonwebtoken");

// const authenticateUser = (req, res, next) => {
//   const token = req.cookies.token; // Get token from cookies

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token found" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info to request
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };


// module.exports = authenticateUser;

const authenticateUser = (req, res, next) => {
  let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};