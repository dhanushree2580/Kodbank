import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Wallet, LogOut, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const [user, setUser] = useState<{ uid: string; username: string; role: string } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('kodbank_user');
    const token = localStorage.getItem('kodbank_token');
    if (!stored || !token) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleCheckBalance = async () => {
    setLoading(true);
    setShowBalance(false);

    try {
      const token = localStorage.getItem('kodbank_token');
      const { data, error } = await supabase.functions.invoke('check-balance', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setBalance(data.balance);
      setShowBalance(true);

      // 🎉 Party popper confetti!
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#EAB308', '#FBBF24', '#FDE68A', '#F59E0B', '#D97706'],
        });
        // Second burst
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#EAB308', '#FBBF24', '#FDE68A'],
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#EAB308', '#FBBF24', '#FDE68A'],
          });
        }, 200);
      }, 300);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      if (err.message?.includes('token') || err.message?.includes('expired')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kodbank_token');
    localStorage.removeItem('kodbank_user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <span className="text-xl font-display font-bold gold-text">Kodbank</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.username} <span className="text-primary/60">• {user.role}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Welcome, <span className="gold-text">{user.username}</span>
          </h1>
          <p className="text-muted-foreground text-lg">Manage your banking with confidence</p>
        </div>

        {/* Balance Card */}
        <div className="glass-card p-8 max-w-lg glow-gold animate-pulse-gold" style={{ animation: 'fade-in-up 0.6s ease-out 0.2s both' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground">Account Balance</h2>
              <p className="text-sm text-muted-foreground">Check your current balance securely</p>
            </div>
          </div>

          {showBalance && balance !== null ? (
            <div className="mb-6 animate-balance-reveal">
              <p className="text-sm text-muted-foreground mb-1">Your balance is:</p>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-4xl font-display font-bold gold-text">
                  ₹{Number(balance).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-6 h-16 flex items-center">
              <p className="text-muted-foreground text-sm">Click below to securely view your balance</p>
            </div>
          )}

          <button
            onClick={handleCheckBalance}
            disabled={loading}
            className="w-full py-3 rounded-lg btn-gold flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                {showBalance ? 'Refresh Balance' : 'Check Balance'}
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
