import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const database = process.env.DATABASE;
const dbpass = process.env.DBPASS;
const dbuser = process.env.DBUSNAME;
const dbhost = process.env.DBHOST;
const dbport = process.env.DBPORT;
const sequelize = new Sequelize(database, dbuser, dbpass, {
  host: dbhost,
  dialect: 'mysql',
  port: dbport
});

export default sequelize;
