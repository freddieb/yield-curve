const rp = require('request-promise')
const moment = require('moment')
const redis = require('../config/redis')
const logger = require('../config/logger')(__filename)
const { xmlToJson } = require('../config/xmlParser')

module.exports = async () => {
  // Create request options to fetch data from US Treasury API
  const yearToRequest = 2019
  const yieldApiRequestOptions = {
    uri: `${process.env.US_TREASURY_API}/DailyTreasuryYieldCurveRateData`,
    qs: `$filter=year(NEW_DATE) eq ${yearToRequest}`,
    json: false
  }

  // Fetch the data
  let yieldApiresponse
  try {
    yieldApiresponse = await rp(yieldApiRequestOptions)
  } catch (e) {
    throw e
  }

  // Parse the XML to JSON so that its easier to work with
  let jsonYieldData
  try {
    jsonYieldData = xmlToJson(yieldApiresponse)
  } catch (e) {
    throw e
  }

  // Convert data to clean format
  let formattedYields = []
  const entries = jsonYieldData.feed.entry
  for (let a = 0; a < entries.length; a++) {
    const entry = entries[a]

    // Convert the time in String format to a Moment object
    const time = moment(entry.content['m:properties']['d:NEW_DATE'], 'YYYY-MM-DD hh:mm:ss')

    // Temporary fix, currently the API request is not filtering by date correctly
    // Remove all data points before 4 years ago
    if (time.isBefore(moment().subtract(4, 'years'))) {
      continue
    }

    formattedYields.push({
      time,
      year2: entry.content['m:properties']['d:BC_2YEAR'],
      year3: entry.content['m:properties']['d:BC_3YEAR'],
      year5: entry.content['m:properties']['d:BC_5YEAR'],
      year10: entry.content['m:properties']['d:BC_10YEAR']
    })
  }

  const curve_3_5 = getYieldCurve_3_5(formattedYields)
  const curve_2_10 = getYieldCurve_2_10(formattedYields)

  await Promise.all([
    redis.hmsetAsync('curve_3_5', 'data', JSON.stringify(curve_3_5)),
    redis.hmsetAsync('curve_2_10', 'data', JSON.stringify(curve_2_10))
  ])

  logger.info('Yield curves calculated and saved')
}

/**
 * Calculate the 10 - 2 year yield curve spread from a set of yields over time
 * @param {Array<Object>} yields 
 * @returns {Array<Object>}
 */
const getYieldCurve_2_10 = yields => {
  const curve_2_10 = []
  for (let a = 0; a < yields.length; a++) {
    const diff = yields[a].year10 - yields[a].year2
    curve_2_10.push({
      time: yields[a].time,
      yield: diff
    })
  }

  return curve_2_10
}

/**
 * Calculate the 5 - 3 year yield curve spread from a set of yields over time
 * @param {Array<Object>} yields 
 * @returns {Array<Object>}
 */
const getYieldCurve_3_5 = yields => {
  const curve_3_5 = []
  for (let a = 0; a < yields.length; a++) {
    const diff = yields[a].year5 - yields[a].year3
    curve_3_5.push({
      time: yields[a].time,
      value: diff
    })
  }

  return curve_3_5
}