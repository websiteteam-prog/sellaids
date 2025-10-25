import { sequelize } from "../config/db.js";
import { User } from "./userModel.js";
import { Vendor } from "./vendorModel.js";
import { Category } from "./categoryModel.js";
import { Product } from "./productModel.js";
import { Order } from "./orderModel.js";

// Associations setup
[User, Vendor, Category, Product, Order].forEach((model) => {
  if (model.associate) model.associate();
});

export { sequelize, User, Vendor, Category, Product, Order };

console.log(sequelize.models.Order.associations);
console.log(sequelize.models.Product.associations);