// routes/auth.routes.js
import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js'; 

const router = Router();

router.post('/login', loginLimiter, authCtrl.login);

export default router;