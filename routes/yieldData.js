const redis = require('../config/redis')

module.exports = async (req, res) => {
  // Fetch the 5-3 year curve from Redis
  const data = await redis.hgetallAsync('curve_3_5')
  
  // Parse the data string to JSON
  const yieldCurve = JSON.parse(data.data)

  return res.status(200).json(yieldCurve)
}