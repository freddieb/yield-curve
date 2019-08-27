const path = require('path')
const { createLogger, format, transports } = require('winston')

// Creates instance to format log messages
const logger = caller => {
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.label({ label: path.basename(caller) }),
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
      format.printf(
        info => {
          if (info instanceof Error) {
            return `${info.timestamp} ${info.level} [${info.label}]: ${info.message} : ${info.stack}`
          }
          return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        }
      )
    ),
    transports: [new transports.Console()]
  })
}

module.exports = logger
