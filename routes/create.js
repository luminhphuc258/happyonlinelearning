import express from 'express';
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
import adduser from "../handlers/register.js";
import handleUploadPicture from "../handlers/uploadpicture.js";
import { storeQuizScore } from "../handlers/userscore.js";
import { storeQuestion } from "../handlers/quiz.js";
import { storeQuiz } from "../handlers/makingquizzes.js";
import { addProgram } from "../handlers/studyprogram.js";
import { addCourse } from "../handlers/courses.js";
import { handleRequestToEnroll } from "../handlers/enrollments.js";
import { handler_addSubmitQuiz } from "../handlers/quizattempts.js"

// handle for adding new study program 
router.post("/addnewstudyprogram", addProgram);

// handle for adding new course
router.post("/addnewcourses", addCourse);

// handle for requesting to enrollment from students
router.post("/RequestToEnrollment", handleRequestToEnroll);

// handle for making new account
router.post("/register", adduser);

//handle for add user score
router.post("/adduserscore", storeQuizScore);

// hander for add question
router.post("/storeQuestion", storeQuestion);

// hander for add quiz
router.post("/storeQuiz", storeQuiz);

// hander for add quiz
router.post("/studentsubmitQuiz", handler_addSubmitQuiz);


// UPLOAD DOCUMENTS - PICTURES
router.post("/uploaduserpicture", upload.single("userfile"), handleUploadPicture);




export default router;
