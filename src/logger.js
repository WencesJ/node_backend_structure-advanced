const winston = require('winston');
  
const path = require('path');

const consoleFormat = winston.format.combine(
    winston.format.colorize({
      colors: { info: 'blue', error: 'red', warn: 'yellow' },
    }),
    winston.format.timestamp(),
    // winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} :: [ ${info.level} ] -:- ${info.message}`
    )
);

const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
);

const fileFormat = {
    maxsize: Infinity,
    format: jsonFormat,
    colorize: true
}

const loggers = {
    infos: winston.createLogger({
      level: 'info',
      transports: [
            new winston.transports.Console({
                format: consoleFormat,
            }),
            new winston.transports.File({
                filename: `${path.join(__dirname, '/logs/app-info.log')}`,
                ...fileFormat
            })
        ],
    }),

    errors: winston.createLogger({
      level: 'error',
      transports: [
            new winston.transports.Console({
                format: consoleFormat,
            }),
            new winston.transports.File({ 
                filename: `${path.join(__dirname, '/logs/app-error.log')}`,
                ...fileFormat
            })
        ],
    }),

    warns: winston.createLogger({
        level: 'warn',
        transports: [
              new winston.transports.Console({
                  format: consoleFormat,
              }),
              new winston.transports.File({ 
                  filename: `${path.join(__dirname, '/logs/app-warn.log')}`,
                  ...fileFormat
              })
          ],
      }),

    exceptions: winston.createLogger({
        level: 'error',
        transports: [
              new winston.transports.File({ 
                  filename: `${path.join(__dirname, '/logs/app-exceptions.log')}`,
                  ...fileFormat
              })
          ],
      }),
    
    rejections: winston.createLogger({
        level: 'error',
        transports: [
              new winston.transports.File({ 
                  filename: `${path.join(__dirname, '/logs/app-rejections.log')}`,
                  ...fileFormat
              })
          ],
      }),
    
      logs: winston.createLogger({
        transports: [
              new winston.transports.Console({
                  format: consoleFormat,
              })
          ],
      })
};

const logger = {
    info: message => {
        return loggers.infos.info(message);
    },
    error: message => {
        return loggers.errors.error(message);
    },
    warn: message => {
        return loggers.warns.warn(message);
    },
    exception: message => {
        return loggers.exceptions.error(message);
    },
    rejection: message => {
        return loggers.rejections.error(message);
    },
    log: (level, message) => {
        return loggers.logs.log(level, message);
    }
}

module.exports = logger;
