import { AddAccount, AddAccountModel } from '../../../domain/usecases/AddAccount';
import { AccountModel } from '../../../domain/models/AccountModel';
import { Encrypter } from '../../protocols/Encrypter';

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    constructor (encrypter: Encrypter) {
        this.encrypter = encrypter;
    }

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password);
        return new Promise(resolve => resolve());
    }
}