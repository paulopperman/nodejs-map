/**
 * API Routes Module
 */

const Router = require('koa-router')
const database = require('./database')
const cache = require('./cache')
const joi = require('joi')
const validate = require('koa-joi-validate')

const router = new Router()

//Hello world test endpoint
router.get('/hello', async ctx => {
  ctx.body = "Hello World"
})

// Get time from database
router.get('/time', async ctx => {
  const result = await database.queryTime()
  ctx.body = result
})

// get locations as geojson
router.get('/locations/:type', async ctx => {
  const type = ctx.params.type
  const results = await database.getLocations(type)
  if (results.length === 0) {ctx.throw(404)}

  // add row metadata as geojson properties
  const locations = results.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = { name: row.name, type: row.type, id: row.gid}
    return geojson
  })

  ctx.body = locations
})

// Return the boundary geojson for all kingdoms
router.get('/kingdoms', async ctx => {
  const results = await database.getKingdomBoundaries()
  if (results.length === 0) { ctx.throw(404) }

  // add row metatdata as geojson properties
  const boundaries = results.map((row) => {
    let geojson = JSON.parse(row.st_asgeojson)
    geojson.properties = {name: row.name, id: row.gid}
    return geojson
  })

  ctx.body = boundaries
})

module.exports = router
