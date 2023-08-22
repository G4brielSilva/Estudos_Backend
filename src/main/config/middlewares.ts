import { Express } from 'express';
import { bodyParser } from '../middlewares/bodyParser/BodyParser';
import { cors } from '../middlewares/cors/Cors';

export default (app: Express): void => {
    app.use(bodyParser);
    app.use(cors);
};