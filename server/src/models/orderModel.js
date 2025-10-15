import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Product } from "./Product.js";

export const Order = sequelize.define(
  "Order",
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
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: {
      type: DataTypes.ENUM("pending","processing","shipped","delivered","cancelled"),
      defaultValue: "pending",
    },
    payment_status: {
      type: DataTypes.ENUM("pending","paid","failed"),
      defaultValue: "pending",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "orders", timestamps: false }
);

Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.belongsTo(Product, { foreignKey: "product_id", as: "product" });