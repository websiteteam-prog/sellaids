import { productSchema } from "../../validations/productFormValidation.js";
import { createProductService } from "../../services/product/productFormService.js";


export const addProductController = async (req, res) => {
  try {
    const { vendorId } = req.session.vendor;
    console.log(vendorId,"vendorId");
    
    await productSchema.validate(req.body, { abortEarly: false });

    const images = {
      front_photo: req.files?.front_photo?.[0] ? `/uploads/${req.files.front_photo[0].filename}` : null,
      back_photo: req.files?.back_photo?.[0] ? `/uploads/${req.files.back_photo[0].filename}` : null,
      label_photo: req.files?.label_photo?.[0] ? `/uploads/${req.files.label_photo[0].filename}` : null,
      inside_photo: req.files?.inside_photo?.[0] ? `/uploads/${req.files.inside_photo[0].filename}` : null,
      button_photo: req.files?.button_photo?.[0] ? `/uploads/${req.files.button_photo[0].filename}` : null,
      wearing_photo: req.files?.wearing_photo?.[0] ? `/uploads/${req.files.wearing_photo[0].filename}` : null,
      invoice_photo: req.files?.invoice_photo?.[0] ? `/uploads/${req.files.invoice_photo[0].filename}` : null,
      repair_photo: req.files?.repair_photo?.[0] ? `/uploads/${req.files.repair_photo[0].filename}` : null,
      more_images: req.files?.more_images?.map(f => `/uploads/${f.filename}`) || [],
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
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
