import { MongoHelper } from '../helpers/mongoHelper';
import { AccountMongoRepository } from './Account.repository';
import * as dotenv from 'dotenv';

describe('Account Mongo Repository', () => {
    dotenv.config();
    const ACCOUNTS_COLLECTION_TEST = process.env.ACCOUNTS_COLLECTION_TEST as string;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {

    });

    test('Should return an account on sucess', async () => {
        const sut = new AccountMongoRepository(ACCOUNTS_COLLECTION_TEST);
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        });

        console.log();

        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@email.com');
        expect(account.password).toBe('any_password');
    });
});