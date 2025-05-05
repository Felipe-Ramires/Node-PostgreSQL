import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import fastifyCors from '@fastify/cors' 
import dotenv from 'dotenv'

dotenv.config()

const server = fastify()

server.register(fastifyCors, {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

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
  host: '0.0.0.0', // Importante para acessar de outras redes
  port: 3333,
}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em ${address}`)
})