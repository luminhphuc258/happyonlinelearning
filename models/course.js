import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Course = sequelize.define('courses', {
  course_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_code: {
    type: DataTypes.STRING(20),
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
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  is_active: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  registration_start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  registration_end: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Course.sync()
  .then(() => {
    console.log("Courses table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Courses table:", error);
  });

export default Course;
