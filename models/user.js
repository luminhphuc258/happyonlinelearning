import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const UsersSchema = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  lastname: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(45),
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist.
UsersSchema.sync()
  .then(() => {
    console.log("Users table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating Users table:", error);
  });

export default UsersSchema;
