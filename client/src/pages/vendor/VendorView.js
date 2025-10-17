import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function VendorView() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5000/api/product/products/${productId}`, {
          withCredentials: true,
          headers: {
            Cookie: "session_cookie_name=s%3AIqptv82iWnh3MgBKixz9PbUCFrQadmW_.oRCWuiIxVI6%2B7SvoPkZZv%2BXZiYn06gAgSR4Z%2FEbgWQg",
          },
        });
        setProduct(res.data.product);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading product details...</p>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p className="text-center py-10 text-red-500">{error}</p>
        <Link
          to="/vendor/all-products"
          className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p className="text-center py-10 text-gray-500">Product not found.</p>
        <Link
          to="/vendor/all-products"
          className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-3">Product Details</h1>
      <nav className="text-sm mb-4 text-gray-600">
        Home &gt;{" "}
        <Link to="/vendor/all-products" className="text-orange-600 cursor-pointer">
          Products
        </Link>{" "}
        &gt; <span className="text-orange-600">{product.model_name}</span>
      </nav>

      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">{product.model_name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Information</h3>
            <p><strong>Group:</strong> {product.product_group || "N/A"}</p>
            <p><strong>Category:</strong> {product.category?.name || "N/A"}</p>
            <p><strong>Type:</strong> {product.product_type || "N/A"}</p>
            <p><strong>Condition:</strong> {product.product_condition || "N/A"}</p>
            <p><strong>Fit:</strong> {product.fit || "N/A"}</p>
            <p><strong>Size:</strong> {product.size || product.size_other || "N/A"}</p>
            <p><strong>Color:</strong> {product.product_color || "N/A"}</p>
            <p><strong>Brand:</strong> {product.brand || "N/A"}</p>
            <p><strong>Model Name:</strong> {product.model_name || "N/A"}</p>
            <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  product.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : product.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {product.status}
              </span>
            </p>
          </div>

          {/* Condition Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Condition Details</h3>
            <p><strong>Invoice Available:</strong> {product.invoice || "No"}</p>
            {product.invoice === "Yes" && (
              <p>
                <strong>Invoice Photo:</strong>{" "}
                <img
                  src={product.invoice_photo}
                  alt="Invoice"
                  className="w-32 h-32 object-cover rounded mt-1"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              </p>
            )}
            <p><strong>Needs Repair:</strong> {product.needs_repair || "No"}</p>
            {product.needs_repair === "Yes" && (
              <>
                <p><strong>Repair Details:</strong> {product.repair_details || "N/A"}</p>
                <p>
                  <strong>Repair Photo:</strong>{" "}
                  <img
                    src={product.repair_photo}
                    alt="Repair"
                    className="w-32 h-32 object-cover rounded mt-1"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                </p>
              </>
            )}
            <p><strong>Original Box:</strong> {product.original_box || "No"}</p>
            <p><strong>Dust Bag:</strong> {product.dust_bag || "No"}</p>
            <p><strong>Additional Items:</strong> {product.additional_items || "N/A"}</p>
          </div>

          {/* Images */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Front Photo", src: product.front_photo },
                { label: "Back Photo", src: product.back_photo },
                { label: "Label Photo", src: product.label_photo },
                { label: "Inside Photo", src: product.inside_photo },
                { label: "Button Photo", src: product.button_photo },
                { label: "Wearing Photo", src: product.wearing_photo },
              ].map(
                (image, index) =>
                  image.src && (
                    <div key={index}>
                      <p className="text-sm font-medium">{image.label}</p>
                      <img
                        src={image.src}
                        alt={image.label}
                        className="w-32 h-32 object-cover rounded"
                        onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                      />
                    </div>
                  )
              )}
              {product.more_images && JSON.parse(product.more_images).length > 0 && (
                <>
                  <h4 className="text-sm font-medium mt-4">Additional Images</h4>
                  {JSON.parse(product.more_images).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Additional ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Pricing and Purchase Details */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Pricing and Purchase Details</h3>
            <p>
              <strong>Purchase Price:</strong> ₹
              {parseFloat(product.purchase_price).toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Selling Price:</strong> ₹
              {parseFloat(product.selling_price).toLocaleString() || "N/A"}
            </p>
            <p><strong>Reason to Sell:</strong> {product.reason_to_sell || "N/A"}</p>
            <p><strong>Purchase Year:</strong> {product.purchase_year || "N/A"}</p>
            <p><strong>Purchase Place:</strong> {product.purchase_place || "N/A"}</p>
            <p>
              <strong>Product Reference Link:</strong>{" "}
              {product.product_link ? (
                <a
                  href={product.product_link}
                  className="text-orange-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p><strong>Additional Info:</strong> {product.additional_info || "N/A"}</p>
          </div>

          {/* Seller Information */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
            <p><strong>Name:</strong> {product.vendor?.name || "N/A"}</p>
            <p><strong>Email:</strong> {product.vendor?.email || "N/A"}</p>
            <p><strong>Phone:</strong> {product.vendor?.phone || "N/A"}</p>
            <p>
              <strong>Address:</strong>{" "}
              {product.vendor
                ? `${product.vendor.house_no || ""} ${product.vendor.street_name || ""}, ${
                    product.vendor.city || "N/A"
                  }, ${product.vendor.state || "N/A"}, ${product.vendor.pincode || "N/A"}`
                : "N/A"}
            </p>
            <p><strong>Seller Info:</strong> {product.vendor?.business_name || "N/A"}</p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/vendor/all-products"
            className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}