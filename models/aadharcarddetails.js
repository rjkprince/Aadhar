"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AadharCardDetail extends Model {
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
  AadharCardDetail.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      aadharNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Aadhar number must not be empty" },
          notEmpty: { msg: "Aadhar number must not be empty" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        unique: { msg: "user already has an aadhar" },
        allowNull: false,
        validate: {
          notNull: { msg: "must associate with a valid user" },
          notEmpty: { msg: "must associate with a valid user" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Aadhar name must not be empty" },
          notEmpty: { msg: "Aadhar name must not be empty" },
        },
      },
    },
    {
      sequelize,
      tableName: "aadhars",
      modelName: "AadharCardDetail",
    }
  );
  return AadharCardDetail;
};
