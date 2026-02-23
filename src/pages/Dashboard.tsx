import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Shield, Wallet, LogOut, Sparkles, CreditCard, TrendingUp,
  Clock, ShieldCheck, Phone, Mail, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import BrokodChat from '@/components/BrokodChat';

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
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#EAB308', '#FBBF24', '#FDE68A', '#F59E0B', '#D97706'] });
        setTimeout(() => {
          confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#EAB308', '#FBBF24', '#FDE68A'] });
          confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#EAB308', '#FBBF24', '#FDE68A'] });
        }, 200);
      }, 300);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      if (err.message?.includes('token') || err.message?.includes('expired')) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kodbank_token');
    localStorage.removeItem('kodbank_user');
    document.cookie = 'kodbank_token=; path=/; max-age=0';
    navigate('/login');
  };

  if (!user) return null;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            {greeting}, <span className="gold-text">{user.username}</span>
          </h1>
          <p className="text-muted-foreground">Here's your banking overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Balance + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="glass-card p-6 glow-gold">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold text-foreground">Account Balance</h2>
                  <p className="text-xs text-muted-foreground">Securely check your balance</p>
                </div>
              </div>

              {showBalance && balance !== null ? (
                <div className="mb-5 animate-balance-reveal">
                  <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-display font-bold gold-text">
                      ₹{Number(balance).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-5 h-14 flex items-center">
                  <p className="text-muted-foreground text-sm">Click below to securely view your balance</p>
                </div>
              )}

              <button
                onClick={handleCheckBalance}
                disabled={loading}
                className="w-full py-2.5 rounded-lg btn-gold flex items-center justify-center gap-2 font-semibold disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    {showBalance ? 'Refresh Balance' : 'Check Balance'}
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: ArrowUpRight, label: 'Send Money', color: 'text-green-400' },
                { icon: ArrowDownLeft, label: 'Request', color: 'text-blue-400' },
                { icon: CreditCard, label: 'Cards', color: 'text-purple-400' },
                { icon: TrendingUp, label: 'Investments', color: 'text-orange-400' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="glass-card p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group cursor-pointer"
                  onClick={() => toast({ title: 'Coming Soon', description: `${action.label} feature is under development.` })}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" /> Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Account Created', time: 'Welcome bonus applied', amount: '+₹100,000', positive: true },
                  { label: 'KYC Verified', time: 'Identity verification complete', amount: '', positive: true },
                  { label: 'Secure Login', time: 'Current session active', amount: '', positive: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    {item.amount && (
                      <span className={`text-sm font-semibold ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Info Cards */}
          <div className="space-y-5">
            {/* Account Info */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-display font-semibold text-foreground mb-3">Account Details</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="text-foreground font-mono text-xs">{user.uid.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="text-primary text-xs font-semibold">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1 text-green-400 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
                  </span>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Security
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-muted-foreground">256-bit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-muted-foreground">JWT secured session</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">24h token expiry</span>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-display font-semibold text-foreground mb-3">Need Help?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Chat with <span className="text-primary font-semibold">Brokod</span>, our AI assistant, or contact support.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> 1800-KOD-BANK
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> support@kodbank.in
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Brokod Chat Widget */}
      <BrokodChat />
    </div>
  );
};

export default Dashboard;
