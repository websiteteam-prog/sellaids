import { Product } from "../../models/productModel.js";

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
