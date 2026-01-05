import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import useCartStore from "../../stores/useCartStore";
import { useCartActions } from "../../stores/useCartActions";
import toast from "react-hot-toast";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useUserStore();
  const { fetchCart } = useCartStore();
  const { pendingAdd, clearPending } = useCartActions();

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { success, data, message } = res.data;

      if (success) {
        login(data);
        toast.dismiss();
        toast.success(message || "Login Successful!", { duration: 2000 });

        // 1. Pending Cart Add (checkout flow etc.)
        // if (pendingAdd) {
        //   try {
        //     await axios.post(
        //       `${process.env.REACT_APP_API_URL}/api/user/cart`,
        //       { product_id: pendingAdd.product.id },
        //       { withCredentials: true }
        //     );
        //     await fetchCart();
        //     clearPending();
        //     navigate("/user/checkout", { replace: true });
        //   } catch (err) {
        //     toast.error("Failed to add item to cart");
        //     navigate("/user/checkout", { replace: true });
        //   }
        //   return;
        // }

        // if (pendingAdd?.type === "cart") {
        //   // 🔑 sirf redirect karo, cart add category page me useEffect karega
        //   const redirectTo = pendingAdd.from || "/";
        //   navigate(redirectTo, { replace: true });
        //   return;
        // }

        const redirectTo = pendingAdd?.from || "/";
        console.log("Redirecting to pendingAdd:", pendingAdd);
        console.log("Redirecting to:", redirectTo);
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 0);
        return;

        // 2. State-based Add to Cart (from product page)
        // if (location.state?.addToCart) {
        //   const productId = location.state.addToCart;
        //   try {
        //     await axios.post(
        //       `${process.env.REACT_APP_API_URL}/api/user/cart`,
        //       { product_id: productId },
        //       { withCredentials: true }
        //     );
        //     await fetchCart();
        //     toast.success("Product added to cart!");
        //   } catch (err) {
        //     toast.error("Failed to add to cart");
        //   }
        //   // Wapas usi page pe (product page)
        //   navigate(location.state.from || "/", { replace: true });
        //   return;
        // }

        // 3. State-based Wishlist
        // if (location.state?.addToWishlist) {
        //   const productId = location.state.addToWishlist;
        //   try {
        //     await axios.post(
        //       `${process.env.REACT_APP_API_URL}/api/user/wishlist`,
        //       { product_id: productId },
        //       { withCredentials: true }
        //     );
        //     toast.success("Added to wishlist!");
        //   } catch (err) {
        //     toast.error("Failed to add to wishlist");
        //   }
        //   navigate(location.state.from || "/", { replace: true });
        //   return;
        // }

        // 4. Normal case - jahan se aaya tha wahan wapas
        // const from = location.state?.from?.pathname || "/";
        // navigate(from, { replace: true });
        // const redirectTo = pendingAdd?.from || "/";
        // navigate(redirectTo, { replace: true });
      } else {
        setLoginError("Invalid credentials");
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  // Agar already logged in hai to turant redirect
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     toast.dismiss();
  //     const from = location.state?.from?.pathname || "/";
  //     navigate(from, { replace: true });
  //   }
  // }, [isAuthenticated, navigate, location]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          LOGIN
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            required
          />
          {emailError && <div className="text-red-500 text-sm mb-2">{emailError}</div>}

          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
              required
            />
            {password && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Include uppercase, lowercase, number & special character
          </p>

          {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
          {loginError && <div className="text-red-500 text-sm mb-4">{loginError}</div>}

          <p className="text-right mt-4 mb-2">
            <a href="/UserAuth/UserForgot" className="text-red-500 text-sm hover:text-orange-600">
              Forgot Password?
            </a>
          </p>

          <button
            type="submit"
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-5 text-center">
          Not registered?{" "}
          <Link to="/UserAuth/register" className="text-orange-600">
            Register
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-500 hover:underline">
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;