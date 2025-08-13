import express from 'express'
import { login, refreshToken, registeration } from '../controller/authController';
const router = express.Router();
router.post('/register',registeration)
router.post('/login',login)
router.post('/refreshToken',refreshToken)
export default router;