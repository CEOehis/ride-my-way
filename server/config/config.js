module.exports = {
  development: {
    username: 'postgres',
    host: '127.0.0.1',
    database: 'ridemyway_db',
    password: 'postgres',
    port: 5432,
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    host: '127.0.0.1',
    database: 'ridemyway_test',
    password: 'postgres',
    port: 5432,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
};
