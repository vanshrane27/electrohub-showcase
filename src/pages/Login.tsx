import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Zap, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register, resetPassword, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
          // Check admin status from result or current state
          const adminStatus = result.isAdmin ?? isAdmin;
          navigate(adminStatus ? '/admin' : '/dashboard');
        } else {
          toast({ title: 'Login failed', description: result.error || 'Invalid email or password', variant: 'destructive' });
        }
      } else {
        // Validate password strength
        if (formData.password.length < 6) {
          toast({ title: 'Registration failed', description: 'Password must be at least 6 characters long', variant: 'destructive' });
          setIsLoading(false);
          return;
        }

        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          toast({ title: 'Account created!', description: 'Welcome to NexaTech. Please check your email to verify your account.' });
          navigate('/dashboard');
        } else {
          toast({ title: 'Registration failed', description: result.error || 'Failed to create account', variant: 'destructive' });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            <h1 className="font-heading text-2xl font-bold text-center mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {isLogin
                ? 'Sign in to access your account'
                : 'Sign up to get started with NexaTech'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={isLogin ? 'admin@admin.com' : 'you@example.com'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                    placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 characters)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!formData.email) {
                        toast({ title: 'Error', description: 'Please enter your email address first', variant: 'destructive' });
                        return;
                      }
                      const result = await resetPassword(formData.email);
                      if (result.success) {
                        toast({ title: 'Password reset email sent', description: 'Check your email for password reset instructions.' });
                      } else {
                        toast({ title: 'Error', description: result.error || 'Failed to send reset email', variant: 'destructive' });
                      }
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
