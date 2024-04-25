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
console.log('MONGO_URL:', configObject.mongo_url);
console.log('ADMIN_EMAIL:', configObject.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD:', configObject.ADMIN_PASSWORD);
console.log('GITHUB_CLIENT_ID:', configObject.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', configObject.GITHUB_CLIENT_SECRET);
console.log('PORT:', configObject.port);
console.log('NODE_ENV:', configObject.node_env);







module.exports = configObject;
