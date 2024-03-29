import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './DbAddAccount.protocols';
import { DbAddAccount } from './DbAddAccount';

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return Promise.resolve('hashed_password');
        }
    }

    return new EncrypterStub();
};

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
});

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
});

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount());
        }
    }
    return new AddAccountRepositoryStub();
};

interface SutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();

    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    };
};

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');


        await sut.add(makeFakeAccountData());
        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    test('Should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()));


        const promise = sut.add(makeFakeAccountData());
        await expect(promise).rejects.toThrow();
    });

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');



        await sut.add(makeFakeAccountData());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        });
    });

    test('Should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));


        const promise = sut.add(makeFakeAccountData());
        await expect(promise).rejects.toThrow();
    });

    test('Should return an account on sucess', async () => {
        const { sut } = makeSut();

        const account = await sut.add(makeFakeAccountData());
        expect(account).toEqual(makeFakeAccount());
    });
});
