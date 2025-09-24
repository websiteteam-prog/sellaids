import { LogOut } from "lucide-react";

export default function Navbar({ username = "User" }) {
  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow border-b">
      {/* Left: Welcome Message */}
      <h1 className="text-xl font-semibold text-gray-800">
        Welcome, <span className="text-red-600">{username}</span>
      </h1>

      {/* Right: Icon Buttons */}
      <div className="flex items-center gap-4">
         
        <button
          className="text-gray-600 hover:text-red-600 transition-colors"
          title="Logout"
          onClick={() => {
            // TODO: Add logout logic here
            console.log("User logged out");
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
