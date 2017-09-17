/**
 * Redis Cache Module
 */

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST)

module.exports = {
  /** Koa middleware function to check cache before continuing to endpoint handlers */
  async checkResponseCache (ctx, next) {
    const cachedResponse = await redis.get(ctx.path)
    if (cachedResponse) { // if cache hit
      ctx.body = JSON.parse(cachedResponse) // return the cached response
    } else {
      await  next() // only continue if result not in cache
    }
  },

  /** Koa middleware function to insert response into cache */
  async addResponseToCache (ctx, next) {
    await next() // wait until other handler have finished
    if (ctx.body && ctx.status === 200) { // if the request was successful
      //cache the response
      await redis.set(ctx.path, JSON.stringify(ctx.body))
    }
  }
}
