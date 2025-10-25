// import { User } from "../../models/userModel.js";
// import { Vendor } from "../../models/vendorModel.js";
// import { Product } from "../../models/productModel.js"
// import { Order } from "../../models/orderModel.js"
import { Payment } from "../../models/paymentModel.js"
import { Op } from "sequelize";
// import { sequelize } from "../../config/db.js";
import { sequelize, User, Vendor, Product, Order } from "../../models/index.js";


// admin dashboard Management
export const getAdminDashboardService = async () => {
  try {
    const totalUsers = await User.count();
    const totalVendors = await Vendor.count();
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    const [results] = await sequelize.query(`
      SELECT 
        o.product_id,
        p.brand,
        p.model_name,
        p.front_photo,
        SUM(o.quantity) AS totalSales
      FROM orders o
      JOIN products p ON o.product_id = p.id
      GROUP BY o.product_id
      ORDER BY totalSales DESC
      LIMIT 5;
    `);

    const topProducts = results.map(item => ({
      id: item.product_id,
      name: `${item.brand || "Unknown"} ${item.model_name || ""}`.trim(),
      img: item.front_photo || null,
      sales: Number(item.totalSales),
    }));

    return {
      total_users: totalUsers || 0,
      total_vendors: totalVendors || 0,
      total_products: totalProducts || 0,
      total_orders: totalOrders || 0,
      top_products: topProducts,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

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
// Get all vendors with search, status filter, pagination
export const getAllVendorsService = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;
  const where = {};

  // Search filter (name, email, phone)
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  // Status filter
  if (status && status.toLowerCase() !== "all") {
    where.status = status.toLowerCase();
  }

  const { count, rows } = await Vendor.findAndCountAll({
    where,
    offset,
    limit,
    order: [["created_at", "DESC"]],
    attributes: ["id", "name", "email", "phone", "status", "created_at"],
  });

  return { total: count, vendors: rows };
};

// Get vendor by ID
export const getVendorByIdService = async (id) => {
  return Vendor.findByPk(id);
};

// Update vendor status
export const updateVendorStatusService = async (id, status) => {
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status.toLowerCase())) return null;
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error("Vendor not found");
  vendor.status = status;
  await vendor.save();
  return vendor;
};


// vendor details page
export const getVendorById = async (id) => {
  const vendor = await Vendor.findByPk(id); // Sequelize method
  return vendor;
};

// product management Service
// Fetch all products with filters & pagination
export const getAllProductsService = async ({ search, status, page, limit }) => {
  const offset = (page - 1) * limit;

  const where = {};

  // Search filter
  if (search) {
    where[Op.or] = [
      { model_name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
    ];
  }

  // Status filter
  if (status && status.toLowerCase() !== "all") {
    where.status = status.toLowerCase();
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    offset,
    limit,
    order: [["created_at", "DESC"]],
    attributes: ["id", "sku", "model_name", "brand", "selling_price", "status"],
  });

  return { total: count, products: rows };
};

// Get product by ID
export const getProductByIdService = async (id) => {
  const product = await Product.findByPk(id);
  return product;
};

// Update product status (approve/reject)
export const updateProductStatusService = async (id, status) => {
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status.toLowerCase())) return null;

  const product = await Product.findByPk(id);
  if (!product) return null;

  product.status = status.toLowerCase();
  await product.save();
  return product;
};

// orders management Service
export const getAllOrdersService = async (filters) => {
  const { order_id, status, start_date, end_date } = filters;

  // 🔹 Build WHERE conditions dynamically
  let whereClause = "WHERE 1=1";
  if (order_id) whereClause += ` AND o.id = ${order_id}`;
  if (status && status !== "all") whereClause += ` AND o.status = '${status}'`;
  if (start_date && end_date) whereClause += ` AND o.created_at BETWEEN '${start_date}' AND '${end_date}'`;

  // 🔹 Orders query with User & Product
  const ordersQuery = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.product_id,
      p.model_name AS model_name,
      p.brand AS product_brand,
      p.selling_price,
      p.front_photo,
      o.quantity,
      o.total_price,
      o.status,
      o.payment_status,
      o.created_at,
      o.updated_at
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN products p ON o.product_id = p.id
    ${whereClause}
    ORDER BY o.created_at DESC
  `;

  const [orders] = await sequelize.query(ordersQuery);

  // 🔹 Status counts query
  const countsQuery = `
    SELECT status, COUNT(id) AS count
    FROM orders
    GROUP BY status
  `;
  const [countsRaw] = await sequelize.query(countsQuery);

  // 🔹 Total count
  const totalQuery = `SELECT COUNT(*) AS total FROM orders`;
  const [[{ total }]] = await sequelize.query(totalQuery);

  // 🔹 Prepare counts object
  const counts = { total, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  countsRaw.forEach(c => counts[c.status] = parseInt(c.count));

  return { orders, counts };
};

export const getOrderDetailsService = async (id) => {
  const orderQuery = `
    SELECT
      o.id AS order_id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,
      u.address_line AS user_address_line,
      u.city AS user_city,
      u.state AS user_state,
      u.pincode AS user_pincode,
      u.created_at AS user_created_at,
      
      o.total_price,
      o.payment_status,
      o.status,
      o.created_at AS order_created_at,
      o.updated_at AS order_updated_at,

      o_product.id AS product_id,
      o_product.vendor_id,
      o_product.category_id,
      o_product.product_group,
      o_product.product_type,
      o_product.product_condition,
      o_product.fit,
      o_product.size,
      o_product.size_other,
      o_product.product_color,
      o_product.brand,
      o_product.model_name,
      o_product.invoice,
      o_product.invoice_photo,
      o_product.needs_repair,
      o_product.repair_photo,
      o_product.original_box,
      o_product.dust_bag,
      o_product.additional_items,
      o_product.front_photo,
      o_product.back_photo,
      o_product.label_photo,
      o_product.inside_photo,
      o_product.button_photo,
      o_product.wearing_photo,
      o_product.more_images,
      o_product.purchase_price,
      o_product.selling_price,
      o_product.reason_to_sell,
      o_product.purchase_year,
      o_product.purchase_place,
      o_product.product_link,
      o_product.additional_info,
      o_product.status AS product_status,
      o_product.sku,
      o_product.is_active AS product_is_active,
      o_product.created_at AS product_created_at,
      o_product.updated_at AS product_updated_at

    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN products o_product ON o.id = o_product.id
    WHERE o.id = ${id}
    LIMIT 1
  `;

  const [result] = await sequelize.query(orderQuery);
  return result[0] || null;
};

// payment management
export const getPaymentsWithFiltersService = async ({ transaction_id, status, start_date, end_date }) => {
  try {
    const where = {};

    // Transaction ID search
    if (transaction_id) {
      where.transaction_id = { [Op.like]: `%${transaction_id}%` };
    }

    // Status filter
    if (status && status !== "all") {
      where.status = status;
    }

    // Date filter
    if (start_date && end_date) {
      where.payment_date = { [Op.between]: [new Date(start_date), new Date(end_date)] };
    } else if (start_date) {
      where.payment_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.payment_date = { [Op.lte]: new Date(end_date) };
    }

    const payments = await Payment.findAll({ where, order: [["payment_date", "DESC"]] });

    // if (!payments || payments.length === 0) throw new Error("No payments found");

    return payments;
  } catch (err) {
    throw new Error(err.message || "Error fetching payments");
  }
};