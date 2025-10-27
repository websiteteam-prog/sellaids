import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Vendor } from "./vendorModel.js";
import { Category } from "./categoryModel.js";

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
    product_type: DataTypes.STRING(100),
    product_condition: {
      type: DataTypes.ENUM("new", "like_new", "used", "damaged"),
      defaultValue: "new",
    },
    fit: {
      type: DataTypes.ENUM("Slim", "Regular", "Loose", "Oversized", "Tailored", "Other"),
      defaultValue: "Regular",
    },
    size: {
      type: DataTypes.ENUM("XS", "S", "M", "L", "XL", "XXL", "Other"),
      defaultValue: "M",
    },
    size_other: DataTypes.STRING(100),
    product_color: DataTypes.STRING(100),
    brand: DataTypes.STRING(100),
    model_name: DataTypes.STRING(100),
    invoice: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    invoice_photo: DataTypes.STRING(255),
    needs_repair: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
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
    purchase_price: DataTypes.INTEGER,
    selling_price: DataTypes.INTEGER,
    reason_to_sell: DataTypes.TEXT,
    purchase_year: DataTypes.INTEGER,
    purchase_place: DataTypes.STRING(100),
    product_link: DataTypes.STRING(255),
    additional_info: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
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