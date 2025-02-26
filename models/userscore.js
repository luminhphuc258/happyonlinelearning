import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; // Adjust the path as necessary

const QuizScores = sequelize.define('quizAttempts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  quizid: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
QuizScores.sync()
  .then(() => {
    console.log("QuizScores table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating QuizScores table:", error);
  });

export default QuizScores;
