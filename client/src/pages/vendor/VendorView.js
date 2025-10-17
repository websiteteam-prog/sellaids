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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/${productId}`, {
          withCredentials: true,
        });
        setProduct(res.data);
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
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-center py-10 text-gray-500">Product not found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-3">Product Details</h1>
      <nav className="text-sm mb-4 text-gray-600">
        Home &gt; <Link to="/vendor/products" className="text-orange-600 cursor-pointer">Products</Link> &gt; <span className="text-orange-600">View Product</span>
      </nav>

      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">{product.modelName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Information</h3>
            <p><strong>Group:</strong> {product.group || "N/A"}</p>
            <p><strong>Category:</strong> {product.productCategory || "N/A"}</p>
            <p><strong>Type:</strong> {product.productType || "N/A"}</p>
            <p><strong>Condition:</strong> {product.productCondition || "N/A"}</p>
            <p><strong>Fit:</strong> {product.fit || "N/A"}</p>
            <p><strong>Size:</strong> {product.size || product.otherSize || "N/A"}</p>
            <p><strong>Color:</strong> {product.productColor || "N/A"}</p>
            <p><strong>Brand:</strong> {product.brand || "N/A"}</p>
            <p><strong>Model Name:</strong> {product.modelName || "N/A"}</p>
            <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
          </div>

          {/* Condition Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Condition Details</h3>
            <p><strong>Invoice Available:</strong> {product.invoice || "No"}</p>
            {product.invoice === "Yes" && (
              <p><strong>Invoice Photo:</strong> <img src={product.invoicePhoto} alt="Invoice" className="w-32 h-32 object-cover rounded mt-1" /></p>
            )}
            <p><strong>Needs Repair:</strong> {product.needsRepair || "No"}</p>
            {product.needsRepair === "Yes" && (
              <>
                <p><strong>Repair Details:</strong> {product.repairDetails || "N/A"}</p>
                <p><strong>Repair Photo:</strong> <img src={product.repairPhoto} alt="Repair" className="w-32 h-32 object-cover rounded mt-1" /></p>
              </>
            )}
            <p><strong>Original Box:</strong> {product.originalBox || "No"}</p>
            <p><strong>Dust Bag:</strong> {product.dustBag || "No"}</p>
            <p><strong>Additional Items:</strong> {product.additionalItems || "N/A"}</p>
          </div>

          {/* Images */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Front Photo", src: product.frontPhoto },
                { label: "Back Photo", src: product.backPhoto },
                { label: "Label Photo", src: product.labelPhoto },
                { label: "Inside Photo", src: product.insidePhoto },
                { label: "Button Photo", src: product.buttonPhoto },
                { label: "Wearing Photo", src: product.wearingPhoto },
              ].map((image, index) => (
                image.src && (
                  <div key={index}>
                    <p className="text-sm font-medium">{image.label}</p>
                    <img src={image.src} alt={image.label} className="w-32 h-32 object-cover rounded" />
                  </div>
                )
              ))}
              {product.moreImages && product.moreImages.length > 0 && (
                <>
                  <h4 className="text-sm font-medium mt-4">Additional Images</h4>
                  {product.moreImages.map((img, index) => (
                    <img key={index} src={img} alt={`Additional ${index + 1}`} className="w-32 h-32 object-cover rounded" />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Pricing and Purchase Details */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Pricing and Purchase Details</h3>
            <p><strong>Purchase Price:</strong> ₹{product.purchasePrice.toLocaleString() || "N/A"}</p>
            <p><strong>Selling Price:</strong> ₹{product.price.toLocaleString() || "N/A"}</p>
            <p><strong>Reason to Sell:</strong> {product.reasonToSell || "N/A"}</p>
            <p><strong>Purchase Year:</strong> {product.purchaseYear || "N/A"}</p>
            <p><strong>Purchase Place:</strong> {product.purchasePlace || "N/A"}</p>
            <p><strong>Product Reference Link:</strong> {product.productLink ? <a href={product.productLink} className="text-orange-600" target="_blank" rel="noopener noreferrer">Link</a> : "N/A"}</p>
            <p><strong>Additional Info:</strong> {product.additionalInfo || "N/A"}</p>
          </div>

          {/* Seller Information */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
            <p><strong>Name:</strong> {product.name || "N/A"}</p>
            <p><strong>Email:</strong> {product.email || "N/A"}</p>
            <p><strong>Phone:</strong> {product.phone || "N/A"}</p>
            <p><strong>Address:</strong> {product.address || "N/A"}, {product.apartment || ""}, {product.city || "N/A"}, {product.state || "N/A"}, {product.zip || "N/A"}</p>
            <p><strong>Seller Info:</strong> {product.sellerInfo || "N/A"}</p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/vendor/products"
            className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}