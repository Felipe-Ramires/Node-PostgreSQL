import pg from 'pg'
import { randomUUID } from 'node:crypto'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export class DatabasePostgres {
  async list(search) {
    let result

    if (search) {
      result = await pool.query(
        'SELECT * FROM reservas WHERE quarto ILIKE $1',
        [`%${search}%`]
      )
    } else {
      result = await pool.query('SELECT * FROM reservas')
    }

    return result.rows
  }

  async create(reserva) {
    const reservaId = randomUUID()
    const { hotel, quarto, valor } = reserva

    await pool.query(
      'INSERT INTO reservas (id, hotel, quarto, valor) VALUES ($1, $2, $3, $4)',
      [reservaId, hotel, quarto, valor]
    )
  }

  async update(id, reserva) {
    const { hotel, quarto, valor } = reserva

    await pool.query(
      'UPDATE reservas SET hotel = $1, quarto = $2, valor = $3 WHERE id = $4',
      [hotel, quarto, valor, id]
    )
  }

  async delete(id) {
    await pool.query('DELETE FROM reservas WHERE id = $1', [id])
  }
}
