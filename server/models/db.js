import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { setup } from '../config/config';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = setup[env];

let poolConfig;
// check if env is production
if (config.use_env_variable) {
  poolConfig = new Pool({
    connectionString: process.env[config.use_env_variable],
  });
} else {
  poolConfig = new Pool(config);
}

const pool = poolConfig;

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
    "CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(20), password VARCHAR(255) NOT NULL, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW());CREATE TABLE IF NOT EXISTS rides(id SERIAL PRIMARY KEY, origin VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, date DATE NOT NULL, time TIME WITH TIME ZONE NOT NULL, seats int NOT NULL, userID int, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), FOREIGN KEY(userID) REFERENCES users(id));do $$ begin IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN CREATE TYPE status AS ENUM ('pending', 'accepted', 'rejected'); end if;end $$;CREATE TABLE IF NOT EXISTS requests(id SERIAL PRIMARY KEY, userID int, rideID int, offerStatus status DEFAULT('pending'), created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), FOREIGN KEY(userID) REFERENCES users(id), FOREIGN KEY(rideID) REFERENCES rides(id));",
  )
  .then((res) => {
    logger.log('info', res);
  })
  .catch((err) => {
    logger.log('error', err);
  });

export default pool;
