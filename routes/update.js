import express from 'express';
import { CallBackendUpdateUser } from '../handlers/register.js'
import { handleUpdateGrade } from '../handlers/gradingstudents.js'
import {
  updateQuestion
} from '../handlers/quiz.js';

const router = express.Router();

router.post("/updateuser", CallBackendUpdateUser);

// Update grade for students 
router.post("/updatestudenttGrade", handleUpdateGrade);

router.put('/questions', updateQuestion);

export default router;
