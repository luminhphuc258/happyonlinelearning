import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Quiz = sequelize.define('quizzes', {
  quiz_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_points: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  is_published: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Quiz.sync()
  .then(() => {
    console.log("Quizzes table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Quizzes table:", error);
  });

export default Quiz;
