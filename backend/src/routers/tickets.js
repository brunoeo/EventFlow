import express from 'express'
import TicketsController from '../controllers/tickets.js'

const ticketsRouter = express.Router()
const ticketsController = new TicketsController()

ticketsRouter.get('/:userId', async (req, res) => {
    const { success, statusCode, body } = await ticketsController.getTicketsByUserId(req.params.userId)

    res.status(statusCode).send({success, statusCode, body})
})

ticketsRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await ticketsController.deleteTicket(req.params.id)

    res.status(statusCode).send({success, statusCode, body})
})

ticketsRouter.post('/', async (req, res) => {
    const response = await ticketsController.createTicket( req.body)

    const { success, statusCode, body } = response

    res.status(statusCode).send({ success, statusCode, body })
})

export default ticketsRouter

