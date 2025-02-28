import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; // Ensure this path correctly points to your database connection setup file

const QuizAttempt = sequelize.define('quizattempts', {
  attempt_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  submit_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true  // Assuming the score can be null if not graded yet
  },
  is_graded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: false // Assuming you do not need automatic createdAt and updatedAt
});

// This creates the table if it doesn't already exist
QuizAttempt.sync()
  .then(() => {
    console.log("QuizAttempts table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating QuizAttempts table:", error);
  });

export default QuizAttempt;
