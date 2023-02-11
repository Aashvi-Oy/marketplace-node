import { Response } from 'express';
import * as yup from 'yup';

import AbstractController, { ValidatedRequest } from './abstractController';
import { AppFailure } from './errors';

class TestGetController extends AbstractController {
    protected readonly requestSchema = null;

    protected implementation() {
        return this.success({ message: 'success' });
    }
}

const BodySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    age: yup.number().nullable(),
});

const requestSchema = yup.object().shape({
    body: BodySchema.noUnknown().required(),
    params: yup.object().shape({ id: yup.string() }),
});

class TestPostController extends AbstractController<typeof requestSchema> {
    protected readonly requestSchema = requestSchema;

    protected implementation(req: ValidatedRequest<typeof requestSchema>, res: Response) {
        this.respond(res, 500, { message: 'System failure' });
    }
}

class AppFailiureController extends AbstractController {
    protected readonly requestSchema = null;

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

    // describe('Authentication test', () => {
    //     it('should throw forbidden for request without token', async () => {
    //         const controller = new TestGetController();
    //         const respondMock = jest.spyOn(controller, 'respond');
    //         await controller.authenticate().execute();
    //         expect(respondMock).toHaveBeenCalledWith(403, 'headers.authorization is a required field');
    //     });
    //
    //     it('should throw forbidden for request with invalid token format', async () => {
    //         const controller = new TestGetController();
    //         const respondMock = jest.spyOn(controller, 'respond');
    //         await controller.execute({ ...req, headers: { authorization: 'token' } }, res);
    //         expect(respondMock).toHaveBeenCalledWith(
    //             403,
    //             'headers.authorization is not in correct format: Bearer [token]'
    //         );
    //     });
    //
    //     it('should success for valid format of token', async () => {
    //         const controller = new TestGetController({ ...req, headers: { authorization: 'Bearer token' } }, res);
    //         const respondMock = jest.spyOn(controller, 'respond');
    //         await controller.authenticate().execute();
    //         expect(respondMock).toHaveBeenCalledWith(200, { message: 'success' });
    //     });
    // });

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

    it('should complain about missing required field from the body', async () => {
        const reqBody = { ...req, body: {} };
        const controller = new TestPostController();
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(reqBody, res);
        expect(respondMock).toHaveBeenCalledWith(res, 400, 'Name is required');
    });

    it('should throw 500 system failure failure error', async () => {
        const reqBody = { ...req, body: { name: 'test', age: 12 } };
        const controller = new TestPostController();
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(reqBody, res);
        expect(respondMock).toHaveBeenCalledWith(res, 500, { message: 'System failure' });
    });

    it('should throw app failure error', async () => {
        const controller = new AppFailiureController();
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, 500, 'App failure');
    });
});
