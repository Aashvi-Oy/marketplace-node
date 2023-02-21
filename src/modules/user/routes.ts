import { Router } from 'express';

import { GetUserController, PostUserController, PatchUserController, DeleteUserController } from './controllers';

export const routes = Router();

// User controller
const getUserController = (req, res) => new GetUserController().execute(req, res);
const postUserController = (req, res) => new PostUserController().execute(req, res);
const patchUserController = (req, res) => new PatchUserController().execute(req, res);
const deleteUserController = (req, res) => new DeleteUserController().execute(req, res);

export const operations = {
    getUser: getUserController,
    postUser: postUserController,
    patchUser: patchUserController,
    deleteUser: deleteUserController,
};
