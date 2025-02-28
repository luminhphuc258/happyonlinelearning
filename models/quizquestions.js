import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const QuizQuestion = sequelize.define('quizquestions', {
  question_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  question_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  points: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  options: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  correct_answer: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
QuizQuestion.sync()
  .then(() => {
    console.log("QuizQuestions table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating QuizQuestions table:", error);
  });

export default QuizQuestion;
