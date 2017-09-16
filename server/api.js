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
module.exports = router
