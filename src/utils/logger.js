const winston = require('winston');
const configObject = require("../config/config.js");
const {node_env} = configObject;


const levels = {
  level: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'yellow',
    warning: 'blue',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  },
};


const loggerProduction = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.File({
      filename: './errors.log',
      level: 'info',
      
    }),
  ],
});

const loggerDesarrollo = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      
    }),
  ],
});


const logger = node_env === "production" ? loggerProduction : loggerDesarrollo;


const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${
    req.url
  } - ${new Date().toLocaleDateString()}
    `);
  next();
};

module.exports = addLogger;
