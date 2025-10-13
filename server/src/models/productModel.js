import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Vendor } from "./Vendor.js";
import { Category } from "./Category.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vendor,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    product_group: DataTypes.STRING(100),
    product_category: DataTypes.STRING(100),
    product_type: DataTypes.STRING(100),
    product_condition: {
      type: DataTypes.ENUM("new", "like_new", "used", "damaged"),
      defaultValue: "new",
    },
    fit: {
      type: DataTypes.ENUM("Slim", "Regular", "Loose", "Oversized", "Tailored", "Other"),
      defaultValue: "Regular",
    },
    fit_other: DataTypes.STRING(100),
    size: {
      type: DataTypes.ENUM("XS", "S", "M", "L", "XL", "XXL", "Other"),
      defaultValue: "M",
    },
    size_other: DataTypes.STRING(100),
    invoice: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    invoice_photo: DataTypes.STRING(255),
    needs_repair: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    repair_details: DataTypes.TEXT,
    repair_photo: DataTypes.STRING(255),
    original_box: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    dust_bag: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    additional_items: DataTypes.TEXT,
    front_photo: DataTypes.TEXT,
    back_photo: DataTypes.TEXT,
    label_photo: DataTypes.TEXT,
    inside_photo: DataTypes.TEXT,
    button_photo: DataTypes.TEXT,
    wearing_photo: DataTypes.TEXT,
    more_images: DataTypes.JSON,
    purchase_price: DataTypes.DECIMAL(10,2),
    selling_price: DataTypes.DECIMAL(10,2),
    reason_to_sell: DataTypes.TEXT,
    purchase_year: DataTypes.INTEGER,
    purchase_place: DataTypes.STRING(100),
    product_link: DataTypes.STRING(255),
    additional_info: DataTypes.TEXT,
    seller_info: DataTypes.TEXT,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    agree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("pending","approved","rejected"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

// Associations
Product.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });