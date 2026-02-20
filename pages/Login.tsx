import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { BRAND_NAME, TAGLINE } from '../constants';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(identifier.trim(), password);

      /*
        EXPECTED BACKEND RESPONSE:
        {
          firstName: "...",
          token: "...",
          username: "...",
          role: "ROLE_ADMIN"
        }
      */

      // ✅ Safety check
      if (!response || !response.token) {
        throw new Error("Invalid credentials");
      }

      // ✅ Store token (required for protected APIs)
      localStorage.setItem("token", response.token);

      // ✅ Store full user info safely
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.username,
          role: response.role,
          firstName: response.firstName
        })
      );

      // ✅ Navigate safely based on role
      const rolePath = response.role
        ? response.role.replace("ROLE_", "").toLowerCase()
        : "student";

      navigate(`/portal/${rolePath}`);

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border">

        {/* Left Side */}
        <div className="md:w-1/2 bg-[#001a33] p-12 text-white flex flex-col justify-between">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-12">
              <div className="w-16 h-12 bg-white text-[#001a33] rounded-xl flex items-center justify-center font-black text-xl">
                KEP
              </div>
              <span className="font-bold text-xl">{BRAND_NAME}</span>
            </Link>

            <h1 className="text-4xl font-black mb-6 leading-tight">
              Elite STEM Academy
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              {TAGLINE}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-12">
          <div className="max-w-sm mx-auto">

            <h2 className="text-3xl font-black text-dark mb-2">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
                  {error}
                </div>
              )}

              {/* Identifier */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Mobile"
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#001a33] text-white py-4 rounded-2xl font-semibold hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ChevronRight size={18} />}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
