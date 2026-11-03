import {Mongo} from '../database/mongo.js'
import {ObjectId} from 'mongodb'

const collectionName = 'tickets'
const vagasCollectionName = 'vagas'
const eventsCollectionName = 'events'
const usersCollectionName = 'users'


export default class ticketsDataAccess {

    async createTicket(ticketData) {

        const { userId, vagaId } = ticketData;

        // 1. Verifica utilizador
        const user = await Mongo.db
            .collection(usersCollectionName)
            .findOne({ _id: new ObjectId(userId) });
            
        if (!user) {
            throw new Error('Utilizador não encontrado');
        }

        // 2. Verifica vaga
        const vaga = await Mongo.db
            .collection(vagasCollectionName)
            .findOne({ _id: new ObjectId(vagaId) });

        if (!vaga) {
            throw new Error('Vaga não encontrada');
        }

        // 3. Verifica disponibilidade
        if (!vaga.available || vaga.ocupadas >= vaga.quantidade) {
            throw new Error('Vaga indisponível');
        }

        // 4. Busca a ação
        const event = await Mongo.db
            .collection(eventsCollectionName)
            .findOne({ _id: vaga.eventId });

        if (!event) {
            throw new Error('Evento não encontrado');
        }

        // 5. Verifica se já existe ingresso para essa ação
        const existingTicket = await Mongo.db
            .collection(collectionName)
            .findOne({
                userId: new ObjectId(userId),
                eventId: event._id
            });
        
        if (existingTicket) {
            console.log('O utilizador já possui ingresso para este evento');
            throw new Error('O utilizador já possui ingresso para este evento');
        }

        // 6. Cria o ingresso
        const ticket = {
            userId: new ObjectId(userId),
            eventId: event._id,
            vagaId: vaga._id,

            eventName: event.name,
            vagaName: vaga.nome,
            eventDate: event.date,

            createdAt: new Date()
        };

        const result = await Mongo.db
            .collection(collectionName)
            .insertOne(ticket);

        // 7. Atualiza ocupação da vaga
        const novasOcupadas = vaga.ocupadas + 1;

        await Mongo.db
            .collection(vagasCollectionName)
            .updateOne(
                { _id: vaga._id },
                {
                    $set: {
                        ocupadas: novasOcupadas,
                        available: novasOcupadas < vaga.quantidade
                    }
                }
            );

        return result;
    }

    async getTicketsByUserId(userId) {
        const result = await Mongo.db
            .collection(collectionName)
            .find({ userId: new ObjectId(userId) })
            .toArray();

        return result;
    }

    async deleteTicket(ticketId){

        const objectId = new ObjectId(ticketId);

        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({_id: objectId})

        await Mongo.db
        .collection(vagasCollectionName)
        .updateOne(
            { _id: result.vagaId },
            {
                $inc: { ocupadas: -1 },
                $set: { available: true }
            }
        );

        return result
    }

}