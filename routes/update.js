import express from 'express';
import { CallBackendUpdateUser } from '../handlers/register.js'
const router = express.Router();

router.post("/updateuser", CallBackendUpdateUser);

export default router;
