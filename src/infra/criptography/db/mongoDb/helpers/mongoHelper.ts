import { Collection, MongoClient, Db } from 'mongodb';
import { AccountModel } from '../../../../../domain/models/Account.models';
import * as dotenv from 'dotenv';

dotenv.config();

export const MongoHelper = {
    client: null as unknown as MongoClient,
    bd: null as unknown as Db,

    async connect (url: string): Promise<void> {
        this.client = new MongoClient(url);
        this.client.connect();
        this.db = this.client.db(process.env.DB_NAME);
    },

    async disconnect (): Promise<void> {
        this.client.close();
    },

    getCollection (name: string): Collection {
        return this.db.collection(name);
    },

    map (account: any): AccountModel {
        const { _id, ...accountWithoutId } = account;
        return Object.assign({}, accountWithoutId, { id: _id });
    }
};