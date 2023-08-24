import request from 'supertest';
import * as dotenv from 'dotenv';
import { InsertOneResult } from 'mongodb';
import app from '../config/app';
import { MongoHelper } from '../../infra/criptography/db/mongoDb/helpers/mongoHelper';
import { AccountMongoRepository } from '../../infra/criptography/db/mongoDb/accountRepository/Account.repository';
import { AccountModel } from '../../domain/models/Account.models';

describe('SignUp Routes', () => {
    dotenv.config();
    const ACCOUNTS_COLLECTION_TEST = process.env.ACCOUNTS_COLLECTION_TEST as string;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
        jest.spyOn(AccountMongoRepository.prototype, 'add').mockImplementation(async (accountData: any): Promise<AccountModel> => {
            const accountCollection = await MongoHelper.getCollection('accounts_test');
            const result: InsertOneResult = await accountCollection.insertOne(accountData);
            const account = await accountCollection.findOne(result.insertedId);
            return MongoHelper.map(account);
        });
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection(ACCOUNTS_COLLECTION_TEST);
        await accountCollection.deleteMany({});
    });

    test('Should return an account on sucess', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
            })
            .expect(200);
    });
});
