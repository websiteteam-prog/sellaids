import { productSchema, updateProductSchema } from "../../validations/productFormValidation.js";
import { createProductService, fetchCategories, fetchProductTypesByCategory, getAllProductsService, getProductByIdService, getDashboardStatsService, getEarningsStatsService, updateProductService } from "../../services/product/productFormService.js";
import logger from "../../config/logger.js";
import { Product } from "../../models/productModel.js";


export const addProductController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Vendor session missing" });
    }

    await productSchema.validate(req.body, { abortEarly: false, context: { vendorId } });

    // const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    const images = {
      front_photo: req.files?.front_photo?.[0] ? `uploads/${req.files.front_photo[0].filename}` : null,
      back_photo: req.files?.back_photo?.[0] ? `uploads/${req.files.back_photo[0].filename}` : null,
      label_photo: req.files?.label_photo?.[0] ? `uploads/${req.files.label_photo[0].filename}` : null,
      inside_photo: req.files?.inside_photo?.[0] ? `uploads/${req.files.inside_photo[0].filename}` : null,
      button_photo: req.files?.button_photo?.[0] ? `uploads/${req.files.button_photo[0].filename}` : null,
      wearing_photo: req.files?.wearing_photo?.[0] ? `uploads/${req.files.wearing_photo[0].filename}` : null,
      invoice_photo: req.files?.invoice_photo?.[0] ? `uploads/${req.files.invoice_photo[0].filename}` : null,
      repair_photo: req.files?.repair_photo?.[0] ? `uploads/${req.files.repair_photo[0].filename}` : null,
      more_images: req.files?.more_images?.map(f => `uploads/${f.filename}`) || [],
    };

    const product = await createProductService(vendorId, req.body, images);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
    }
    logger.error(error.message);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const { id } = req.params;

    if (!vendorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Vendor session missing",
      });
    }

    // Check if product exists and belongs to this vendor
    const product = await Product.findOne({
      where: { id, vendor_id: vendorId, is_active: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    // Validate using the new dedicated update schema
    await updateProductSchema.validate(req.body, {
      abortEarly: false,
      context: {
        vendorId,
        productId: id, // Critical: skip self in unique brand+model check
      },
    });

    // const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    // Preserve old images if not re-uploaded
    const images = {
      front_photo: req.files?.front_photo?.[0]
        ? `uploads/${req.files.front_photo[0].filename}`
        : product.front_photo,

      back_photo: req.files?.back_photo?.[0]
        ? `uploads/${req.files.back_photo[0].filename}`
        : product.back_photo,

      label_photo: req.files?.label_photo?.[0]
        ? `uploads/${req.files.label_photo[0].filename}`
        : product.label_photo,

      inside_photo: req.files?.inside_photo?.[0]
        ? `uploads/${req.files.inside_photo[0].filename}`
        : product.inside_photo,

      button_photo: req.files?.button_photo?.[0]
        ? `uploads/${req.files.button_photo[0].filename}`
        : product.button_photo,

      wearing_photo: req.files?.wearing_photo?.[0]
        ? `uploads/${req.files.wearing_photo[0].filename}`
        : product.wearing_photo,

      invoice_photo: req.files?.invoice_photo?.[0]
        ? `uploads/${req.files.invoice_photo[0].filename}`
        : product.invoice_photo,

      repair_photo: req.files?.repair_photo?.[0]
        ? `uploads/${req.files.repair_photo[0].filename}`
        : product.repair_photo,

      more_images:
        req.files?.more_images?.length > 0
          ? req.files.more_images.map((f) => `uploads/${f.filename}`)
          : product.more_images || [],
    };

    // Call service to update
    const updatedProduct = await updateProductService(id, vendorId, req.body, images);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    logger.error(`Update Product Error (ID: ${req.params.id}): ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const isAdmin = !!req.session.admin?.adminId;
    if (!vendorId && !isAdmin) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid session required" });
    }

    const { search = "" } = req.query;
    const categories = await fetchCategories(search);
    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getProductTypes = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const isAdmin = !!req.session.admin?.adminId;
    if (!vendorId && !isAdmin) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid session required" });
    }

    const { category_id, search = "" } = req.query;

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "category_id is required",
      });
    }

    const productTypes = await fetchProductTypesByCategory(category_id, search);

    res.json({
      success: true,
      message: "Product types fetched successfully",
      data: productTypes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product types",
      error: error.message,
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    const isAdmin = !!req.session.admin?.adminId;
    if (!vendorId && !isAdmin) {
      return res.status(401).json({ success: false, message: "Unauthorized: Valid session required" });
    }

    const data = await getAllProductsService(req.query, vendorId, isAdmin);

    res.status(200).json({
      success: true,
      message: "Product list fetched successfully",
      ...data,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product list",
      error: err.message,
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    // const vendorId = req.session.vendor?.vendorId;
    // const isAdmin = !!req.session.admin?.adminId;

    // if (!vendorId && !isAdmin) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Unauthorized: Valid session required" });
    // }

    const { id } = req.params;

    const { product, related } = await getProductByIdService(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      product,
      relatedProducts: related,           
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: err.message,
    });
  }
};

export const getDashboardController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Vendor session missing" });
    }

    const data = await getDashboardStatsService(vendorId);
    res.status(200).json({ success: true, msg: "Dashboard data fetched successfully", data });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const getEarningsController = async (req, res) => {
  try {
    const vendorId = req.session.vendor?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Vendor session missing" });
    }

    const data = await getEarningsStatsService(vendorId);
    res.status(200).json({ success: true, msg: "Earnings data fetched successfully", data });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};