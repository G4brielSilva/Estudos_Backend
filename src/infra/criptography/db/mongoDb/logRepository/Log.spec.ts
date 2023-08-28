import * as dotenv from 'dotenv';
import { MongoHelper } from '../helpers/mongoHelper';
import { Collection } from 'mongodb';
import { LogMongoRepository } from './Log';
import { LogErrorRepository } from '../../../../../data/protocols/LogError.repository';

const makeSut = (): LogErrorRepository => {
    return new LogMongoRepository();
}

describe('LogAccount Mongo Repository', () => {
    dotenv.config();
    const ERRORS_COLLECTION_TEST = process.env.ERRORS_COLLECTION_TEST as string;
    let errorCollection: Collection;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
        jest.spyOn(LogMongoRepository.prototype, 'logError').mockImplementation(async (stack: string): Promise<void> => {
            const errorCollection = await MongoHelper.getCollection(process.env.ERRORS_COLLECTION_TEST as string);

            await errorCollection.insertOne({
                stack,
                date: new Date()
            });
        });
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection(ERRORS_COLLECTION_TEST);
        await errorCollection.deleteMany({});
    });

    test('Should create an error log on sucess', async () => {
        const sut = makeSut();
        await sut.logError('any_error');

        const count = await errorCollection.countDocuments();

        expect(count).toBe(1);
    });
});
