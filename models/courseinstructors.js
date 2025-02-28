import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const CourseInstructor = sequelize.define('courseinstructors', {
  course_instructor_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  academic_year: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  semester: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
CourseInstructor.sync()
  .then(() => {
    console.log("CourseInstructors table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating CourseInstructors table:", error);
  });

export default CourseInstructor;
