import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

const database = new DatabasePostgres()

server.post('/reserva', async (request, reply) => {
  const { hotel, quarto, valor } = request.body

  await database.create({
    hotel,
    quarto,
    valor,
  })

  return reply.status(201).send()
})

server.get('/reserva', async (request, reply) => {
  const search = request.query.search

  const reservas = await database.list(search)

  return reservas
})

server.put('/reserva/:id', async (request, reply) => {
  const reservaId = request.params.id
  const { hotel, quarto, valor } = request.body

  await database.update(reservaId, {
    hotel,
    quarto,
    valor,
  })

  return reply.status(204).send()
})

server.delete('/reserva/:id', async (request, reply) => {
  const reservaId = request.params.id

  await database.delete(reservaId)

  return reply.status(204).send()
})

server.listen({
  port: 3333,
})
