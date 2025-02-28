import express from 'express';
import { deleteUser } from '../handlers/register.js'

const router = express.Router();

router.post("/deleteUser", deleteUser);

export default router;
