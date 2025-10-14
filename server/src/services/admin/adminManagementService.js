import { User } from "../../models/userModel.js";
import { Vendor } from "../../models/vendorModel.js";
import { Op } from "sequelize";

// user management Service
export const getAllUsers = async ({ search, page, limit }) => {
  const offset = (page - 1) * limit;

  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const { count, rows } = await User.findAndCountAll({
    where,
    offset,
    limit,
    order: [["created_at", "DESC"]],
  });

  return { total: count, users: rows };
};

// vendor management Service
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
    order: [["created_at", "DESC"]],
  });

  return { total: count, vendors: rows };
};

// product management Service
// export const getAllProducts = async ({ search, page, limit }) => {
//   const offset = (page - 1) * limit;

//   const where = search
//     ? {
//         [Op.or]: [
//           { name: { [Op.like]: `%${search}%` } },
//           { email: { [Op.like]: `%${search}%` } },
//           { phone: { [Op.like]: `%${search}%` } },
//         ],
//       }
//     : {};

//   const { count, rows } = await Product.findAndCountAll({
//     where,
//     offset,
//     limit,
//     order: [["created_at", "DESC"]],
//   });

//   return { total: count, users: rows };
// };