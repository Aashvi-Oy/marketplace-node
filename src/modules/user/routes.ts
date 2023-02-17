import { Router } from 'express';
import passport from 'passport';

import { basicAuthentication } from '../../core/auth';

import { GetUserController, PostUserController, PatchUserController, DeleteUserController } from './controllers';

export const routes = Router();
passport.use(basicAuthentication);

// User controller
const getUserController = (req, res) => new GetUserController().execute(req, res);
const postUserController = (req, res) => new PostUserController().execute(req, res);
const patchUserController = (req, res) => new PatchUserController().execute(req, res);
const deleteUserController = (req, res) => new DeleteUserController().execute(req, res);

// Items routes
routes.get('/login', passport.authenticate('basic', { session: false }), getUserController);
routes.post('/register', postUserController);
routes.patch('/', patchUserController);
routes.delete('/', deleteUserController);
