const { Command } = require('commander');
const program = new Command();

program.option('--mode <mode>', 'modo de trabajo', 'production');
program.parse();

module.exports = program;
