const path = require('path')
require('dotenv').config()


module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PW,
      port: process.env.POSRGRES_PORT,
      database: process.env.POSTGRES_DB,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },
};