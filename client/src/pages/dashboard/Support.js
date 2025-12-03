import { Link } from "react-router-dom";
import useWishlistStore from "../../stores/useWishlistStore";

export default function Support() {
  const { user } = useWishlistStore(); // logged-in user info

  // Default values if user not logged in
  const email = user?.email || "contact@sellaids.com";
  const phone = user?.phone || "+91 8800425855";

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>

      <p className="mb-4 text-gray-700">
        Need help? Contact our support team.
      </p>

      <ul className="space-y-3">
        <li>Email: <span className="text-red-600">{email}</span></li>
        <li>Phone: <span className="text-red-600">{phone}</span></li>
        <li>
          <Link to="/user/raise-ticket">
            <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Raise a Ticket
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
}