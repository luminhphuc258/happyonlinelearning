import Submission from '../models/submissions.js';
import QuizAttempt from '../models/quizattempts.js';
import Student from '../models/students.js';

// Controller to Fetch Student Progress Data
export const create_StudentTrackingGraph = async (req, res) => {
  try {
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

    const studentID = std.student_id;

    if (!studentID) {
      return res.status(401).json({ success: false, message: "Unauthorized: No student ID found." });
    }

    // Count total assignments submitted
    const totalAssignments = await Submission.count({ where: { student_id: studentID } });

    // Count total quizzes attempted using Sequelize
    const totalQuizzes = await QuizAttempt.count({ where: { student_id: studentID } });

    // Calculate average quiz score
    const quizAttempts = await QuizAttempt.findAll({ where: { student_id: studentID } });

    const totalScore = quizAttempts.reduce((acc, attempt) => acc + attempt.score, 0);
    const averageScore = quizAttempts.length > 0 ? (totalScore / quizAttempts.length).toFixed(2) : 0;

    res.json({
      success: true,
      totalAssignments,
      totalQuizzes,
      averageScore
    });

  } catch (error) {
    console.error("Error fetching student tracking data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
