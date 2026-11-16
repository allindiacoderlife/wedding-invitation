import prisma from '../../config/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

const generateOrderNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `WED-${random}`;
};

export const createOrder = async (orderData, userId = null) => {
    const {
        templateId,
        clientName,
        clientEmail,
        clientPhone,
        brideName,
        groomName,
        brideParents,
        groomParents,
        events,
        musicPreference,
        customTextNotes,
        photoUrls,
    } = orderData;

    if (!clientName || !clientEmail || !clientPhone) {
        throw new ApiError(400, 'Client contact details (name, email, phone) are required');
    }

    if (!brideName || !groomName) {
        throw new ApiError(400, "Bride's name and Groom's name are required");
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
        throw new ApiError(400, 'At least one wedding function / event details are required');
    }

    const orderNumber = generateOrderNumber();

    return prisma.invitationOrder.create({
        data: {
            orderNumber,
            templateId: templateId || null,
            userId: userId || null,
            clientName,
            clientEmail: clientEmail.trim().toLowerCase(),
            clientPhone,
            brideName,
            groomName,
            brideParents: brideParents || '',
            groomParents: groomParents || '',
            events: events,
            musicPreference: musicPreference || '',
            customTextNotes: customTextNotes || '',
            customFields: orderData.customFields || {},
            photoUrls: photoUrls || [],
            status: 'PENDING',
        },
        include: {
            template: true,
        },
    });
};

export const getOrderByNumber = async (orderNumber) => {
    const order = await prisma.invitationOrder.findUnique({
        where: { orderNumber },
        include: {
            template: true,
        },
    });

    if (!order) {
        throw new ApiError(404, 'No invitation order found with this tracking number');
    }

    return order;
};

export const getAllOrdersAdmin = async ({ status, search }) => {
    const where = {};

    if (status && status !== 'ALL') {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { clientName: { contains: search, mode: 'insensitive' } },
            { clientEmail: { contains: search, mode: 'insensitive' } },
            { brideName: { contains: search, mode: 'insensitive' } },
            { groomName: { contains: search, mode: 'insensitive' } },
        ];
    }

    return prisma.invitationOrder.findMany({
        where,
        include: {
            template: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const getOrderByIdAdmin = async (id) => {
    const order = await prisma.invitationOrder.findUnique({
        where: { id },
        include: {
            template: true,
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    return order;
};

export const updateOrderStatusAdmin = async (id, updateData) => {
    const existing = await prisma.invitationOrder.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, 'Order not found');
    }

    const { status, finalVideoUrl, adminNotes } = updateData;

    return prisma.invitationOrder.update({
        where: { id },
        data: {
            status: status !== undefined ? status : existing.status,
            finalVideoUrl: finalVideoUrl !== undefined ? finalVideoUrl : existing.finalVideoUrl,
            adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
        },
        include: {
            template: true,
        },
    });
};
