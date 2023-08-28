import { EmailValidator, AddAccount, AddAccountModel, AccountModel, HttpRequest } from './signup.protocols';
import { ServerError, MissingParamError, InvalidParamError } from '../../errors';
import { SignUpController } from './signup.controller';
import { ok, serverError, badRequest } from '../../helpers/http.helper';

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
});

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount: AccountModel = makeFakeAccount();
            return Promise.resolve(fakeAccount);
        }
    }
    return new AddAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});

interface SutTypes {
    sut: SignUpController;
    emailValidator: EmailValidator;
    addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
    const emailValidator = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidator, addAccountStub);
    return {
        sut,
        emailValidator,
        addAccountStub
    };
};

describe('Signup Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
    });

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    });

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
    });

    test('Should return 400 if no password confirmation is provided', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')));

    });

    test('Should return 400 if password confirmation fails', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')));
    });

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false);

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    });

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidator } = makeSut();
        const isValidSpy = jest.spyOn(emailValidator, 'isValid');

        const httpRequest = makeFakeRequest();

        await sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
    });

    test('Should return 500 if EmailValidator trows', async () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(serverError(new ServerError('')));
    });

    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        const httpRequest = makeFakeRequest();

        await sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        });
    });

    test('Should return 500 if AddAccount trows', async () => {
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return Promise.reject(new Error());
        });

        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(serverError(new ServerError('')));
    });

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut();

        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });
});
