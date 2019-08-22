const rp = require('request-promise')
const moment = require('moment')
const redis = require('../config/redis')
const { xmlToJson } = require('../config/xmlParser')

module.exports = async () => {
  // Fetch data from US Treasury API
  const yearToRequest = 2019
  const yieldApiRequestOptions = {
    uri: `${process.env.US_TREASURY_API}/DailyTreasuryYieldCurveRateData`,
    qs: `$filter=year(NEW_DATE) eq ${yearToRequest}`,
    json: false
  }

  let yieldApiresponse
  try {
    yieldApiresponse = await rp(yieldApiRequestOptions)
  } catch (e) {
    throw e
  }

  let jsonYieldData
  try {
    jsonYieldData = xmlToJson(yieldApiresponse)
  } catch (e) {
    throw e
  }

  // Convert data to clean format
  const formattedYields = []
  const entries = jsonYieldData.feed.entry
  for (let a = 0; a < entries.length; a++) {
    const entry = entries[a]

    const time = moment(entry.content['m:properties']['d:NEW_DATE'], 'YYYY-MM-DD hh:mm:ss')

    // Temporary fix, currently request not filtering by date correctly
    if (time.isBefore(moment().subtract(2, 'years'))) {
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

  console.log('Yield curves calculated and saved')
}

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