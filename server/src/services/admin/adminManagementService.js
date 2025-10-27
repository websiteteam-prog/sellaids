import { User } from "../../models/userModel.js";
import { Vendor } from "../../models/vendorModel.js";
import { Product } from "../../models/productModel.js"
import { Order } from "../../models/orderModel.js"
import { Payment } from "../../models/paymentModel.js"
import { Op } from "sequelize";
import { sequelize } from "../../config/db.js";


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
export const getAllOrdersService = async ({ order_id, status, start_date, end_date, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  // Build WHERE clause dynamically
  const where = {};
  if (order_id) where.id = order_id;
  if (status && status !== "all") where.order_status = status;

  if (start_date && end_date) {
    const start = new Date(start_date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);
    where.created_at = { [Op.between]: [start, end] };
  } else if (start_date) {
    const start = new Date(start_date);
    start.setHours(0, 0, 0, 0);
    where.created_at = { [Op.gte]: start };
  } else if (end_date) {
    const end = new Date(end_date);
    end.setHours(23, 59, 59, 999);
    where.created_at = { [Op.lte]: end };
  }

  // Fetch orders with User & Product
  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, attributes: ["name"] },
      { model: Vendor, attributes: ["name"] },
      { model: Product, as: "product", attributes: ["id", "model_name", "brand", "selling_price", "front_photo"] },
    ],
    order: [["created_at", "DESC"]],
    offset,
    limit,
  });

  // Status counts
  const countsRaw = await Order.findAll({
    attributes: ["order_status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    group: ["order_status"],
  });

  const counts = { total: count };
  countsRaw.forEach(c => {
    counts[c.order_status] = parseInt(c.get("count"));
  });

  const totalPages = Math.ceil(count / limit);

  return { orders: rows, counts, pagination: { totalPages, currentPage: page } };
};

export const getOrderDetailsService = async (id) => {
  try {
    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "address_line",
            "city",
            "state",
            "pincode",
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "brand",
            "model_name",
            "product_condition",
            "size",
            "product_color",
            "selling_price",
            "front_photo",
            "product_type",
            "product_group",
          ],
          include: [
            {
              model: Vendor,
              as: "vendor",
              attributes: [
                "id",
                "name",
                "business_name",
                "business_type",
                "phone",
                "email",
              ],
            },
          ],
        },
        {
          model: Vendor,
          attributes: [
            "id",
            "name",
            "business_name",
            "business_type",
            "phone",
            "email",
          ],
        },
      ],
    });

    if (!order) return null;

    const user = order.User || {};
    const product = order.product || {};
    const vendor = product.vendor || order.Vendor || {};

    return {
      order_id: order.id,
      order_date: order.order_date,
      order_status: order.order_status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      transaction_id: order.transaction_id,
      total_amount: Number(order.total_amount) || 0,
      quantity: order.quantity,
      shipping_address: order.shipping_address,

      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: [
          user.address_line,
          user.city,
          user.state,
          user.pincode ? `- ${user.pincode}` : "",
        ]
          .filter(Boolean)
          .join(", "),
      },

      product: {
        id: product.id,
        brand: product.brand,
        model_name: product.model_name,
        condition: product.product_condition,
        size: product.size,
        color: product.product_color,
        selling_price: Number(product.selling_price) || 0,
        image: product.front_photo,
        group: product.product_group,
        type: product.product_type,
      },

      vendor: {
        id: vendor.id,
        name: vendor.name,
        business_name: vendor.business_name,
        business_type: vendor.business_type,
        phone: vendor.phone,
        email: vendor.email,
      },
    };
  } catch (error) {
    console.error("Error in getOrderDetailsService:", error);
    throw error;
  }
};

// payment management
export const getPaymentsWithFiltersService = async ({ transaction_id, status, start_date, end_date, page = 1, limit = 10 }) => {
  try {
    const where = {};

    // Filter by transaction_id
    if (transaction_id) {
      where.transaction_id = { [Op.like]: `%${transaction_id}%` };
    }

    // Filter by status
    if (status && status.toLowerCase() !== "all") {
      where.status = status.toLowerCase();
    }

    // Filter by payment_date
    if (start_date && end_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);

      where.payment_date = { [Op.between]: [start, end] };
    } else if (start_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);
      where.payment_date = { [Op.gte]: start };
    } else if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      where.payment_date = { [Op.lte]: end };
    }

    const offset = (page - 1) * limit;

    // Fetch paginated payments
    const { count, rows } = await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [["payment_date", "DESC"]],
      attributes: [
        "id",
        "order_id",
        "user_id",
        "vendor_id",
        "amount",
        "vendor_earning",
        "platform_fee",
        "currency",
        "status",
        "payment_method",
        "transaction_id",
        "payment_date",
      ],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      payments: rows,
      total: count,
      totalPages,
    };
  } catch (err) {
    throw new Error(err.message || "Error fetching payments");
  }
};