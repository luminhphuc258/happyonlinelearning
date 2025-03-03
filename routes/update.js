import express from 'express';
import { CallBackendUpdateUser } from '../handlers/register.js'
import { handleUpdateGrade } from '../handlers/gradingstudents.js'

const router = express.Router();

router.post("/updateuser", CallBackendUpdateUser);

// Update grade for students 
router.post("/updatestudenttGrade", handleUpdateGrade);

export default router;
