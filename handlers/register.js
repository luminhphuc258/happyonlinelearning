import bcrypt from 'bcryptjs';
import UsersSchema from '../models/user.js';
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

export default addUser;
