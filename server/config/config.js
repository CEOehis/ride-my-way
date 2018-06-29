exports.setup = {
  development: {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'ridemywaydb',
    password: 'postgres',
    port: 5432,
  },
  test: {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'ridemyway_test',
    password: 'postgres',
    port: 5432,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
};
