const redis = require('redis')
const bluebird = require('bluebird')

// Connect to Redis
const client = redis.createClient(process.env.REDIS_URL)

// Promisify library, allowing use of async functions
module.exports = bluebird.promisifyAll(client)