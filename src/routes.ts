import { Router } from 'express';

import { HealthController } from './controllers/health';
import {
    DeleteItemController,
    GetAllItemsController,
    GetItemController,
    PatchItemController,
    PostItemController,
} from './controllers/item/controller';
import { authenticate } from './core/auth';

const router = Router();

// Health
const healthController = (req, res) => new HealthController().execute(req, res);

// Items controllers
const getAllItemsController = (req, res) => new GetAllItemsController().execute(req, res);
const getItemController = (req, res) => new GetItemController().execute(req, res);
const postItemController = (req, res) => new PostItemController().execute(req, res);
const patchItemController = (req, res) => new PatchItemController().execute(req, res);
const deleteItemController = (req, res) => new DeleteItemController().execute(req, res);

router.get('/', healthController);

// Items routes
router.get('/items', getAllItemsController);
router.get('/items/:id', getItemController);
router.post('/items', authenticate, postItemController);
router.patch('/items/:id', authenticate, patchItemController);
router.delete('/items/:id', authenticate, deleteItemController);

export default router;
