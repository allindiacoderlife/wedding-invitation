import { asyncHandler } from '../../utils/asyncHandler.js';
import * as orderService from './order.service.js';

export const submitOrder = asyncHandler(async (req, res) => {
    const userId = req.user?.id || null;
    const order = await orderService.createOrder(req.body, userId);
    res.status(201).json({
        success: true,
        message: 'Wedding invitation order submitted successfully! Our team will prepare your custom video.',
        order,
    });
});

export const trackOrder = asyncHandler(async (req, res) => {
    const { orderNumber } = req.params;
    const order = await orderService.getOrderByNumber(orderNumber);
    res.status(200).json({
        success: true,
        order,
    });
});

export const listOrdersAdmin = asyncHandler(async (req, res) => {
    const { status, search } = req.query;
    const orders = await orderService.getAllOrdersAdmin({ status, search });
    res.status(200).json({
        success: true,
        count: orders.length,
        orders,
    });
});

export const getOrderAdmin = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderByIdAdmin(req.params.id);
    res.status(200).json({
        success: true,
        order,
    });
});

export const updateOrderAdmin = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrderStatusAdmin(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order,
    });
});
