import {Mongo} from '../database/mongo.js'
import {ObjectId} from 'mongodb'

const collectionName = 'events'
const collectionVagas = 'vagas'


export default class eventsDataAccess {

    async createEvent(eventData){
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne(eventData)
        return result
    }

    async getEvents() {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $lookup: {
                        from: collectionVagas,
                        localField: "_id",
                        foreignField: "eventId",
                        as: "vagas"
                    }
                }
            ])
            .toArray();

        return result;
}

    async getAvailableEvents() {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $match: {
                        available: true
                    }
                },
                {
                    $lookup: {
                        from: collectionVagas,
                        localField: "_id",
                        foreignField: "eventId",
                        as: "vagas"
                    }
                }
            ])
            .toArray();

        return result;
    }

    async deleteEvent(eventId){

        const objectId = new ObjectId(eventId);

        // Exclui todas as vagas do evento
        await Mongo.db
            .collection(collectionVagas)
            .deleteMany({
                eventId: objectId
            });

        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({_id: objectId})

        return result
    }

    async updateEvent(eventId, eventData){
        return await Mongo.db.collection(collectionName)
            .findOneAndUpdate(
                {_id: new ObjectId(eventId)},
                {$set: eventData},
                {returnDocument: 'after'}
            )
    }


    async createVagas(eventId, vagasData) {

        const event = await Mongo.db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(eventId) });

        if (!event) {
            throw new Error('Evento não encontrado');
        }

        const vagas = vagasData.map(vaga => ({
            eventId: new ObjectId(eventId),
            nome: vaga.nome,
            quantidade: vaga.quantidade,
            ocupadas: 0,
            available: true,
        }));

        return await Mongo.db
            .collection(collectionVagas)
            .insertMany(vagas);
    }

    async updateVaga(vagaId, vagasData) {
        const result = await Mongo.db.collection(collectionVagas)
            .findOneAndUpdate(
                { _id: new ObjectId(vagaId) },
                { $set: vagasData },
                { returnDocument: 'after' }
            );
        
        return result;
    }

    async deleteVaga(vagaId) {
        const result = await Mongo.db.collection(collectionVagas)
            .findOneAndDelete({ _id: new ObjectId(vagaId) });
        
        return result;
    }
}