import express from 'express';
import {
    listTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    streamGoogleDriveVideo,
} from './template.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', listTemplates);
router.get('/stream/:fileId', streamGoogleDriveVideo);
router.get('/:id', getTemplate);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), createTemplate);
router.put('/:id', authenticate, authorize('ADMIN'), updateTemplate);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTemplate);

export default router;
