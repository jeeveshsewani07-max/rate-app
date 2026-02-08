import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/profile', asyncHandler(analyticsController.getProfileAnalytics));
router.get('/traits', asyncHandler(analyticsController.getTraitBreakdown));
router.get('/trends', asyncHandler(analyticsController.getTraitTrends));

export { router as analyticsRoutes };
