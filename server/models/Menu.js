const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Δημοφιλέστερα', 'Ορεκτικά', 'Κυρίως Πιάτα', 'Σαλάτες', 'Ποτά', 'Επιδόρπια']]
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = MenuItem;
