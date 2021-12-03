"use strict";
const { Model } = require("sequelize");

const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`;
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    getCommentable(options) {
      if (!this.commentableType) return Promise.resolve(null);
      const mixinMethodName = `get${uppercaseFirst(this.commentableType)}`;
      return this[mixinMethodName](options);
    }

    static associate({ Image, Video }) {
      // define association here
      this.belongsTo(Image, { foreignKey: "commentableId" });
      this.belongsTo(Video, { foreignKey: "commentableId" });
      this.addHook("afterFind", (findResult) => {
        if (!Array.isArray(findResult)) findResult = [findResult];
        for (const instance of findResult) {
          if (
            instance.commentableType === "Image" &&
            instance.Image !== undefined
          ) {
            instance.commentable = instance.Image;
          } else if (
            instance.commentableType === "Video" &&
            instance.Video !== undefined
          ) {
            instance.commentable = instance.Video;
          }
          // To prevent mistakes:
          delete instance.Image;
          delete instance.dataValues.Image;
          delete instance.Video;
          delete instance.dataValues.Video;
        }
      });
    }

    toJSON() {
      return {
        ...this.get(),
        commentableId: undefined,
        commentableType: undefined,
      };
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Comment text must not be empty" },
          notEmpty: { msg: "Comment text must not be empty" },
        },
      },
      commentableType: DataTypes.STRING,
      commentableId: DataTypes.UUID,
    },
    {
      sequelize,
      tableName: "comments",
      modelName: "Comment",
    }
  );
  return Comment;
};
