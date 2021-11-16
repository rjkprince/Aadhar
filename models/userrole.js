"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsToMany(User, {
        as: "users",
        foreignKey: "roleId",
        through: "user_role_maps",
      });
    }
  }
  UserRole.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "User role must not be empty" },
          notEmpty: { msg: "User role must not be empty" },
        },
      },
    },
    {
      sequelize,
      tableName: "user_roles",
      modelName: "UserRole",
    }
  );
  return UserRole;
};
