import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../utils/logger';

dotenv.config();

const pool = new Pool();
pool
  .connect()
  .then(() => {
    logger.log('info', 'Connection to database established successfully');
  })
  .catch((e) => {
    logger.log('error', 'Connection to database unsuccessful', e);
  });

// set up tables
pool
  .query(
    'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(20), password VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE NOT NULL, updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW());CREATE TABLE IF NOT EXISTS rides(id SERIAL PRIMARY KEY, origin VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, seats int NOT NULL, userID int, created_at TIMESTAMP WITH TIME ZONE NOT NULL, updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), FOREIGN KEY(userID) REFERENCES users(id));CREATE TABLE IF NOT EXISTS requests(id SERIAL PRIMARY KEY, userID int, rideID int, created_at TIMESTAMP WITH TIME ZONE NOT NULL, updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), FOREIGN KEY(userID) REFERENCES users(id), FOREIGN KEY(rideID) REFERENCES rides(id));',
  )
  .then((res) => {
    logger.log('info', res);
  })
  .catch((err) => {
    logger.log('error', err);
  });

export default pool;
