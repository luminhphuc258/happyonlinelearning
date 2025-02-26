import express from 'express';
const router = express.Router();
import adduser from "../handlers/register.js";
import { storeQuizScore } from "../handlers/userscore.js";
import { storeQuestion } from "../handlers/quiz.js";

// handle for making new account
router.post("/register", adduser);

//handle for add user score
router.post("/adduserscore", storeQuizScore);

// hander for add question
router.post("/storeQuestion", storeQuestion);
export default router;
