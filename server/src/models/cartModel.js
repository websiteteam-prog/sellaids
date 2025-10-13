import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Product } from "./Product.js";

export const ProductCard = sequelize.define(
  "ProductCard",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: { model: Product, key: "id" },
      onDelete: "CASCADE",
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    main_image: DataTypes.STRING(255),
    selling_price: DataTypes.DECIMAL(10,2),
    rating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "product_cards", timestamps: false }
);

ProductCard.belongsTo(Product, { foreignKey: "product_id", as: "product" });