import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";

const fallbackImage = "https://placehold.co/300x200/EEE/555?text=No+Image";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/management/product/${productId}`,
        { withCredentials: true }
      );
      const { success, data, message } = res.data;
      if (success) {
        setProduct(data);
      } else {
        toast.error(message || "Failed to fetch details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle2 size={18} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <XCircle size={18} /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-yellow-600 font-medium">
            <Clock size={18} /> Pending
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium">
        Loading product details...
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-600">No product found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );

  // Convert JSON string to array safely
  const moreImages = product.more_images ? JSON.parse(product.more_images) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
        <div>{renderStatus(product.status)}</div>
      </div>

      {/* Product Info Card */}
      <div className="bg-white rounded-2xl shadow p-6 grid md:grid-cols-2 gap-6">
        {/* Left Side - Images */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <img
              src={product.front_photo || fallbackImage}
              alt="Front"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.src = fallbackImage)}
            />
            <img
              src={product.back_photo || fallbackImage}
              alt="Back"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.src = fallbackImage)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <img
              src={product.label_photo || fallbackImage}
              alt="Label"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.src = fallbackImage)}
            />
            <img
              src={product.inside_photo || fallbackImage}
              alt="Inside"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.src = fallbackImage)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <img
              src={product.button_photo || fallbackImage}
              alt="Button"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.src = fallbackImage)}
            />
            <img
              src={product.wearing_photo || fallbackImage}
              alt="Wearing"
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => (e.target.src = fallbackImage)}
            />
          </div>

          {moreImages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">More Images</h3>
              <div className="grid grid-cols-3 gap-3">
                {moreImages.map((img, i) => (
                  <img
                    key={i}
                    src={img || fallbackImage}
                    alt={`More ${i}`}
                    className="w-full h-40 object-cover rounded-lg border"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Details */}
        <div className="space-y-3 text-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.brand} - {product.model_name}
          </h3>

          <p>
            <strong>Product Type:</strong> {product.product_type}
          </p>
          <p>
            <strong>Color:</strong> {product.product_color}
          </p>
          <p>
            <strong>Fit:</strong> {product.fit}
          </p>
          <p>
            <strong>Size:</strong> {product.size}
          </p>
          <p>
            <strong>Condition:</strong> {product.product_condition}
          </p>
          <p>
            <strong>Purchase Year:</strong> {product.purchase_year}
          </p>
          <p>
            <strong>Purchase Place:</strong> {product.purchase_place}
          </p>
          <p>
            <strong>Reason to Sell:</strong> {product.reason_to_sell}
          </p>
          <p>
            <strong>Additional Info:</strong> {product.additional_info}
          </p>
          <p>
            <strong>Invoice:</strong> {product.invoice}
          </p>
          {product.invoice_photo && (
            <img
              src={product.invoice_photo}
              alt="Invoice"
              className="w-40 h-40 object-cover rounded-lg border"
            />
          )}
          {product.repair_photo && (
            <div>
              <p className="mt-2">
                <strong>Repair Needed:</strong> {product.needs_repair}
              </p>
              <img
                src={product.repair_photo}
                alt="Repair"
                className="w-40 h-40 object-cover rounded-lg border"
              />
            </div>
          )}
          <p>
            <strong>Purchase Price:</strong> ₹{product.purchase_price}
          </p>
          <p>
            <strong>Selling Price:</strong> ₹{product.selling_price}
          </p>
          <p>
            <strong>SKU:</strong> {product.sku}
          </p>
          <p>
            <strong>Product Link:</strong>{" "}
            <a
              href={product.product_link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {product.product_link}
            </a>
          </p>

          <div className="mt-4">
            <p className="text-gray-500 text-sm">
              <strong>Created:</strong>{" "}
              {new Date(product.created_at).toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">
              <strong>Updated:</strong>{" "}
              {new Date(product.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
