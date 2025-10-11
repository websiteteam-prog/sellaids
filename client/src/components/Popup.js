import React, { useState, useEffect } from "react";
import popupImage from "../assets/images/popup-banner.webp";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Popup = ({ onClose }) => {
  // Zustand store
  const { isAuthenticated, login } = useUserStore();

  // ✅ Hooks at top-level
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Show popup automatically if user not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      setVisible(true);
      setTimeout(() => setFade(true), 10); // fade in
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setFade(false);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleLoginSubmit = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please fill all fields");
      return;
    }

    const userData = { email: loginEmail };
    login(userData); // Zustand login
    handleClose();
  };

  const handleRegisterSubmit = () => {
    if (!regName || !regEmail || !regPhone || !regPassword) {
      alert("Please fill all fields");
      return;
    }

    const newUser = { name: regName, email: regEmail, phone: regPhone };
    login(newUser); // Zustand login after register
    handleClose();
  };

  // Don't render if popup not visible
  if (!visible || isAuthenticated) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black/50 z-50 transition-opacity duration-300 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white flex max-w-4xl w-full max-h-[500px] transition-all rounded-xl overflow-hidden">
        {/* Left Image */}
        <div className="w-1/2 hidden md:block">
          <img src={popupImage} alt="Popup" className="h-full w-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="relative w-full md:w-1/2 p-6 overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
          >
            &times;
          </button>

          {/* Toggle Tabs */}
          <div className="flex justify-between mb-4 border-b border-gray-300">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-center font-semibold transition-colors ${
                isLogin ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-center font-semibold transition-colors ${
                !isLogin ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <label className="block mb-4 font-semibold">
                  Email / Phone
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter email or phone"
                  />
                </label>

                <label className="block mb-4 font-semibold relative">
                  Password
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2 top-8 p-1 rounded text-white"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <button
                  type="button"
                  onClick={handleLoginSubmit}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
                >
                  Login
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Create Account</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <label className="block mb-4 font-semibold">
                  Name
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your name"
                  />
                </label>

                <div className="flex gap-2 mb-4">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    maxLength={10}
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Phone"
                  />
                </div>

                <label className="block mb-4 font-semibold relative">
                  Password
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2 top-8 p-1 rounded bg-blue-500 text-white"
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
                >
                  Register
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
