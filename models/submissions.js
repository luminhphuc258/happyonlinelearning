import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Assignment from '../models/assignments.js';
import Student from '../models/students.js';

const Submission = sequelize.define('submissions', {
  submission_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  submission_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING(255),
    allowNull: true // Assuming file path can be null if submission is purely textual
  },
  submission_text: {
    type: DataTypes.TEXT,
    allowNull: true // Assuming text can be null if submission is file-based
  },
  earned_points: {
    type: DataTypes.FLOAT,
    allowNull: true // Assuming points can be null if not graded yet
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true // Feedback may be optional
  },
  is_late: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_graded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: false // Set to true if you want Sequelize to automatically manage createdAt and updatedAt
});

// Define the association with Student
Submission.belongsTo(Student, {
  foreignKey: 'student_id', as: 'student'
});

// Define the association with Assignment
Submission.belongsTo(Assignment, {
  foreignKey: 'assignment_id', as: 'assignment'
});


// This creates the table if it doesn't already exist
Submission.sync()
  .then(() => {
    console.log("Submissions table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Submissions table:", error);
  });

export default Submission;
