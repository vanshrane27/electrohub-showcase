import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, Package, Edit, Save } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-001', date: '2024-01-15', items: 2, total: 149999, status: 'Delivered' },
  { id: 'ORD-002', date: '2024-01-10', items: 1, total: 74999, status: 'Shipped' },
  { id: 'ORD-003', date: '2024-01-05', items: 3, total: 24997, status: 'Processing' },
];

export default function Dashboard() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSaveProfile = () => {
    updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
    });
    setIsEditing(false);
    toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">My Dashboard</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {!isEditing && (
                    <>
                      <h3 className="font-heading font-semibold text-lg">{user?.name}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="flex-1">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{user?.phone || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>January 2024</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Orders Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5" />
                  Order History
                </h2>

                {mockOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/products')}
                      className="mt-4"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="p-3 text-left font-medium">Order ID</th>
                          <th className="p-3 text-left font-medium">Date</th>
                          <th className="p-3 text-left font-medium hidden sm:table-cell">Items</th>
                          <th className="p-3 text-left font-medium">Total</th>
                          <th className="p-3 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOrders.map(order => (
                          <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                            <td className="p-3 font-medium">{order.id}</td>
                            <td className="p-3 text-muted-foreground">{order.date}</td>
                            <td className="p-3 text-muted-foreground hidden sm:table-cell">{order.items}</td>
                            <td className="p-3">{formatPrice(order.total)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Delivered' ? 'bg-success/20 text-success' :
                                order.status === 'Shipped' ? 'bg-primary/20 text-primary' :
                                'bg-warning/20 text-warning'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
