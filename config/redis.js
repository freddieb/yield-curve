const redis = require('redis')
const bluebird = require('bluebird')

const client = redis.createClient()

module.exports = bluebird.promisifyAll(client)