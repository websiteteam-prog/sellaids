import * as yup from "yup";

export const productSchema = yup.object().shape({
  category_id: yup.number().required("Category is required"),
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
  product_color: yup.string().required("Product color is required"),
  brand: yup.string().required("Brand is required"),
  model_name: yup.string().required("Model name is required"),
  invoice: yup.string().oneOf(["Yes", "No"]).required(),
  needs_repair: yup.string().oneOf(["Yes", "No"]).required(),
  original_box: yup.string().oneOf(["Yes", "No"]).required(),
  dust_bag: yup.string().oneOf(["Yes", "No"]).required(),
  purchase_price: yup.number().required("Purchase price is required"),
  selling_price: yup.number().required("Selling price is required"),
  reason_to_sell: yup.string().required("Reason to sell is required"),
  purchase_year: yup.number().required("Purchase year is required"),
  purchase_place: yup.string().required("Purchase place is required"),
});
