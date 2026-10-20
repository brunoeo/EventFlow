import express from 'express'
import EventsController from '../controllers/events.js'

const eventsRouter = express.Router()
const eventsController = new EventsController()

eventsRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await eventsController.getEvents()

    res.status(statusCode).send({success, statusCode, body})
})

eventsRouter.get('/available', async (req, res) => {
    const { success, statusCode, body } = await eventsController.getAvailableEvents()
    res.status(statusCode).send({success, statusCode, body})
})

eventsRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await eventsController.deleteEvent(req.params.id)

    res.status(statusCode).send({success, statusCode, body})
})

eventsRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await eventsController.updateEvent(req.params.id, req.body)
    res.status(statusCode).send({success, statusCode, body})
})

eventsRouter.post('/', async (req, res) => {
    const response = await eventsController.createEvent(req.body)

    const { success, statusCode, body } = response

    res.status(statusCode).send({ success, statusCode, body })
})

eventsRouter.post('/:id/vagas', async (req, res) => {
    const { success, statusCode, body } = await eventsController.createVagas(req.params.id, req.body)
    res.status(statusCode).send({success, statusCode, body})
})

eventsRouter.put('/vagas/:vagaId', async (req, res) => {
    const { success, statusCode, body } = await eventsController.updateVaga(req.params.id, req.params.vagaId, req.body)
    res.status(statusCode).send({success, statusCode, body})
})

eventsRouter.delete('/vagas/:vagaId', async (req, res) => {
    const { success, statusCode, body } = await eventsController.deleteVaga(req.params.vagaId)
    res.status(statusCode).send({success, statusCode, body})
})

export default eventsRouter

