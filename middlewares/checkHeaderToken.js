const CheackHeaderTokenMiddleware = (req, res, next) => {
  console.log("Calling to check Heder Token!");
  const token = req.header('Authorization');
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  } else {
    // Verify token
    if (token === req.session.token) {
      console.log("Client Token authenticated:");
      next();
    } else {
      return res.status(403).json({ message: "Invalid token." });
    }
  }
};

export default CheackHeaderTokenMiddleware;