import {
    GetAllItemsController,
    GetItemController,
    PostItemController,
    PatchItemController,
    DeleteItemController,
} from './controllers';

// Items controllers
const getAllItemsController = (req, res) => new GetAllItemsController().execute(req, res);
const getItemController = (req, res) => new GetItemController().execute(req, res);
const postItemController = (req, res) => new PostItemController().execute(req, res);
const patchItemController = (req, res) => new PatchItemController().execute(req, res);
const deleteItemController = (req, res) => new DeleteItemController().execute(req, res);

export const operations = {
    getAllItems: getAllItemsController,
    getItem: getItemController,
    postItem: postItemController,
    patchItem: patchItemController,
    deleteItem: deleteItemController,
};
