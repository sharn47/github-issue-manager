const { Sequelize } = require("sequelize");
const Issue = require('./models/issue');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  models: [Issue], // Pass instances of Sequelize model classes, not just class definitions
});

module.exports = sequelize;
