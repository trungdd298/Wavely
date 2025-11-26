import express from 'express';
import { authProfile } from '../controllers/userController.js';

const router = express.Router();

router.get("/profile", authProfile);

export default router;
