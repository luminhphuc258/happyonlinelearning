import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsersSchema from '../models/user.js';
import dotenv from "dotenv";

dotenv.config();

export const checkUserRoleBeforeLogin = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the user exists in the database
    let user = await UsersSchema.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    } else {
      // Compare hashed password with input
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password." });
      }
    }

    console.log("info user from db");
    const Username = user.dataValues.username;
    const usrRole = user.dataValues.role;
    const UserId = user.dataValues.id;
    // Generate JWT token
    const token = jwt.sign(
      { id: UserId, username: Username, role: usrRole }, process.env.JWT_SECRET || '****', { expiresIn: '1h' }
    );

    console.log("====TOKEN RETURN======")
    console.log(token);
    console.log("=====================");
    req.session.username = Username;
    req.session.role = usrRole;
    req.session.token = token;
    req.session.isLoggined = true;
    console.log("User authenticated:");
    next();

  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
