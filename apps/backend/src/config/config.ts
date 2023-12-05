export default () => ({
  port: process.env.MAIN_PORT,
  postgresHost: process.env.DB_HOST,
  postgresPort: process.env.DB_PORT,
  postgresUser: process.env.DB_USER,
  postgresDB: process.env.DB_NAME,
  postgresPassword: process.env.DB_PASS,
  secret: process.env.JWT_ACCESS_SECRET,
});
