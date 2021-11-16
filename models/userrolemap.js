"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoleMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRoleMap.init(
    {
      roleId: DataTypes.UUID,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "user_role_maps",
      modelName: "UserRoleMap",
    }
  );
  return UserRoleMap;
};
