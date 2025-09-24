export default function Profile() {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input type="text" className="w-full border rounded p-2" placeholder="Enter your name" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full border rounded p-2" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input type="tel" className="w-full border rounded p-2" placeholder="+91 9876543210" />
        </div>

        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
