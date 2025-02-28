import express from 'express';
import { fetchQuestions, fetchAllQuestions } from "../handlers/quiz.js";
import { quizAttempts } from "../handlers/userscore.js";
import CheackHeaderTokenMiddleware from "../middlewares/checkHeaderToken.js";

const router = express.Router();

router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.emailtoken = tokens;
  // Store these tokens securely for sending emails later
});




// get all questions
router.get('/getallquestions', async (req, res) => {
  if (req.session.isLoggined) {
    const listquestions = await fetchAllQuestions();
    console.log("===========here data return=========");
    // console.log(listquestions);
    res.render('index', { username: req.session.username, isLoggined: true, userRole: req.session.role, fullName: req.session.fullname, email: req.session.email, useravatar: req.session.picture });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '', fullName: '', email: '', useravatar: '' });
  }
});

// get quiz page 
router.get('/quiz', (req, res) => {
  if (req.session.isLoggined) {
    res.render('quiz', { username: req.session.username, isLoggined: true, userRole: req.session.role });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '', fullName: '', email: '', useravatar: '' });
  }
});

// get quiz data  
router.post("/fecthquizdata", CheackHeaderTokenMiddleware, fetchQuestions);

// get user attemp
router.get('/quizAttempts', (req, res) => {
  if (req.session.isLoggined) {
    quizAttempts(req, res);
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '', fullName: '', email: '', useravatar: '' });
  }
});
export default router;
