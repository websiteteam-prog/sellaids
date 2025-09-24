export default function Wishlist() {
  const wishlistItems = [
    { id: 1, name: "Nike Shoes", price: 4999 },
    { id: 2, name: "Ray-Ban Sunglasses", price: 2999 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlistItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
            <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
