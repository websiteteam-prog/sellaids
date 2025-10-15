import { Op } from "sequelize";
import { Product } from "../../models/productModel.js";
import { Category } from "../../models/categoryModel.js";
import ProductType from "../../models/productType.js";

export const createProductService = async (vendorId, data, images) => {
  try {
    const productData = {
      ...data,
      vendor_id: vendorId,
      front_photo: images.front_photo || null,
      back_photo: images.back_photo || null,
      label_photo: images.label_photo || null,
      inside_photo: images.inside_photo || null,
      button_photo: images.button_photo || null,
      wearing_photo: images.wearing_photo || null,
      invoice_photo: images.invoice_photo || null,
      repair_photo: images.repair_photo || null,
      more_images: images.more_images || [],
    };

    const product = await Product.create(productData);
    return product;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchCategories = async (search = "") => {
  return await Category.findAll({
    where: {
      // status: "active",
      name: { [Op.like]: `%${search}%` },
    },
    order: [["name", "ASC"]],
  });
};

export const fetchProductTypesByCategory = async (category_id, search = "") => {
  return await ProductType.findAll({
    where: {
      category_id,
      status: "active",
      type_name: { [Op.like]: `%${search}%` },
    },
    order: [["type_name", "ASC"]],
  });
};
