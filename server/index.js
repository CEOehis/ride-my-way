import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import expressWinston from 'express-winston';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import logger from './utils/logger';
import router from './routes';
import { devConfig, errorConfig } from './config/loggerConf';

// import dotenv config at top level
dotenv.config();

// set up express app
const app = express();

// compression and header security middleware
app.use(compression());
app.use(helmet());
app.use(cors());

// configure bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure logging
app.use(morgan('dev'));
app.use(
  app.get('env') === 'development'
    ? expressWinston.logger(devConfig)
    : (req, res, next) => {
      next();
    },
);

// serve documentation
app.use('/docs', express.static(path.join(__dirname, '../docs')));

// version api. add route handler
app.use('/api/v1', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// log errors log error stack trace in development
app.use(
  app.get('env') === 'development'
    ? expressWinston.errorLogger(errorConfig)
    : (req, res, next) => {
      next();
    },
);

// error handler
/* eslint-disable-next-line no-unused-vars */
app.use(({ status, message }, req, res, next) => {
  res.status(status || 500);
  res.json({
    status: 'error',
    message,
  });
});

// configure port and listen for requests
const port =
  parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) ||
  1337;
const server = app.listen(port, () => {
  logger.log(
    'info',
    'Server started...listening for requests on port %s',
    port,
  );
});

export default app;
exports.server = server;
