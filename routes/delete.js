import express from 'express';
import { deleteUser } from '../handlers/register.js'
import { deleteProgram } from "../handlers/studyprogram.js";
import { deleteCourse } from "../handlers/courses.js";
import { deleteQuestion } from "../handlers/quiz.js";
import {
  deleteQuiz
} from '../handlers/makingquizzes.js';


const router = express.Router();

//======================== STUDY PROGRAM FUNCTION ==============================
router.post("/deletestudyprogram", deleteProgram);

//======================== STUDY  COURSE FUNCTION ==============================
router.post("/deletecourse", deleteCourse);


// ======================= USERS' FUNCTION =====================================
router.post("/deleteUser", deleteUser);


//========================  QUIZZES ============================================
// Route to delete a question
router.post('/deletequestions', deleteQuestion);

// delete quiz
router.post("/deleteQuiz", deleteQuiz);

export default router;
