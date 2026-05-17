import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid work email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.refreshToken, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low relative min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop text-on-surface w-full overflow-hidden">
      {/* Minimalistic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none mix-blend-multiply opacity-70"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-primary-container/20 blur-[150px] pointer-events-none mix-blend-multiply opacity-70"></div>
      
      <main className="relative z-10 w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant p-xl md:p-2xl flex flex-col">
        {/* Header */}
        <div className="text-center mb-xl">
          <h1 className="font-serif text-[32px] font-bold text-primary mb-xs" style={{ fontFamily: 'Georgia, serif' }}>Smart Leads</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to manage your pipeline</p>
        </div>
        
        

        {/* Form */}
        <form className="flex flex-col gap-lg" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="flex flex-col gap-base">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Work Email</label>
            <div className="relative">
              <input 
                id="email" 
                name="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-[44px] px-md py-sm rounded-lg border bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none transition-all ${error ? 'border-error focus:ring-2 focus:ring-error/20 focus:border-error pr-10' : 'border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
              />
              {error && (
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              )}
            </div>
            {error && (
              <span className="text-sm font-semibold text-error">{error}</span>
            )}
          </div>
          
          {/* Password Field */}
          <div className="flex flex-col gap-base">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            />
          </div>
          
          {/* Options Row */}
          <div className="flex items-center justify-between mt-xs">
            <label className="flex items-center gap-sm cursor-pointer group">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-lowest" type="checkbox"/>
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
            </label>
            <button onClick={() => alert("Forgot password functionality coming soon!")} type="button" className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors">Forgot password?</button>
          </div>
          
          {/* Submit Action */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[44px] bg-primary text-on-primary rounded-lg font-title-md text-title-md hover:bg-surface-tint transition-colors flex items-center justify-center mt-sm disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        

        
        {/* Footer */}
        <div className="mt-xl text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don't have an account? 
            <Link to="/register" className="font-title-md text-title-md text-primary hover:text-primary-container transition-colors ml-xs">Register now</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
