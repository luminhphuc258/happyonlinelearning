import bcrypt from 'bcryptjs';
import UsersSchema from '../models/user.js';
import UserRole from '../models/userrole.js';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { randomInt } from 'crypto';

dotenv.config();

export const addUser = async (req, res) => {
  console.log("Calling add user!");
  console.log(req.body);
  const otp = randomInt(100000, 999999).toString();
  console.log("OTP:" + otp);

  const { givenname, lastname, email, username, password, phone, address, pictureurl } = req.body;

  // Validate required fields
  if (!givenname || !lastname || !username || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "First name, last name, username, email, and password are required."
    });
  }

  try {
    const existingUser = await UsersSchema.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersSchema.create({
      first_name: givenname,
      last_name: lastname,
      email,
      username,
      password_hash: hashedPassword,
      created_at: new Date(),
      is_active: 0,
      address: address || null,
      phone: phone || null,
      avatar: pictureurl || '/images/logo1.png'
    });

    console.log("User creation successful:");
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'No-Reply: OTP test - Welcome to Our Service!',
      text: 'Please use this number for your OTP: ' + otp
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.status(200).json({
      status: "success",
      message: "User created successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        avatar: newUser.avatar,
        verificationotp: otp
      }
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};


export const fetchAllUsers = async () => {
  try {
    console.log("============ Calling to get users data ================");
    // Fetch all users with their associated roles
    const allUsers = await UsersSchema.findAll({
      include: [{
        model: UserRole,
        as: 'UserRole',
        attributes: ['user_role_id', 'role_name']
      }]
    });
    console.log("=====check all users data ===")
    console.log(JSON.stringify(allUsers, null, 2));

    // Map over the fetched data to format it into a simpler object array
    return allUsers.map(user => ({
      userId: user.user_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isActive: user.is_active,
      address: user.address,
      phone: user.phone,
      avatar: user.avatar,
      role: user.UserRole ? user.UserRole.role_name : 'No role'
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
// ------------ delete user info ---------------------------
export const deleteUser = async (req, res) => {
  console.log("Calling to delte this user");
  const { myuserid } = req.body;
  console.log(myuserid);

  try {
    console.log("Calling to delete this user", myuserid);

    // First, delete the user from the userroles table
    await UserRole.destroy({
      where: {
        user_id: myuserid
      }
    });

    console.log(`User role for user_id ${myuserid} deleted.`);

    // Then, delete the user from the users table
    const result = await UsersSchema.destroy({
      where: {
        user_id: myuserid
      }
    });

    if (result === 0) {
      // If no user was deleted, the userId was not found
      return res.status(404).json({
        status: "error",
        message: "User not found."
      });
    }

    // If successful, send a response back
    res.status(200).json({
      status: "success",
      message: "Update successfully"
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
}


//------------ update use info
export const CallBackendUpdateUser = async (req, res) => {
  try {
    console.log("CallBackendUpdateUser");

    const { userId, lastName, firstName, email, role, phone, address } = req.body;
    console.log(req.body);
    // Update the users table
    const updatedUser = await UsersSchema.update(
      {
        last_name: lastName,
        first_name: firstName,
        email: email,
        phone: phone,
        address: address,
        updated_at: new Date()
      },
      {
        where: {
          user_id: userId
        }
      });

    if (updatedUser[0] === 0) {
      res.status(500).json({
        status: "error",
        message: "User not found."
      });
    }

    // Update the userroles table (assuming only one role per user)
    const updatedRole = await UserRole.update(
      {
        role_name: role,
        assigned_at: new Date()
      },
      {
        where: {
          user_id: userId
        }
      });

    if (updatedRole[0] === 0) {
      res.status(500).json({
        status: "error",
        message: "Internal server error."
      });
    }

    //if everything is good ,let's  go ahead 
    res.status(200).json({
      status: "success",
      message: "Update successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};
//================= end 

export default addUser;
