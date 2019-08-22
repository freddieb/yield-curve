const redis = require('redis')
const bluebird = require('bluebird')

const client = redis.createClient(process.env.REDIS_URL)

module.exports = bluebird.promisifyAll(client)