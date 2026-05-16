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
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop text-on-surface w-full">
      <main className="w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1)] border border-outline-variant p-xl md:p-2xl flex flex-col">
        {/* Header */}
        <div className="text-center mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Smart Leads</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to manage your pipeline</p>
        </div>
        
        {error && <div className="bg-error-container text-on-error-container p-3 rounded-md text-sm mb-4 font-body-md">{error}</div>}
        
        {/* Form */}
        <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
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
        
        {/* Divider */}
        <div className="relative flex items-center py-xl">
          <div className="flex-grow border-t border-outline-variant"></div>
          <span className="flex-shrink-0 mx-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-outline-variant"></div>
        </div>
        
        {/* Social Login */}
        <button onClick={() => alert("Google Sign in coming soon!")} type="button" className="w-full h-[44px] bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-title-md text-title-md hover:bg-surface-container transition-colors flex items-center justify-center gap-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-body-md font-medium">Google</span>
        </button>
        
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
