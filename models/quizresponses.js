import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const QuizResponse = sequelize.define('quizresponses', {
  response_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  attempt_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_answer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  earned_points: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
QuizResponse.sync()
  .then(() => {
    console.log("QuizResponses table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating QuizResponses table:", error);
  });

export default QuizResponse;
