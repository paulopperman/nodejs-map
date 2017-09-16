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
  },

  /** Query the locations as geojson, for a given type, using ST_AsGeoJSON from PostGIS */
  getLocations: async (type) => {
    const locationQuery = `
    SELECT ST_AsGeoJSON(geog), name, type, gid
    FROM locations
    WHERE UPPER(type) = UPPER($1);`
    const result = await client.query(locationQuery, [ type ])
    return result.rows
  },

  /** Query the kingdom boundaries */
  getKingdomBoundaries: async () => {
    const boundaryQuery = `
    SELECT ST_AsGeoJSON(geog), name, gid
    FROM kingdoms;`
    const result = await client.query(boundaryQuery)
    return result.rows
  }
}
