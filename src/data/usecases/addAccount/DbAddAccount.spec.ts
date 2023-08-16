import { Encrypter } from '../../protocols/Encrypter';
import { DbAddAccount } from './DbAddAccount';

interface SutTypes {
    sut: DbAddAccount
    encrypter: Encrypter
}

const makeSut = (): SutTypes => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return Promise.resolve('hashed_password');
        }
    }

    const encrypter = new EncrypterStub();

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
});