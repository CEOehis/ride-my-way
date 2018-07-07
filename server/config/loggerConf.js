import expressWinston from 'express-winston'; // eslint-disable-line
import winston from 'winston';

const devConfig = {
  transports: [
    new winston.transports.Console({
      json: true,
    }),
  ],
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: true,
};

const errorConfig = {
  transports: [
    new winston.transports.Console({
      colorize: true,
      json: true,
    }),
  ],
};

module.exports = {
  devConfig,
  errorConfig,
};
