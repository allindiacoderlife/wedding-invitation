import express from 'express';
import {
    submitOrder,
    trackOrder,
    listOrdersAdmin,
    getOrderAdmin,
    updateOrderAdmin,
} from './order.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for clients
router.post('/', submitOrder);
router.get('/track/:orderNumber', trackOrder);

// Admin only routes for managing submitted wedding orders
router.get('/admin', authenticate, authorize('ADMIN'), listOrdersAdmin);
router.get('/admin/:id', authenticate, authorize('ADMIN'), getOrderAdmin);
router.patch('/admin/:id', authenticate, authorize('ADMIN'), updateOrderAdmin);

export default router;
