import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { registerDeviceSchema, updatePreferencesSchema } from './notifications.schema';

const router = Router();

router.use(authenticate);

router.post('/register', validate(registerDeviceSchema), asyncHandler(notificationsController.registerDevice));
router.get('/preferences', asyncHandler(notificationsController.getPreferences));
router.patch('/preferences', validate(updatePreferencesSchema), asyncHandler(notificationsController.updatePreferences));

export { router as notificationsRoutes };
