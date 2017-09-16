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

// Respond with calculated area of kingdom, by id
router.get('/kingdoms/:kid/size', async ctx => {
  const kid = ctx.params.kid
  const result = await database.getRegionSize(kid)
  if (!result) { ctx.throw(404) }

  // Convert response (in square meters) to square kilometers
  const sqKm = result.size * (10 ** -6)
  ctx.body = sqKm
})

// respond with the number of castles in the kingdom , by id
router.get('/kingdoms/:id/castles', async ctx => {
  const regionId = ctx.params.id
  const result = await database.countCastles(regionId)
  ctx.body = result ? result.count : ctx.throw(404)
})

module.exports = router
