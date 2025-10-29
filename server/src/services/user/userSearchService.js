import { Product } from "../../models/productModel.js";
import { Op, fn, col, where, literal } from "sequelize";

export const searchProductsService = async (query) => {
  const searchTerm = `%${query.toLowerCase()}%`;

  try {
    return await Product.findAll({
      where: {
        [Op.and]: [
          { is_active: true },
          { status: "approved" },
        ],
        [Op.or]: [
          where(fn("LOWER", col("product_group")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("product_type")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("brand")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("model_name")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("size")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("fit")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("product_condition")), { [Op.like]: searchTerm }),
          where(fn("LOWER", col("sku")), { [Op.like]: searchTerm }),
        ],
      },
      attributes: [
        "id",
        "product_group",
        "brand",
        "size",
        "fit",
        "selling_price",
        "front_photo",
        "sku",
      ],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
  } catch (error) {
    throw new Error(error.message || "Database error during search");
  }
};
