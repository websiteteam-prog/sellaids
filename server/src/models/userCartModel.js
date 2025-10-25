import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";

export const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Product, key: "id" },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "carts",
    timestamps: false,
  }
);

// Associations
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });
Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });