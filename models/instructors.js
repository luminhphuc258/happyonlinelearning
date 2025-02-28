import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Instructor = sequelize.define('instructors', {
  instructor_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Instructor.sync()
  .then(() => {
    console.log("Instructors table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Instructors table:", error);
  });

export default Instructor;
