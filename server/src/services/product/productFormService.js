import { Op, Sequelize } from "sequelize";
import { sequelize } from "../../config/db.js";
import { Product } from "../../models/productModel.js";
import { Category } from "../../models/categoryModel.js";
import ProductType from "../../models/productType.js";
import { Order } from "../../models/orderModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Vendor } from "../../models/vendorModel.js";

export const createProductService = async (vendorId, data, images) => {
  try {
     // Step 1: Clean strings and generate prefix (ignore special chars)
    const cleanGroup = (data.product_group || "XX").replace(/[^a-zA-Z]/g, "").toUpperCase();
    const cleanType = (data.product_type || "XX").replace(/[^a-zA-Z]/g, "").toUpperCase();
    const prefix = `SA/${cleanGroup.slice(0, 2)}/${cleanType.slice(0, 2)}`;

    // Step 2: Find last SKU with that prefix
    const lastProduct = await Product.findOne({
      where: {
        sku: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("sku")),
          "LIKE",
          `${prefix.toLowerCase()}%`
        ),
      },
      order: [["id", "DESC"]],
    });

    // Step 3: Determine next number
    let nextNumber = 1;
    if (lastProduct && lastProduct.sku) {
      const match = lastProduct.sku.match(/(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Step 4: Build final SKU
    const sku = `${prefix}/${String(nextNumber).padStart(2, "0")}`;

    // Step 5: Prepare data
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
      sku,
    };

    // Step 6: Create product
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

export const getAllProductsService = async (query, vendorId, isAdmin) => {
  const { search, category_id, page = 1, limit = 10 } = query;

  const where = { is_active: true };

  // Vendor filter for non-admin users
  if (vendorId && !isAdmin) {
    where.vendor_id = vendorId;
  }

  if (category_id) {
    where.category_id = category_id;
  }

  if (search) {
    where[Op.or] = [
      { model_name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    offset,
    limit: parseInt(limit),
    order: [["created_at", "DESC"]],
    attributes: [
      "id",
      "sku",
      "product_group",
      "brand",
      "model_name",
      "selling_price",
      "status",
      "front_photo",
    ],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"], 
      },
      {
        model: Vendor,
        as: "vendor",
        attributes: ["id", "name"], 
      },
    ],
  });

  return {
    total: count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    products: rows,
  };
};

export const getProductByIdService = async (id) => {
  const product = await Product.findOne({
    where: { id },
    include: ["vendor", "category"],
  });

  return product;
};

export const getDashboardStatsService = async (vendorId) => {
  try {
    const totalProducts = await Product.count({ where: { vendor_id: vendorId, is_active: true } });

    const pendingOrders = await Order.count({ where: { order_status: "pending" } });

    const totalEarnings = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, status: "success" },
    });

    const thisMonthSales = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        status: "success",
        payment_date: {
          [Op.between]: [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(),
          ],
        },
      },
    });

    return {
      total_products: totalProducts || 0,
      pending_orders: pendingOrders || 0,
      total_earnings: totalEarnings || 0,
      this_month_sales: thisMonthSales || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getEarningsStatsService = async (vendorId) => {
  try {
    const totalEarning = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, status: "success" },
    });

    const pendingEarnings = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, status: "pending" },
    });

    const failedEarnings = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, status: "failed" },
    });

    const thisMonthEarning = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        status: "success",
        payment_date: {
          [Op.between]: [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(),
          ],
        },
      },
    });

    const monthlyEarnings = await Payment.findAll({
      attributes: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("payment_date"), "%Y-%m"), "month"],
        [sequelize.fn("SUM", sequelize.col("vendor_earning")), "total"],
      ],
      where: { vendor_id: vendorId, status: "success" },
      group: ["month"],
      order: [[sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    return {
      total_earning: totalEarning || 0,
      this_month_earning: thisMonthEarning || 0,
      pending_earning: pendingEarnings || 0,
      failed_earning: failedEarnings || 0,
      monthly_earning_graph: monthlyEarnings,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};