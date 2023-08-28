import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./Log";
import { ok, serverError } from '../../presentation/helpers/http.helper'
import { LogErrorRepository } from "../../data/protocols/LogError.repository";
import { AccountModel } from "../../domain/models/Account.models";

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
});

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError (stack: string): Promise<void> {
            return  Promise.resolve();
        }
    }

    return new LogErrorRepositoryStub();
}

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    return serverError(fakeError);
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return Promise.resolve(ok(makeFakeAccount()));
        }
    }

    return new ControllerStub();
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController();
    const logErrorRepositoryStub = makeLogErrorRepository();
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);


    return { sut, controllerStub, logErrorRepositoryStub };
};

describe('Log Controller Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut();
        const controllerHandleSpy = jest.spyOn(controllerStub, 'handle');
        const httpRequest = makeFakeRequest();

        await sut.handle(httpRequest);
        expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest);
    });

    test('Should return the same result of the controller', async () => {
        const { sut } = makeSut();
        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()));
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

        const httpRequest = makeFakeRequest();

        await sut.handle(httpRequest);
        expect(logSpy).toHaveBeenCalledWith('any_stack');
    });
});
