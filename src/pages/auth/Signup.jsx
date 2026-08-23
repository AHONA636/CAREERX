import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

export default function Signup() {
  const { login, addToast, setUser } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      login(form.email);
      setUser((prev) => ({
        ...prev,
        name: form.name,
        firstName: form.name.split(' ')[0],
        email: form.email,
        avatarInitials: form.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      }));
      setLoading(false);
      addToast('Account created — let\'s set up your goals.', 'success');
      navigate('/onboarding');
    }, 700);
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start verifying your skills and building your roadmap.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-navy-700">Full Name</label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="signup-name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Sneha Kar"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
              className={`w-full rounded-xl border bg-surface-50 py-2.5 pl-9 pr-3 text-sm text-navy-800 placeholder:text-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100 ${
                errors.name ? 'border-rose-400' : 'border-surface-200 focus:border-navy-300'
              }`}
            />
          </div>
          {errors.name ? <p id="signup-name-error" className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-navy-700">Email</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
              className={`w-full rounded-xl border bg-surface-50 py-2.5 pl-9 pr-3 text-sm text-navy-800 placeholder:text-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100 ${
                errors.email ? 'border-rose-400' : 'border-surface-200 focus:border-navy-300'
              }`}
            />
          </div>
          {errors.email ? <p id="signup-email-error" className="mt-1 text-xs text-rose-500">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-navy-700">Password</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
              className={`w-full rounded-xl border bg-surface-50 py-2.5 pl-9 pr-3 text-sm text-navy-800 placeholder:text-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100 ${
                errors.password ? 'border-rose-400' : 'border-surface-200 focus:border-navy-300'
              }`}
            />
          </div>
          {errors.password ? <p id="signup-password-error" className="mt-1 text-xs text-rose-500">{errors.password}</p> : null}
        </div>

        <Button type="submit" size="lg" className="w-full justify-center" iconRight={ArrowRight} loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-navy-800 hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}
