import { Router } from 'express';
import { ratingsController } from './ratings.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { submitRatingSchema, historyQuerySchema } from './ratings.schema';

const router = Router();

router.use(authenticate);

router.get('/assignment', asyncHandler(ratingsController.getDailyAssignment));
router.post('/', validate(submitRatingSchema), asyncHandler(ratingsController.submitRating));
router.get('/history', validate(historyQuerySchema, 'query'), asyncHandler(ratingsController.getRatingHistory));
router.get('/pending', asyncHandler(ratingsController.getPendingCount));

export { router as ratingsRoutes };
