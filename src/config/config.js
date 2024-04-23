const dotenv = require('dotenv');
const program = require('../utils/commander.js');

const { mode } = program.opts();

dotenv.config({
  path: mode === 'production' ? './.env.production' : './.env.desarrollo',
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  port: process.env.PORT,
  node_env: process.env.NODE_ENV
};

module.exports = configObject;
