import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { products as initialProducts, Product } from '@/data/products';
import { toast } from '@/hooks/use-toast';
import { 
  Package, ShoppingCart, Plus, Pencil, Trash2, 
  Check, X, LogOut, LayoutDashboard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockOrders = [
  { id: 'ORD-001', customer: 'Rahul Sharma', date: '2024-01-15', items: 2, total: 149999, status: 'Pending' },
  { id: 'ORD-002', customer: 'Priya Patel', date: '2024-01-14', items: 1, total: 74999, status: 'Pending' },
  { id: 'ORD-003', customer: 'Amit Kumar', date: '2024-01-13', items: 3, total: 24997, status: 'Accepted' },
  { id: 'ORD-004', customer: 'Sneha Reddy', date: '2024-01-12', items: 1, total: 89999, status: 'Shipped' },
];

export default function Admin() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'laptop',
    price: '',
    shortSpecs: '',
    image: '',
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddProduct = () => {
    const product: Product = {
      id: `new-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category as any,
      price: parseInt(newProduct.price),
      image: newProduct.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      shortSpecs: newProduct.shortSpecs,
      rating: 4.0,
      reviewCount: 0,
      inStock: true,
      isNew: true,
      features: [],
      specs: [],
      faqs: [],
    };
    setProducts([product, ...products]);
    setShowAddForm(false);
    setNewProduct({ name: '', category: 'laptop', price: '', shortSpecs: '', image: '' });
    toast({ title: 'Product Added', description: `${product.name} has been added.` });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: 'Product Deleted', description: 'Product has been removed.' });
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'Accepted' } : o
    ));
    toast({ title: 'Order Accepted', description: `Order ${orderId} has been accepted.` });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Manage products and orders</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-muted-foreground text-sm">Total Products</p>
              <p className="font-heading text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-muted-foreground text-sm">Pending Orders</p>
              <p className="font-heading text-2xl font-bold text-warning">
                {orders.filter(o => o.status === 'Pending').length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-muted-foreground text-sm">Accepted Orders</p>
              <p className="font-heading text-2xl font-bold text-success">
                {orders.filter(o => o.status === 'Accepted').length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="font-heading text-2xl font-bold text-primary">
                {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('products')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                activeTab === 'products'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                activeTab === 'orders'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              Orders
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-card rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-heading font-semibold">Product Management</h2>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Add Product Form */}
              {showAddForm && (
                <div className="p-4 border-b border-border bg-secondary/30">
                  <h3 className="font-medium mb-4">Add New Product</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded-lg"
                    />
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="tv">TV</option>
                      <option value="laptop">Laptop</option>
                      <option value="pc">Desktop PC</option>
                      <option value="spare-parts">Spare Parts</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Short Specs"
                      value={newProduct.shortSpecs}
                      onChange={e => setNewProduct({ ...newProduct, shortSpecs: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddProduct}>Save Product</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="p-4 text-left font-medium">Product</th>
                      <th className="p-4 text-left font-medium hidden md:table-cell">Category</th>
                      <th className="p-4 text-left font-medium">Price</th>
                      <th className="p-4 text-left font-medium hidden sm:table-cell">Stock</th>
                      <th className="p-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map(product => (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <span className="font-medium line-clamp-1">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground capitalize">
                          {product.category.replace('-', ' ')}
                        </td>
                        <td className="p-4">{formatPrice(product.price)}</td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            product.inStock ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                          )}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-card rounded-xl border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-heading font-semibold">Order Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="p-4 text-left font-medium">Order ID</th>
                      <th className="p-4 text-left font-medium hidden sm:table-cell">Customer</th>
                      <th className="p-4 text-left font-medium hidden md:table-cell">Date</th>
                      <th className="p-4 text-left font-medium">Total</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-medium">{order.id}</td>
                        <td className="p-4 hidden sm:table-cell">{order.customer}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{order.date}</td>
                        <td className="p-4">{formatPrice(order.total)}</td>
                        <td className="p-4">
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            order.status === 'Pending' ? 'bg-warning/20 text-warning' :
                            order.status === 'Accepted' ? 'bg-success/20 text-success' :
                            'bg-primary/20 text-primary'
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {order.status === 'Pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOrder(order.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
