import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
const UserRole = sequelize.define('userroles', {
  user_role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

// This creates the table if it doesn't already exist
UserRole.sync()
  .then(() => {
    console.log("UserRoles table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating UserRoles table:", error);
  });

export default UserRole;
