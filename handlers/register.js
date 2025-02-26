import bcrypt from 'bcryptjs';
import UsersSchema from '../models/user.js';

export const addUser = async (req, res) => {
  console.log("Calling add user!");
  console.log(req.body);

  const { firstname, lastname, username, password, role } = req.body;

  // Validate required fields
  if (!firstname || !lastname || !username || !password) {
    return res.status(400).json({ status: "error", message: "Firstname, lastname, username, and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await UsersSchema.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ status: "error", message: "User already exists." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await UsersSchema.create({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hashedPassword,
      role: role || 1,
    });

    console.log("New user added:", newUser.username);

    res.status(201).json({
      status: "success",
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
};

export default addUser;
