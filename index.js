const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const dataController = require('./data/controller')

// Load the configuration into process.env.<value> variables
dotenv.config()

// Initialise the server
var app = express()

// Route to send chart data
app.use('/', require('./routes'))

// Setup templating with handlebars
app.use(express.static(path.join(__dirname, '/public')))
hbs.registerPartials(path.join(__dirname, '/views/partials'))
app.set('view engine', 'hbs')

// Set app port
app.set('port', process.env.PORT)

// Start the server, with it listening on the preset port
var server = app.listen(app.get('port'), async () => {
  console.log('Foresight server listening on port: ' + server.address().port)

  await dataController()
})
