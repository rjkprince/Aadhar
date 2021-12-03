"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comment }) {
      // define association here
      this.hasMany(Comment, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
          commentableType: "Image",
        },
      });
    }
  }
  Image.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image url must not be empty" },
          notEmpty: { msg: "Image url must not be empty" },
        },
      },
      height: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "images",
      modelName: "Image",
    }
  );
  return Image;
};
