import eventsDataAccess from '../dataAccess/events.js'
import { ok, serverError, notFound } from '../helpers/httpResponse.js'

export default class EventsController {
    constructor() {
        this.dataAccess = new eventsDataAccess()
    }

    async getEvents() {
        try {
            const events = await this.dataAccess.getEvents()

            return ok(events)
        }catch (error) {
            return serverError(error)
        }
    }

    async getAvailableEvents() {
        try {
            const events = await this.dataAccess.getAvailableEvents()

            return ok(events)
        }catch (error) {
            return serverError(error)
        }
    }

    async deleteEvent(eventId) {
        try{
            const result = await this.dataAccess.deleteEvent(eventId)
            if(!result){
                return notFound()
            }

            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }

    async updateEvent(eventId, eventData){
        try{
            const result = await this.dataAccess.updateEvent(eventId, eventData)                          
            if(!result){
                return notFound()
            }
            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }

    async createEvent(eventData){
        try{
            const result = await this.dataAccess.createEvent(eventData)
            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }

    async createVagas(eventId, vagasData) {
        try {
            const result = await this.dataAccess.createVagas(eventId, vagasData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async updateVaga(vagaId, vagasData) {
        try {
            const result = await this.dataAccess.updateVaga(vagaId, vagasData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async deleteVaga(vagaId) {
        try {
            const result = await this.dataAccess.deleteVaga(vagaId);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }
}