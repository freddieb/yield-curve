const express = require('express')
const router = express.Router()

router.get('/', require('./home.js'))
router.get('/data', require('./yieldData.js'))

module.exports = router