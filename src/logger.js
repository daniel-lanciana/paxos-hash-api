import { createLogger, transports, format } from 'winston'

const LEVEL = process.env.LOG_LEVEL || 'info';
const MAX_LOG_SIZE_IN_MB = (process.env.MAX_LOG_SIZE_IN_MB || 10) * 1000000;

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/activity.log',
      level:'info',
      maxsize: MAX_LOG_SIZE_IN_MB
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      handleExceptions: true,
      maxsize: MAX_LOG_SIZE_IN_MB
    })
  ],
  level: LEVEL
});

export default logger;
