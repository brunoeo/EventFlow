import ticketsDataAccess from '../dataAccess/tickets.js'
import { ok, serverError, notFound } from '../helpers/httpResponse.js'

export default class TicketsController {
    constructor() {
        this.dataAccess = new ticketsDataAccess()
    }

    async getTicketsByUserId(userId) {
        try {
            const tickets = await this.dataAccess.getTicketsByUserId(userId)

            if (!tickets || tickets.length === 0) {
                return notFound('No tickets found for the specified user.')
            }

            return ok(tickets)
        }catch (error) {
            return serverError(error)
        }
    }

    async deleteTicket(ticketId) {
        try{
            const result = await this.dataAccess.deleteTicket(ticketId)

            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }

    async createTicket(ticketData){
        try{
            const result = await this.dataAccess.createTicket(ticketData)
            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }

}