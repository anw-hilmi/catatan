import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
} from "react-icons/fa";
import EditSandi from "../components/EditSandi.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Admin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const loginResult = await loginRes.json();

      if (loginResult.status !== "success")
        throw new Error(loginResult.message);

      setToken(loginResult.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      setErrorMsg(
        error.message || "Login gagal: Username atau Password admin salah.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({ username: "", password: "" });
    setToken(null);
    setErrorMsg("");
  };

  if (isLoggedIn) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-card-text">Dashboard Admin</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-danger-dark text-white font-medium rounded-xl transition-colors shadow-sm focus:outline-none"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <EditSandi token={token} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center w-full p-4">
      <div className="max-w-md w-full space-y-8 bg-primary-light/40 p-8 rounded-2xl shadow-md border border-card-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-text tracking-tight">
            Login Admin
          </h2>
          <p className="mt-2 text-sm text-card-muted">
            Masuk untuk mengelola data dan sandi catatan
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="p-3 text-sm text-danger bg-danger-light border border-danger/30 rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-card-text mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-card-muted">
                  <FaUser className="w-4 h-4" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-card-border rounded-xl text-card-text text-sm focus:ring-2 focus:ring-btn-add focus:border-btn-add transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-card-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-card-muted">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-card-border rounded-xl text-card-text text-sm focus:ring-2 focus:ring-btn-add focus:border-btn-add transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-card-muted hover:text-card-text transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-btn-add hover:bg-btn-add-dark active:bg-btn-add-dark disabled:bg-btn-add/50 rounded-xl shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-btn-add focus:ring-offset-1"
          >
            {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
