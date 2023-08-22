import { InsertOneResult } from 'mongodb';
import { AddAccountRepository } from '../../../../../data/protocols/AddAccount.repository';
import { AccountModel } from '../../../../../domain/models/Account.models';
import { AddAccountModel } from '../../../../../domain/usecases/AddAccount';
import { MongoHelper } from '../helpers/mongoHelper';

export class AccountMongoRepository implements AddAccountRepository {
    private readonly collection: string;

    constructor (collection: string) {
        this.collection = collection;
    }

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection(this.collection);
        const result: InsertOneResult = await accountCollection.insertOne(accountData);
        const account = await accountCollection.findOne(result.insertedId);
        return MongoHelper.map(account);
    }
}