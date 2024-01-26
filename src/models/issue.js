const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Assuming you have Sequelize initialized

class Issue extends Model {
  // Define the model schema in the constructor
  constructor(values, options) {
    super(values, options);
  }
}

// Define the model attributes (column definitions)
Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    githubIssueUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'issue', // Specify the model name if it's different from the class name
    tableName: 'issues', // Specify the table name if it's different from the model name
    timestamps: true, // Set timestamps (createdAt and updatedAt)
  }
);

module.exports = Issue;
