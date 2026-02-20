import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Lock, Zap, CreditCard } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/4 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-2xl font-display font-bold gold-text">Kodbank</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-semibold rounded-lg btn-gold"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center max-w-3xl mx-auto" style={{ animation: 'fade-in-up 0.8s ease-out' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Secure • Fast • Reliable
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6">
            Banking that{' '}
            <span className="gold-text">works for you</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience secure, modern banking with Kodbank. Manage your finances with confidence using our industry-standard encryption and JWT-based authentication.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-lg btn-gold text-base font-semibold inline-flex items-center gap-2"
            >
              Open Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-lg text-base font-medium text-foreground/80 border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-28">
          {[
            { icon: Lock, title: 'Bank-Grade Security', desc: 'PBKDF2 password hashing and JWT token authentication keep your data safe.' },
            { icon: CreditCard, title: 'Instant Balance', desc: 'Check your account balance in real-time with token-verified requests.' },
            { icon: Shield, title: 'Role-Based Access', desc: 'Customer, Manager, and Admin roles with granular access control.' },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card p-6 gold-border group hover:glow-gold transition-all duration-500"
              style={{ animation: `fade-in-up 0.6s ease-out ${0.3 + i * 0.15}s both` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
