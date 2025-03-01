import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsersSchema from '../models/user.js';
import UserRole from '../models/userrole.js';
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
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password." });
      }

      // ============= finding user role of the current user
      const user_id = user.user_id;
      console.log("===> Check point, searching in user role -> user ID:" + user_id);
      const roleobject = await UserRole.findOne({
        where: {
          user_id: user_id
        }
      });
      if (roleobject) {
        console.log("===> Check point, user Role:" + roleobject.role_name);
        // assigned role and other user info for session management
        //============== end finding
        console.log("info user from db");
        const userid = user.dataValues.user_id;
        const Username = user.dataValues.username;
        const usrRole = roleobject.role_name;
        const UserId = user.dataValues.id;
        const fullname = user.dataValues.last_name + " " + user.dataValues.first_name;
        const picture = user.dataValues.avatar;
        const email = user.dataValues.email;
        console.log("user id:" + userid);
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
        req.session.picture = picture;
        req.session.email = email;
        req.session.fullname = fullname;
        req.session.isLoggined = true;
        console.log("User authenticated:");
        next();

      } else {
        res.status(404).json({
          status: "error",
          message: "User role not found"
        });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
