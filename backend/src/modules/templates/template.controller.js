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

export const streamGoogleDriveVideo = asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(400).send('File ID is required');
    }

    const targetUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (req.headers.range) {
        headers['Range'] = req.headers.range;
    }

    try {
        const upstream = await fetch(targetUrl, { headers });
        if (!upstream.ok && upstream.status !== 206) {
            return res.status(upstream.status).send('Unable to stream video');
        }

        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

        const contentRange = upstream.headers.get('content-range');
        if (contentRange) {
            res.setHeader('Content-Range', contentRange);
        }
        const contentLength = upstream.headers.get('content-length');
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        res.status(upstream.status);

        const reader = upstream.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).send('Error streaming video');
        }
    }
});
