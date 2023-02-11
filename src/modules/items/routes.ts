import { Router } from 'express';

import { authenticate } from '../../core/auth';

import { DeleteItemController } from './delete.controller';
import { GetAllItemsController, GetItemController } from './get.controller';
import { PatchItemController } from './patch.controller';
import { PostItemController } from './post.controller';

export const routes = Router();

// Items controllers
const getAllItemsController = (req, res) => new GetAllItemsController().execute(req, res);
const getItemController = (req, res) => new GetItemController().execute(req, res);
const postItemController = (req, res) => new PostItemController().execute(req, res);
const patchItemController = (req, res) => new PatchItemController().execute(req, res);
const deleteItemController = (req, res) => new DeleteItemController().execute(req, res);

// Items routes
routes.get('/', getAllItemsController);
routes.get('/:id', getItemController);
routes.post('/', authenticate, postItemController);
routes.patch('/:id', authenticate, patchItemController);
routes.delete('/:id', authenticate, deleteItemController);
