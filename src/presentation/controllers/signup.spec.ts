import { SignUpController } from './signup';
import { ServerError, MissingParamError, InvalidParamError } from '../errors';
import { EmailValidator } from '../protocols';
import { AccountModel } from '../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../domain/usecases/addAccount';

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        add (account: AddAccountModel): AccountModel {
            const fakeAccount: AccountModel = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password'
            };
            return fakeAccount;
        }
    }
    return new AddAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

interface SutTypes {
    sut: SignUpController
    emailValidator: EmailValidator
    addAccount: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidator = makeEmailValidator();
    const addAccount = makeAddAccount();
    const sut = new SignUpController(emailValidator, addAccount);
    return {
        sut,
        emailValidator,
        addAccount
    };
};

describe('Signup Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const { sut } = makeSut();

        const httpRequest = {
        body: {
            email: 'any_email@email.com',
            password: 'any_password',
            passwordConfirmation: 'any_password'
        }
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });

    test('Should return 400 if no email is provided', () => {
        const { sut } = makeSut();

        const httpRequest = {
        body: {
            name: 'any_name',
            password: 'any_password',
            passwordConfirmation: 'any_password'
        }
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    test('Should return 400 if no password is provided', () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    test('Should return 400 if no password confirmation is provided', () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    });

    test('Should return 400 if password confirmation fails', () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
    });

    test('Should return 400 if an invalid email is provided', () => {
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

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidator } = makeSut();
        const isValidSpy = jest.spyOn(emailValidator, 'isValid');

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
    });

    test('Should return 500 if EmailValidator trows', () => {
        const { sut, emailValidator } = makeSut();
        jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should call AddAccount with correct values', () => {
        const { sut, addAccount } = makeSut();
        const addSpy = jest.spyOn(addAccount, 'add');
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        };

        sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        });
    });
});