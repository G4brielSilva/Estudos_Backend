import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './DbAddAccount.protocols';

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    private readonly addAccountRepository: AddAccountRepository;

    constructor(encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter;
        this.addAccountRepository = addAccountRepository;
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(accountData.password);
        return this.addAccountRepository.add({
            ...accountData,
            password: hashedPassword
        });
    }
}
