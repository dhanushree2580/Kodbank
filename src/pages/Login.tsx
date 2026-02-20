import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('login', {
        body: form,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Store token and user info in localStorage
      localStorage.setItem('kodbank_token', data.token);
      localStorage.setItem('kodbank_user', JSON.stringify(data.user));

      toast({ title: 'Welcome back!', description: `Logged in as ${data.user.username}` });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-display font-bold gold-text">Kodbank</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
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
              <Lock className="w-4 h-4 text-primary/70" /> Password
            </label>
            <input
              type="password"
              required
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
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
