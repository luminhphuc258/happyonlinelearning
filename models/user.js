import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import UserRole from '../models/userrole.js';

const UserSchema = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: false
});

// Set associations
// In your User model file
UserSchema.hasOne(UserRole, { foreignKey: 'user_id', as: 'UserRole' });
UserRole.belongsTo(UserSchema, { foreignKey: 'user_id', as: 'UserRole' });

// Sync the model with the database
UserSchema.sync()
  .then(() => {
    console.log("Users table created or updated.");
  })
  .catch((error) => {
    console.error("Error creating Users table:", error);
  });

export default UserSchema;
