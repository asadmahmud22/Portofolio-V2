import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("Email tidak ditemukan.");
          break;
        case "auth/wrong-password":
          setError("Password salah.");
          break;
        case "auth/invalid-email":
          setError("Format email tidak valid.");
          break;
        case "auth/too-many-requests":
          setError("Terlalu banyak percobaan. Coba lagi nanti.");
          break;
        default:
          setError("Login gagal. Periksa email dan password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex">

      {/* ── Left Panel — Branding ── */}
      <div className="hidden md:flex w-5/12 lg:w-2/5 bg-gray-900 flex-col justify-between px-12 py-14 flex-shrink-0">
        {/* Top */}
        <div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-10">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white leading-snug">
            Admin<br />Panel
          </h1>
          <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-xs">
            Area terbatas. Hanya pengguna yang berwenang yang dapat mengakses panel ini.
          </p>
        </div>

        {/* Bottom */}
        <div>
          <div className="border-t border-white/10 pt-6 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Portofolio</p>
            <p className="text-sm font-medium text-gray-300">As'ad Mahmud Akram</p>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-full bg-white/20"
                style={{ width: i === 0 ? "28px" : "8px", height: "8px" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-8 overflow-y-auto">

        {/* Mobile-only branding */}
        <div className="md:hidden flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-3">
            <Shield size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">As'ad Mahmud Akram · Portofolio</p>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Masuk ke Admin</h2>
          <p className="text-sm text-gray-400 mb-8">
            Masukkan kredensial Anda untuk melanjutkan.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk ke Admin Panel"
              )}
            </button>
          </form>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={12} />
            Kembali ke Portofolio
          </button>

          {/* Footer */}
          <p className="mt-12 text-xs text-gray-300">
            Halaman ini hanya untuk admin. Akses tidak sah dilarang.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;