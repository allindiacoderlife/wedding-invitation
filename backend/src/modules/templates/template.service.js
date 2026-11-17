import prisma from '../../config/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllTemplates = async ({ category, search }) => {
    const where = { isActive: true };

    if (category && category !== 'ALL') {
        where.category = category;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const templates = await prisma.template.findMany({
        where,
        orderBy: { createdAt: 'asc' },
    });

    // Natural alphanumeric sort so "Video 1", "Video 2", "Video 3" appear in correct order
    return templates.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' })
    );
};

export const getTemplateById = async (id) => {
    const template = await prisma.template.findUnique({
        where: { id },
    });
    if (!template) {
        throw new ApiError(404, 'Template not found');
    }
    return template;
};

export const createTemplate = async (data) => {
    if (!data.title || !data.videoUrl) {
        throw new ApiError(400, 'Title and video URL are required');
    }

    return prisma.template.create({
        data: {
            title: data.title,
            description: data.description || '',
            videoUrl: data.videoUrl,
            thumbnailUrl: data.thumbnailUrl || '',
            category: data.category || 'Traditional',
            duration: data.duration || '60s',
            price: data.price ? parseFloat(data.price) : 0,
            formSchema: data.formSchema !== undefined ? data.formSchema : null,
            isActive: true,
        },
    });
};

export const updateTemplate = async (id, data) => {
    const existing = await prisma.template.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, 'Template not found');
    }

    return prisma.template.update({
        where: { id },
        data: {
            title: data.title !== undefined ? data.title : existing.title,
            description: data.description !== undefined ? data.description : existing.description,
            videoUrl: data.videoUrl !== undefined ? data.videoUrl : existing.videoUrl,
            thumbnailUrl: data.thumbnailUrl !== undefined ? data.thumbnailUrl : existing.thumbnailUrl,
            category: data.category !== undefined ? data.category : existing.category,
            duration: data.duration !== undefined ? data.duration : existing.duration,
            price: data.price !== undefined ? parseFloat(data.price) : existing.price,
            formSchema: data.formSchema !== undefined ? data.formSchema : existing.formSchema,
            isActive: data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive,
        },
    });
};

export const deleteTemplate = async (id) => {
    const existing = await prisma.template.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, 'Template not found');
    }

    return prisma.template.delete({ where: { id } });
};
