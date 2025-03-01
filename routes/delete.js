import express from 'express';
import { deleteUser } from '../handlers/register.js'
import { deleteProgram } from "../handlers/studyprogram.js";

const router = express.Router();

//======================== STUDY PROGRAM FUNCTION ==============================
router.post("/deletestudyprogram", deleteProgram);



// ======================= USERS' FUNCTION =====================================
router.post("/deleteUser", deleteUser);


export default router;
