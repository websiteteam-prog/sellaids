import * as yup from "yup";
import { Category } from "../models/categoryModel.js";
import { Product } from "../models/productModel.js";

// Custom async validation to check category existence
const categoryExists = async (category_id) => {
  const category = await Category.findByPk(category_id);
  return !!category;
};

// Custom async validation to check duplicate product (by model_name + brand + vendor)
const productUnique = async (value, vendorId) => {
  const existing = await Product.findOne({
    where: { vendor_id: vendorId, model_name: value.model_name, brand: value.brand },
  });
  return !existing;
};

export const productSchema = yup.object().shape({
  category_id: yup
    .number()
    .required("Category is required")
    .test("category-exists", "Category does not exist", categoryExists),
  product_group: yup.string().required("Product group is required"),
  product_type: yup.string().required("Product type is required"),
  product_condition: yup
    .string()
    .oneOf(["new", "like_new", "used", "damaged"])
    .required(),
  fit: yup
    .string()
    .oneOf(["Slim", "Regular", "Loose", "Oversized", "Tailored", "Other"])
    .required(),
  size: yup
    .string()
    .oneOf(["XS", "S", "M", "L", "XL", "XXL", "Other"])
    .required(),
  size_other: yup.string().nullable(),
  product_color: yup.string().required("Product color is required"),
  brand: yup.string().required("Brand is required"),
  model_name: yup
    .string()
    .required("Model name is required")
    .test(
      "unique-product",
      "Product with this brand and model already exists",
      async function (value) {
        const vendorId = this.options.context.vendorId;
        const existing = await Product.findOne({
          where: { vendor_id: vendorId, model_name: value, brand: this.parent.brand },
        });
        return !existing;
      }
    ),
  invoice: yup.string().oneOf(["Yes", "No"]).required(),
  needs_repair: yup.string().oneOf(["Yes", "No"]).required(),
  original_box: yup.string().oneOf(["Yes", "No"]).required(),
  dust_bag: yup.string().oneOf(["Yes", "No"]).required(),
  purchase_price: yup.number().required("Purchase price is required"),
  selling_price: yup.number().required("Selling price is required"),
  reason_to_sell: yup.string().required("Reason to sell is required"),
  purchase_year: yup.number().required("Purchase year is required"),
  purchase_place: yup.string().required("Purchase place is required"),
  additional_items: yup.string().required(),
  product_link: yup.string().url().required(),
  additional_info: yup.string().required(),
});
