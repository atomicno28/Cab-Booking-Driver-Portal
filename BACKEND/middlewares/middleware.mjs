import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Get auth-token from the headers
  const token = req.headers["auth-token"];

  // If token does not exist, return an error
  if (!token) return res.status(401).send("Access Denied");

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    res.status(403).send("Invalid Token");
  }
};
