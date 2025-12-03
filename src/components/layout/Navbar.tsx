import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Compare', path: '/compare' },
  { name: 'Support', path: '/support' },
  { name: 'Dealers', path: '/dealers' },
  { name: 'Blog', path: '/blog' },
  { name: 'About Us', path: '/about' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">NexaTech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 gradient-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="default" size="sm">
                  <User className="w-4 h-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-secondary rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
