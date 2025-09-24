import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>

      <p className="mb-4 text-gray-700">
        Need help? Contact our support team.
      </p>

      <ul className="space-y-3">
        <li>Email: <span className="text-red-600">support@myshop.com</span></li>
        <li>Phone: <span className="text-red-600">+91 9876543210</span></li>
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
