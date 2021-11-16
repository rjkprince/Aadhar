"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  Address.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Address name must not be empty" },
          notEmpty: { msg: "Address name must not be empty" },
        },
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Street name must not be empty" },
          notEmpty: { msg: "Street name must not be empty" },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "City name must not be empty" },
          notEmpty: { msg: "City name must not be empty" },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Country name must not be empty" },
          notEmpty: { msg: "Country name must not be empty" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "must associate with a valid user" },
          notEmpty: { msg: "must associate with a valid user" },
        },
      },
    },
    {
      sequelize,
      tableName: "addresses",
      modelName: "Address",
    }
  );
  return Address;
};
