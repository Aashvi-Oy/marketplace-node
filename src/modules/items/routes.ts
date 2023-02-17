import { Router } from 'express';

import {
    GetAllItemsController,
    GetItemController,
    PostItemController,
    PatchItemController,
    DeleteItemController,
} from './controllers';

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
routes.post('/', postItemController);
routes.patch('/:id', patchItemController);
routes.delete('/:id', deleteItemController);
