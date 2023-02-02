import { AbstractController } from '../core/abstractController';

export class HealthController extends AbstractController {
    protected readonly requestSchema = null;
    protected async implementation() {
        return this.success({ health: true });
    }
}
