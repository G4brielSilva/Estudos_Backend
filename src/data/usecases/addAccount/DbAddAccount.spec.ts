import { Encrypter } from './DbAddAccountProtocols';
import { DbAddAccount } from './DbAddAccount';

interface SutTypes {
    sut: DbAddAccount
    encrypter: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return Promise.resolve('hashed_password');
        }
    }

    return new EncrypterStub();
};

const makeSut = (): SutTypes => {
    const encrypter = makeEncrypter();

    const sut = new DbAddAccount(encrypter);
    return {
        sut,
        encrypter
    };
};

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypter } = makeSut();
        const encryptSpy = jest.spyOn(encrypter, 'encrypt');

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        };
        await sut.add(accountData);
        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    test('Should throw if encrypter throws', async () => {
        const { sut, encrypter } = makeSut();
        jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()));

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        };
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    });
});