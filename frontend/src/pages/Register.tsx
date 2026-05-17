import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Sales User' | 'Admin'>('Sales User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-x-hidden w-full">
      {/* Left side ka Branding Section (Mobile par chhipa hua) */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-variant relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="B2B abstract" className="object-cover w-full h-full opacity-60 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzpv3CAHKyRqV1eyByMcqFvRCumAHyPPgebmFpSqlbL9wgBdLXTJI-HM4ftfEAKWmUFhUcDaOeH_9isrBumMpYLeT-2wN29_jwkfVdyRFkLFYAjFv-XW7IITh6birQWO0r0CmiG1vaa5Jjf69cqLs5CzOJMYSfcRUaPSboMjx30eXkGXQtXIEBXsAh0MW-qfEkvyl_5awCsPN9q3KJbZlsKA8D6Qd62XTlG---HchbyC_f_0M0rEqWSPyZCX4yjlS42gHSTZCBPI8"/>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-surface-tint/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 p-margin-desktop text-center flex flex-col items-center">
          <div className="bg-surface-container-lowest p-sm rounded-xl mb-xl shadow-sm border border-outline-variant inline-flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary-fixed mb-md drop-shadow-md">Smart Leads</h1>
          <p className="font-title-lg text-title-lg text-surface-container-lowest max-w-md mx-auto drop-shadow-md">
            Accelerate your pipeline with intelligent data-driven insights and streamlined management tools.
          </p>
        </div>
      </div>

      {/* Right side ka Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-margin-mobile lg:p-margin-desktop bg-background">
        <div className="w-full max-w-md">
          {/* Mobile ke liye Logo Header */}
          <div className="lg:hidden flex items-center gap-sm mb-xl justify-center">
            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
            <span className="font-headline-md text-headline-md font-extrabold text-primary">Smart Leads</span>
          </div>

          {/* Registration wala Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05)] border border-outline-variant p-lg md:p-xl w-full">
            <div className="mb-xl">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Create your account</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Start maximizing your lead conversions today.</p>
            </div>
            
            {error && <div className="bg-error-container text-on-error-container p-3 rounded-md text-sm mb-4 font-body-md">{error}</div>}

            <form className="space-y-lg flex flex-col" onSubmit={handleSubmit}>
              {/* Pura Naam */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="fullName">Full Name</label>
                <input 
                  id="fullName" 
                  name="name" 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-outline-variant px-md py-sm bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-shadow" 
                />
              </div>

              {/* Work Email */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="workEmail">Work Email</label>
                <input 
                  id="workEmail" 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full rounded-lg border border-outline-variant px-md py-sm bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-shadow" 
                />
              </div>

              {/* Role Select karne ka option */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="role">Role</label>
                <select 
                  id="role" 
                  name="role" 
                  required 
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'Sales User' | 'Admin')}
                  className="w-full rounded-lg border border-outline-variant px-md py-sm bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-shadow"
                >
                  <option value="Sales User">Sales User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-outline-variant px-md py-sm bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-shadow" 
                />
              </div>

              {/* Submit karne ka Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full min-h-[44px] bg-primary hover:bg-primary/90 text-on-primary font-title-md text-title-md rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none mt-sm flex items-center justify-center gap-sm disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            {/* Login Fallback wala link */}
            <div className="mt-xl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account? 
                <Link to="/login" className="text-primary font-title-md text-title-md hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xs ml-xs">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
