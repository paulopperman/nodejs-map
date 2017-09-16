/**
 * Postgres DB Module
 */

const postgres = require('pg')
const log = require('./logger')
const connectionString = process.env.DATABASE_URL

// initialize postgres client
const client = new postgres.Client({ connectionString })

// connect to the database
client.connect().then(() => {
  log.info(`Connected To ${client.database} at ${client.host}:${client.port}`)
}).catch(log.error)

module.exports = {
  /** Query the current time **/
  queryTime: async () => {
    const result = await client.query('SELECT NOW() as now')
    return result.rows[0]
  }
}
