import { AbstractController } from './AbstractController';
import { AppError } from './errors';
import * as util from './utils';

class TestGetController extends AbstractController {
    protected readonly requestSchema = null;

    protected implementation(req, res) {
        return this.success(res, { message: 'success' });
    }
}

class TestPostController extends AbstractController {
    protected readonly requestSchema = null;

    protected implementation(req, res) {
        return this.created(res, { message: 'created' });
    }
}

describe('AbstractController', () => {
    let controller: TestGetController;
    let req;
    let res;

    beforeEach(() => {
        controller = new TestGetController();
        req = { headers: {} };
        res = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnValue({ send: jest.fn() }),
        };
    });

    it('should call implementation with validated request', async () => {
        const implementationMock = jest.spyOn(controller, 'execute');
        await controller.execute(req, res);
        expect(implementationMock).toHaveBeenCalledWith(req, res);
    });

    it('should call executeWithAuth with error status and message on catch', async () => {
        jest.spyOn(util, 'validateToken').mockRejectedValue(new AppError('error') as never);
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.executeWithAuth(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, 403, { message: 'error' });
    });

    it('should call respond with error status and message on catch', async () => {
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, 200, { message: 'success' });
    });

    it('should call respond with string message and status 200', async () => {
        jest.spyOn(controller, 'respond').mockImplementation((res, status, dto) =>
            res.status(status).send({ message: dto })
        );
        const respondMock = jest.spyOn(controller, 'respond');
        await controller.execute(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, 200, { message: 'success' });
    });

    it('should call success with success status and message success', async () => {
        const respondMock = jest.spyOn(controller, 'success');
        await controller.execute(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, { message: 'success' });
    });

    it('should call created with success status and message success', async () => {
        const postController = new TestPostController();
        const respondMock = jest.spyOn(postController, 'created');
        await postController.execute(req, res);
        expect(respondMock).toHaveBeenCalledWith(res, { message: 'created' });
    });
});
