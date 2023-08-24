import { Collection, MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

export const MongoHelper = {
    client: null as unknown as MongoClient,
    bd: null as unknown as Db,
    url: null as unknown as string,

    async connect(url: string): Promise<void> {
        this.url = url;
        this.client = new MongoClient(url);
        this.client.connect();
        this.db = this.client.db(process.env.DB_NAME);
    },

    async disconnect(): Promise<void> {
        await this.client.close();
        this.client = null;
    },

    async getCollection(name: string): Promise<Collection> {
        if (!this.client) await this.connect();
        return this.db.collection(name);
    },

    map(account) {
        const { _id, ...accountWithoutId } = account;
        return { ...accountWithoutId, id: _id };
    }
};
