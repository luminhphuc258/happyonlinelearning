import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Program = sequelize.define('programs', {
  program_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  program_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  total_credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
Program.sync()
  .then(() => {
    console.log("Programs table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Programs table:", error);
  });

export default Program;
