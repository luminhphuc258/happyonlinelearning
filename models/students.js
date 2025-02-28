import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Student = sequelize.define('students', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollment_number: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  program: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completed_credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Student.sync()
  .then(() => {
    console.log("Students table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Students table:", error);
  });

export default Student;
