import express from "express"
import userRouter from './routes/user.js';
import createRouter from './routes/create.js';
import readRouter from './routes/read.js';
import updateRouter from './routes/update.js';
import deleteRouter from './routes/delete.js';
import session from 'express-session';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
// import handle bar
import { engine } from "express-handlebars";
import dotenv from "dotenv";


// Define __filename and __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const server = express();
const logRequestsMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString(); // Fixed here
  console.log("--- Log Records --------");
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};
server.use(logRequestsMiddleware);
server.use(cors());
server.use(session({
  secret: 'happyquiz',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
server.set('views', './views');
server.use(express.json());
server.use(userRouter);

// use different routers to handle CRUD
server.use(createRouter);
server.use(readRouter);
server.use(updateRouter);
server.use(deleteRouter);

//set up handlerbar
server.engine("hbs", engine({
  extname: ".hbs",
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials'
}));

server.set('view engine', 'hbs');
server.set('views', './views');

// to serve static css files in the public directory.
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("server is running on port 3000");
});