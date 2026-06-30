import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3ECE4] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#FAF6F2] rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(107,79,79,0.06)] border border-[#E8D8C8]/60 relative overflow-hidden">
        
        {/* Soft Background Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#E8D8C8] rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-light tracking-widest uppercase text-[#3A2E2A] mb-2">Aura Admin</h1>
            <p className="text-[#6B4F4F]/60 text-sm tracking-wide">Secure Management Portal</p>
          </div>

          {error && <div className="bg-[#9E3D3D]/10 text-[#9E3D3D] p-4 rounded-xl text-sm mb-6 text-center border border-[#9E3D3D]/20">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Admin Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[#E8D8C8] pb-3 text-lg text-[#3A2E2A] placeholder:text-[#6B4F4F]/40 focus:outline-none focus:border-[#9E3D3D] transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#E8D8C8] pb-3 text-lg text-[#3A2E2A] placeholder:text-[#6B4F4F]/40 focus:outline-none focus:border-[#9E3D3D] transition-colors"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 mt-4 bg-[#3A2E2A] text-white uppercase tracking-[0.2em] text-xs font-medium rounded-full shadow-[0_8px_20px_rgba(58,46,42,0.15)] hover:bg-[#9E3D3D] hover:shadow-[0_12px_25px_rgba(158,61,61,0.25)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
