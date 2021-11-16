"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AadharCardDetail, Address, UserRole }) {
      // define association here
      this.hasOne(AadharCardDetail, { foreignKey: "userId" });
      this.hasMany(Address, { foreignKey: "userId" });
      this.belongsToMany(UserRole, {
        foreignKey: "userId",
        through: "user_role_maps",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "User name must not be empty" },
          notEmpty: { msg: "User name must not be empty" },
        },
      },
      country_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Country code must not be empty" },
          notEmpty: { msg: "Country code must not be empty" },
        },
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
