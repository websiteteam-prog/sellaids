import { User } from "../../models/userModel.js";
import { Op } from "sequelize";

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
    order: [["createdAt", "DESC"]],
  });

  return { total: count, users: rows };
};
