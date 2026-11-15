import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import templateRoutes from '../modules/templates/template.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/orders', orderRoutes);

export default router;
