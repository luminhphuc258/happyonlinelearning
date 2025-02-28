import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Rating = sequelize.define('ratings', {
  rating_id: {
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
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Rating.sync()
  .then(() => {
    console.log("Ratings table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Ratings table:", error);
  });

export default Rating;
