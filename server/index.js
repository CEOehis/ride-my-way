import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import expressWinston from 'express-winston';
import morgan from 'morgan';
import winston from 'winston';

import logger from './utils/logger';
import router from './routes';

// import dotenv config at top level
dotenv.config();

// set up express app
const app = express();

// configure bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure logging
app.use(morgan('dev'));
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
      }),
    ],
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
  }),
);

// version api. add route handler
app.use('/api/v1', router);

// log errors
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        json: true,
      }),
    ],
  }),
);

app.use('/', (req, res) => {
  res.status(404).send('page not found');
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
