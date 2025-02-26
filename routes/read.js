import express from 'express';
import { fetchQuestions, fetchAllQuestions } from "../handlers/quiz.js";
import { quizAttempts } from "../handlers/userscore.js";
import CheackHeaderTokenMiddleware from "../middlewares/checkHeaderToken.js";
const router = express.Router();

// get all questions
router.get('/getallquestions', async (req, res) => {
  if (req.session.isLoggined) {
    const listquestions = await fetchAllQuestions();
    console.log("===========here data return=========");
    // console.log(listquestions);
    res.render('questions', { allquestionsdata: listquestions, username: req.session.username, isLoggined: true, userRole: req.session.role });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '' });
  }
});

// get quiz page 
router.get('/quiz', (req, res) => {
  if (req.session.isLoggined) {
    res.render('quiz', { username: req.session.username, isLoggined: true, userRole: req.session.role });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '' });
  }
});

// get quiz data  
router.post("/fecthquizdata", CheackHeaderTokenMiddleware, fetchQuestions);

// get user attemp
router.get('/quizAttempts', (req, res) => {
  if (req.session.isLoggined) {
    quizAttempts(req, res);
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '' });
  }
});
export default router;
