import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Assignment = sequelize.define('assignments', {
  assignment_id: {
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
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total_points: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  submission_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Assignment.sync()
  .then(() => {
    console.log("Assignments table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Assignments table:", error);
  });

export default Assignment;
