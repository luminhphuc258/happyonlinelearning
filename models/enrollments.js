import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Enrollment = sequelize.define('enrollments', {
  enrollment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  final_grade: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Enrollment.sync()
  .then(() => {
    console.log("Enrollments table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Enrollments table:", error);
  });

export default Enrollment;
