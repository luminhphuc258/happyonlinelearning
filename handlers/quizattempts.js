import QuizAttempt from '../models/quizattempts.js';
import Student from '../models/students.js';

export const handler_addSubmitQuiz = async (req, res) => {
  try {
    console.log("Check point===> Calling handler_addSubmitQuiz!");
    console.log(req.body);

    // Get student ID from session
    const user_id = req.session.currentuserid;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No student ID found in session." });
    }

    // Find the student in the User table (assuming a Mongoose schema)
    const std = await Student.findOne({
      where: {
        user_id
      }
    });
    if (!std) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Extract quiz data from request body
    const { quiz_id, start_time, submit_time, score } = req.body;

    // Insert into QuizAttempt schema
    await QuizAttempt.create({
      quiz_id: quiz_id,
      student_id: std.student_id,
      start_time: start_time,
      submit_time: submit_time,
      score: score,
      is_graded: 1
    });

    return res.status(201).json({ status: "success", message: "Quiz attempt recorded successfully!" });

  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
