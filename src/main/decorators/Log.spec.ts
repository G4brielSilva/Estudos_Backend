import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./Log";

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = { body: { result: 'Im a teapot' }, statusCode: 418 }
            return Promise.resolve(httpResponse);
        }

    }

    return new ControllerStub();
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController();
    const sut = new LogControllerDecorator(controllerStub);

    return { sut, controllerStub };
};

describe('Log Controller Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut();
        const controllerHandleSpy = jest.spyOn(controllerStub, 'handle');
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                name: 'any_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }}

        await sut.handle(httpRequest);
        expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest);
    });
});
