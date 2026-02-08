import { Router } from 'express';
import { groupsController } from './groups.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { searchGroupsSchema, joinGroupSchema, membersQuerySchema } from './groups.schema';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(groupsController.getMyGroups));
router.get('/search', validate(searchGroupsSchema, 'query'), asyncHandler(groupsController.searchGroups));
router.post('/:groupId/join', validate(joinGroupSchema), asyncHandler(groupsController.joinGroup));
router.post('/:groupId/leave', asyncHandler(groupsController.leaveGroup));
router.get('/:groupId/members', validate(membersQuerySchema, 'query'), asyncHandler(groupsController.getMembers));

export { router as groupsRoutes };
