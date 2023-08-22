import { MongoHelper } from '../infra/criptography/db/mongoDb/helpers/mongoHelper';
import * as dotenv from 'dotenv';

dotenv.config();

MongoHelper.connect(process.env.MONGO_URL as string)
    .then(async () => {
        const app = (await import('./config/app')).default;
        app.listen(5050, () => { console.log('server running at http://localhost:5050'); });
    })
    .catch(console.error);