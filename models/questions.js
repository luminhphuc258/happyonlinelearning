import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; // adjust the path as necessary

const QuestionsSchema = sequelize.define('questions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  option1: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  option2: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  option3: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  option4: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  answer: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  questiontype: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.DECIMAL(50, 0),
    allowNull: false,
    defaultValue: 0
  },
  quizid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  images: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  timestamps: false
});

// this creates the table if it doesn't already exist.
QuestionsSchema.sync()
  .then(() => {
    console.log("Questions table created if it didn't already exist.");
  })
  .catch((error) => {
    console.error("Error creating BlogPost table:", error);
  });

export default QuestionsSchema;