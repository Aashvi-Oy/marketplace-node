import * as yup from 'yup';

import AbstractController from './abstractController';

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

class TestPostController extends AbstractController {
    protected readonly requestSchema = requestSchema;

    protected implementation() {
        throw new Error('Not implemented');
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

    describe('Authentication test', () => {
        it('should throw forbidden for request without token', async () => {
            const controller = new TestGetController(req, res);
            const respondMock = jest.spyOn(controller, 'respond');
            await controller.authenticate().execute();
            expect(respondMock).toHaveBeenCalledWith(403, 'headers.authorization is a required field');
        });

        it('should throw forbidden for request with invalid token format', async () => {
            const controller = new TestGetController({ ...req, headers: { authorization: 'token' } }, res);
            const respondMock = jest.spyOn(controller, 'respond');
            await controller.authenticate().execute();
            expect(respondMock).toHaveBeenCalledWith(
                403,
                'headers.authorization is not in correct format: Bearer [token]'
            );
        });

        it('should success for valid format of token', async () => {
            const controller = new TestGetController({ ...req, headers: { authorization: 'Bearer token' } }, res);
            const respondMock = jest.spyOn(controller, 'respond');
            await controller.authenticate().execute();
            expect(respondMock).toHaveBeenCalledWith(200, { message: 'success' });
        });
    });

    it('should response with an object for an object input', async () => {
        const controller = new TestGetController(req, res);
        await controller.respond(200, { message: 'success' });
        expect(res.status().send).toHaveBeenCalledWith({ message: 'success' });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should send only status if message is not present', async () => {
        const controller = new TestGetController(req, res);
        await controller.respond(200);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('create method should call respond with 201 with dto ', async () => {
        const controller = new TestGetController(req, res);
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.created({ message: 'success' });
        expect(respondMock).toHaveBeenCalledWith(201, { message: 'success' });
    });

    it('should complain about missing required field from the body', async () => {
        const reqBody = { body: {} };
        const controller = new TestPostController(reqBody, res);
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute();
        expect(respondMock).toHaveBeenCalledWith(400, 'Name is required');
    });

    it('should throw app failure error', async () => {
        const reqBody = { body: { name: 'test', age: 12 } };
        const controller = new TestPostController(reqBody, res);
        await controller.execute();
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
