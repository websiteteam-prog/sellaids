import { Vendor } from "../../models/vendorModel.js";
import { Op } from "sequelize";

export const getAllVendors = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;

  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }
  if (status && status !== "All") {
    where.status = status;
  }

  const { count, rows } = await Vendor.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return { total: count, vendors: rows };
};
