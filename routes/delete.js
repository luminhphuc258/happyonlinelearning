import express from 'express';
import { deleteUser } from '../handlers/register.js'
import { deleteProgram } from "../handlers/studyprogram.js";
import { deleteCourse } from "../handlers/courses.js";
const router = express.Router();

//======================== STUDY PROGRAM FUNCTION ==============================
router.post("/deletestudyprogram", deleteProgram);

//======================== STUDY  COURSE FUNCTION ==============================
router.post("/deletecourse", deleteCourse);


// ======================= USERS' FUNCTION =====================================
router.post("/deleteUser", deleteUser);


export default router;
