import {MongoClient} from 'mongodb'

export const Mongo = {
    async connect(mongoConnectionString, mongoDBName){
        const client = new MongoClient(mongoConnectionString)
        await client.connect()
        const db = client.db(mongoDBName)

        this.client = client
        this.db = db

        return 'MongoDB connected'
    }
}