import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

export default function Login() {
  const { login, hasOnboarded, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sneha.kar@careerx.dev');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      login(email);
      setLoading(false);
      addToast('Welcome back to CareerX.', 'success');
      navigate(hasOnboarded ? '/app' : '/onboarding');
    }, 700);
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your roadmap to placement.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-navy-700">Email</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className={`w-full rounded-xl border bg-surface-50 py-2.5 pl-9 pr-3 text-sm text-navy-800 placeholder:text-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100 ${
                errors.email ? 'border-rose-400' : 'border-surface-200 focus:border-navy-300'
              }`}
            />
          </div>
          {errors.email ? <p id="login-email-error" className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-navy-700">Password</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className={`w-full rounded-xl border bg-surface-50 py-2.5 pl-9 pr-9 text-sm text-navy-800 placeholder:text-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100 ${
                errors.password ? 'border-rose-400' : 'border-surface-200 focus:border-navy-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? <p id="login-password-error" className="mt-1 text-xs text-rose-500">{errors.password}</p> : null}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-navy-500">
            <input type="checkbox" className="rounded border-surface-300" defaultChecked />
            Remember me
          </label>
          <button type="button" className="font-medium text-navy-700 hover:underline" onClick={() => addToast('Password reset link sent (mock).', 'info')}>
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full justify-center" iconRight={ArrowRight} loading={loading}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-navy-800 hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
