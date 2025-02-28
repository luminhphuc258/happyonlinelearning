import express from 'express';
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
import adduser from "../handlers/register.js";
import handleUploadPicture from "../handlers/uploadpicture.js";
import { storeQuizScore } from "../handlers/userscore.js";
import { storeQuestion } from "../handlers/quiz.js";


// handle for making new account
router.post("/register", adduser);

//handle for add user score
router.post("/adduserscore", storeQuizScore);

// hander for add question
router.post("/storeQuestion", storeQuestion);

// UPLOAD DOCUMENTS - PICTURES
router.post("/uploaduserpicture", upload.single("userfile"), handleUploadPicture);


export default router;
