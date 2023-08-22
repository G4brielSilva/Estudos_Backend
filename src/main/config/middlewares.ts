import { Express } from 'express';
import { bodyParser } from '../middlewares/bodyParser/BodyParser';

export default (app: Express): void => {
    app.use(bodyParser);
};