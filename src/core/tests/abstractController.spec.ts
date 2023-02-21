import { Response, Request } from 'express';

import AbstractController from '../abstractController';
import { AppFailure } from '../errors';

class TestGetController extends AbstractController {
    protected implementation() {
        return this.success({ message: 'success' });
    }
}

class TestPostController extends AbstractController {
    protected implementation(req: Request, res: Response) {
        this.respond(res, 500, { message: 'System failure' });
    }
}

class AppFailureController extends AbstractController {
    protected implementation() {
        throw new AppFailure('App failure');
    }
}

describe('AbstractController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnValue({ send: jest.fn() }),
            send: jest.fn(),
        };
    });

    it('should response with an object for an object input', async () => {
        const controller = new TestGetController();
        await controller.respond(res, 200, { message: 'success' });
        expect(res.status().send).toHaveBeenCalledWith({ message: 'success' });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should send only status if message is not present', async () => {
        const controller = new TestGetController();
        await controller.respond(res, 200);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('create method should call respond with 201 with dto ', async () => {
        const controller = new TestGetController();
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.created(res, { message: 'success' });
        expect(respondMock).toHaveBeenCalledWith(res, 201, { message: 'success' });
    });

    it('should throw 500 system failure failure error', async () => {
        const reqBody = { ...req, body: { name: 'test', age: 12 } };
        const controller = new TestPostController();
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(reqBody, res);
        expect(respondMock).toHaveBeenCalledWith(res, 500, { message: 'System failure' });
    });

    it('should throw app failure error', async () => {
        const controller = new AppFailureController();
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, 500, 'App failure');
    });
});
