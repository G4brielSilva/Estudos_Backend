import * as dotenv from 'dotenv';
import { LogErrorRepository } from '../../../../../data/protocols/LogError.repository';
import { MongoHelper } from '../helpers/mongoHelper';

dotenv.config();

export class LogMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const errorCollection = await MongoHelper.getCollection(process.env.ERRORS_COLLECTION as string);
        await errorCollection.insertOne({
            stack,
            date: new Date()
        });
    }
}
