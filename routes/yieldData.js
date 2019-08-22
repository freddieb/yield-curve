const redis = require('../config/redis')

module.exports = async (req, res) => {
  const data = await redis.hgetallAsync('curve_3_5')
  const yieldCurve = JSON.parse(data.data)

  return res.status(200).json(yieldCurve)
}