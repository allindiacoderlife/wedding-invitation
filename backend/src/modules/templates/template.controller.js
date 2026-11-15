import { asyncHandler } from '../../utils/asyncHandler.js';
import * as templateService from './template.service.js';

export const listTemplates = asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const templates = await templateService.getAllTemplates({ category, search });
    res.status(200).json({
        success: true,
        count: templates.length,
        templates,
    });
});

export const getTemplate = asyncHandler(async (req, res) => {
    const template = await templateService.getTemplateById(req.params.id);
    res.status(200).json({
        success: true,
        template,
    });
});

export const createTemplate = asyncHandler(async (req, res) => {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json({
        success: true,
        message: 'Video template created successfully',
        template,
    });
});

export const updateTemplate = asyncHandler(async (req, res) => {
    const template = await templateService.updateTemplate(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Template updated successfully',
        template,
    });
});

export const deleteTemplate = asyncHandler(async (req, res) => {
    await templateService.deleteTemplate(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Template deleted successfully',
    });
});
