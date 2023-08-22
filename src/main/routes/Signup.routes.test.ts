import request from 'supertest';
import app from '../config/app';
import * as dotenv from 'dotenv';
import { MongoHelper } from '../../infra/criptography/db/mongoDb/helpers/mongoHelper';

describe('SignUp Routes', () => {
    dotenv.config();
    const ACCOUNTS_COLLECTION_TEST = process.env.ACCOUNTS_COLLECTION_TEST as string;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection(ACCOUNTS_COLLECTION_TEST);
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