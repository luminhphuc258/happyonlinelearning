import Enrollment from '../models/enrollments.js';
import Student from '../models/students.js';
import Program from '../models/programs.js';
import UserSchema from '../models/user.js';
import Course from '../models/course.js';
import dotenv from "dotenv";

dotenv.config();

export const handleRequestToEnroll = async (req, res) => {
  console.log("Calling to enroll a program!");
  console.log(req.body);

  const { program_id, semester } = req.body;
  const currentuserID = req.session.currentuserid;
  console.log("curentuserID:" + req.session.currentuserid);

  // Validate required fields
  if (!program_id || !currentuserID) {
    return res.status(400).json({
      status: "error",
      message: "Program id or currentuserID are required."
    });
  }

  try {
    // Check if the program exists
    const existingProgram = await Program.findOne({
      where: {
        program_id
      }
    });

    if (existingProgram) {
      // Get user information (assuming user model exists and has the user ID)
      const user = await UserSchema.findOne({
        where: { user_id: currentuserID }
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found."
        });
      }

      // Create a unique enrollment number
      const currentYear = new Date().getFullYear();
      const currentTime = new Date().toISOString().slice(11, 19).replace(/:/g, '');

      // Create a unique enrollment number: program_id-user_id-year-time
      const enrollment_number = `${program_id.trim()}${currentuserID}${currentYear}${currentTime}`;

      // Add the new student to the 'students' table
      const newStudent = await Student.create({
        user_id: currentuserID,
        enrollment_number,
        program: existingProgram.program_name,
        semester,
        completed_credits: 0, // Adjust based on your logic
        total_credits: existingProgram.total_credits
      });

      let sanitize_program_id = program_id.trim();
      // Fetch the list of courses related to the program
      const courses = await Course.findAll({
        where: { program_id: sanitize_program_id }
      });
      console.log("Check point courses:", courses);

      // Loop through the list of courses and it will be automatic enrollment all courses of the program the student chose into enrollment table
      for (const course of courses) {
        await Enrollment.create({
          student_id: newStudent.student_id,
          course_id: course.course_id,
          enrollment_date: new Date(),
          status: 'Enrolled',
          final_grade: null,
          is_completed: false
        });
      }

      // Return success response
      res.status(200).json({
        status: "success",
        message: "Enroll created successfully"
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Program not found."
      });
    }
  } catch (error) {
    console.error("Error enrolling in program:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};

export default handleRequestToEnroll;
