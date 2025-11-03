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
    // === STEP 1: Generate SKU ===
    const cleanGroup = (data.product_group || "XX")
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 2);

    const cleanType = (data.product_type || "XX")
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 2);

    const prefix = `SA/${cleanGroup}/${cleanType}`;

    // Find last product with same prefix
    const lastProduct = await Product.findOne({
      where: {
        sku: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("sku")),
          "LIKE",
          `${prefix.toLowerCase()}%`
        ),
      },
      order: [["id", "DESC"]],
      attributes: ["sku"],
    });

    // Generate next number
    let nextNumber = 1;
    if (lastProduct?.sku) {
      const match = lastProduct.sku.match(/(\d+)$/);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }

    const sku = `${prefix}/${String(nextNumber).padStart(2, "0")}`;

    // === STEP 2: Prepare Final Product Data ===
    const productData = {
      // Core fields
      vendor_id: vendorId,
      category_id: parseInt(data.category_id, 10),
      product_group: data.product_group?.trim() || null,
      product_type: data.product_type?.trim() || null,
      product_condition: data.product_condition || "new",
      fit: data.fit || "Regular",
      product_color: data.product_color?.trim() || null,
      brand: data.brand?.trim() || null,
      model_name: data.model_name?.trim() || null,

      // Yes/No fields
      invoice: data.invoice || "No",
      needs_repair: data.needs_repair || "No",
      original_box: data.original_box || "No",
      dust_bag: data.dust_bag || "No",

      // Optional text
      additional_items: data.additional_items?.trim() || null,
      reason_to_sell: data.reason_to_sell?.trim() || null,
      purchase_place: data.purchase_place?.trim() || null,
      product_link: data.product_link?.trim() || null,
      additional_info: data.additional_info?.trim() || null,

      // Prices & Year
      purchase_price: data.purchase_price
        ? parseInt(data.purchase_price, 10)
        : null,
      selling_price: data.selling_price
        ? parseInt(data.selling_price, 10)
        : null,
      purchase_year: data.purchase_year
        ? parseInt(data.purchase_year, 10)
        : null,

      // === SIZE LOGIC ===
      size: null,
      size_other: null,

      // === IMAGES ===
      front_photo: images.front_photo || null,
      back_photo: images.back_photo || null,
      label_photo: images.label_photo || null,
      inside_photo: images.inside_photo || null,
      button_photo: images.button_photo || null,
      wearing_photo: images.wearing_photo || null,
      invoice_photo: images.invoice_photo || null,
      repair_photo: images.repair_photo || null,
      more_images: images.more_images || [],

      // Generated
      sku,
      status: "pending",
      is_active: true,
    };

    // === HANDLE SIZE & size_other ===
    if (data.size && data.size !== "Other") {
      productData.size = data.size;
    } else if (data.size === "Other") {
      productData.size = "Other";
      if (data.size_other?.trim()) {
        productData.size_other = data.size_other.trim();
      }
    }
    // If size is empty or invalid → remains null

    // === STEP 3: Create Product in DB ===
    const product = await Product.create(productData);

    return product;
  } catch (error) {
    console.error("createProductService Error:", error);
    throw new Error(error.message || "Failed to create product");
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
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: {
          exclude: ["password", "reset_token", "reset_token_expires"],
        }, // security
      },
      {
        model: Category,
        as: "category",
      },
    ],
  });

  if (!product) return { product: null, related: [] };

  const relatedWhere = {
    id: { [Op.ne]: product.id },
    category_id: product.category_id,
    status: "approved",
    is_active: true,
  };

  const related = await Product.findAll({
    where: relatedWhere,
    limit: 6,
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: {
          exclude: ["password", "reset_token", "reset_token_expires"],
        },
      },
      {
        model: Category,
        as: "category",
      },
    ],
  });

  return { product, related };
};

export const getDashboardStatsService = async (vendorId) => {
  try {
    const totalProducts = await Product.count({
      where: { vendor_id: vendorId, is_active: true },
    });

    const pendingOrders = await Order.count({
      where: { order_status: "pending", vendor_id: vendorId },
    });

    const totalEarnings = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, payment_status: "success" },
    });

    const thisMonthSales = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        payment_status: "success",
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
    const completedEarning = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, payment_status: "success" },
    });

    const pendingEarning = await Payment.sum("vendor_earning", {
      where: { vendor_id: vendorId, payment_status: "pending" },
    });

    const failedOrRefundedEarning = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        payment_status: { [Op.in]: ["failed", "refunded"] },
      },
    });

    const thisMonthEarning = await Payment.sum("vendor_earning", {
      where: {
        vendor_id: vendorId,
        payment_status: "success",
        payment_date: {
          [Op.between]: [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(),
          ],
        },
      },
    });

    const monthlyEarningSummary = await Payment.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("payment_date"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("vendor_earning")), "total"],
      ],
      where: { vendor_id: vendorId, payment_status: "success" },
      group: ["month"],
      order: [[sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    return {
      completed_earning: completedEarning || 0,
      pending_earning: pendingEarning || 0,
      failed_or_refunded_earning: failedOrRefundedEarning || 0,
      this_month_earning: thisMonthEarning || 0,
      monthly_earning_summary: monthlyEarningSummary,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
