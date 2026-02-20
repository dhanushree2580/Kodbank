import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Shield, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('register', {
        body: form,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: 'Account created!', description: 'Please login with your credentials.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-md relative z-10" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-display font-bold gold-text">Kodbank</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-1">Start your banking journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <User className="w-4 h-4 text-primary/70" /> Username
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg input-dark"
              placeholder="johndoe"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary/70" /> Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg input-dark"
              placeholder="john@example.com"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary/70" /> Phone
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg input-dark"
              placeholder="+1 234 567 8900"
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary/70" /> Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg input-dark"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg btn-gold flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
