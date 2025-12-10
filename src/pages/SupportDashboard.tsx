import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, MessageSquare, MapPin, RefreshCw, 
  Phone, Mail, Calendar, Clock, User,
  FileText, Building2, AlertCircle, Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WarrantyRecord {
  id: string;
  serialNumber: string;
  purchaseDate: string;
  name: string;
  email: string;
  registeredAt: string;
}

interface ContactFormRecord {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
  submittedAt: string;
  status: string;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  status: string;
  items: any;
  shipping_address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const dealers = [
  { id: 1, name: 'TechWorld Electronics', country: 'India', city: 'Mumbai', address: '123 Marine Drive, Mumbai 400001', phone: '+91 22 1234 5678', email: 'mumbai@techworld.in', type: 'Dealer' },
  { id: 2, name: 'Digital Hub', country: 'India', city: 'Delhi', address: '456 Connaught Place, New Delhi 110001', phone: '+91 11 2345 6789', email: 'delhi@digitalhub.in', type: 'Dealer' },
  { id: 3, name: 'Gadget Zone', country: 'India', city: 'Bangalore', address: '789 MG Road, Bangalore 560001', phone: '+91 80 3456 7890', email: 'blr@gadgetzone.in', type: 'Dealer' },
  { id: 4, name: 'Smart Systems', country: 'India', city: 'Chennai', address: '321 Anna Salai, Chennai 600002', phone: '+91 44 4567 8901', email: 'chennai@smartsystems.in', type: 'Service Center' },
  { id: 5, name: 'Tech Paradise', country: 'USA', city: 'New York', address: '100 5th Avenue, NY 10011', phone: '+1 212 555 0100', email: 'nyc@techparadise.com', type: 'Dealer' },
  { id: 6, name: 'Silicon Store', country: 'USA', city: 'San Francisco', address: '200 Market Street, SF 94102', phone: '+1 415 555 0200', email: 'sf@siliconstore.com', type: 'Service Center' },
  { id: 7, name: 'Digital Dreams', country: 'UK', city: 'London', address: '50 Oxford Street, London W1D 1BF', phone: '+44 20 7123 4567', email: 'london@digitaldreams.co.uk', type: 'Dealer' },
  { id: 8, name: 'Euro Electronics', country: 'Germany', city: 'Berlin', address: 'Friedrichstraße 123, 10117 Berlin', phone: '+49 30 1234567', email: 'berlin@euroelectronics.de', type: 'Service Center' },
  { id: 9, name: 'Tech Oasis', country: 'UAE', city: 'Dubai', address: 'Dubai Mall, Downtown Dubai', phone: '+971 4 123 4567', email: 'dubai@techoasis.ae', type: 'Dealer' },
  { id: 10, name: 'Asia Tech', country: 'Singapore', city: 'Singapore', address: '10 Orchard Road, Singapore 238826', phone: '+65 6123 4567', email: 'sg@asiatech.com', type: 'Dealer' },
];

type TabType = 'warranties' | 'contacts' | 'orders' | 'dealers';

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('warranties');
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([]);
  const [contactForms, setContactForms] = useState<ContactFormRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch warranties
      const { data: warrantiesData, error: warrantiesError } = await supabase
        .from('warranties')
        .select('*')
        .order('registered_at', { ascending: false });

      if (warrantiesError) {
        throw warrantiesError;
      }

      // Fetch contact forms
      const { data: contactFormsData, error: contactFormsError } = await supabase
        .from('contact_forms')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (contactFormsError) {
        throw contactFormsError;
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Transform warranties data to match the interface
      const transformedWarranties: WarrantyRecord[] = (warrantiesData || []).map(w => ({
        id: w.id,
        serialNumber: w.serial_number,
        purchaseDate: w.purchase_date,
        name: w.name,
        email: w.email,
        registeredAt: w.registered_at || w.created_at || '',
      }));

      // Transform contact forms data to match the interface
      const transformedContactForms: ContactFormRecord[] = (contactFormsData || []).map(cf => ({
        id: cf.id,
        firstName: cf.first_name,
        lastName: cf.last_name,
        phone: cf.phone,
        message: cf.message,
        submittedAt: cf.submitted_at || cf.created_at || '',
        status: cf.status || 'New',
      }));

      // Transform orders data
      const transformedOrders: OrderRecord[] = (ordersData || []).map(o => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        customer_phone: o.customer_phone,
        total_amount: Number(o.total_amount),
        status: o.status,
        items: o.items,
        shipping_address: o.shipping_address,
        created_at: o.created_at,
        updated_at: o.updated_at,
      }));

      setWarranties(transformedWarranties);
      setContactForms(transformedContactForms);
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data from Supabase',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const tabs = [
    { id: 'warranties' as TabType, label: 'Product Warranties', icon: Shield, count: warranties.length },
    { id: 'contacts' as TabType, label: 'Contact Forms', icon: MessageSquare, count: contactForms.length },
    { id: 'orders' as TabType, label: 'Orders', icon: Package, count: orders.length },
    { id: 'dealers' as TabType, label: 'Dealers & Service Centers', icon: MapPin, count: dealers.length },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold mb-2">Support Center Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage warranties, support requests, and dealer information
                </p>
              </div>
              <Button
                onClick={fetchData}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered Warranties</p>
                  <p className="text-2xl font-bold">{warranties.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Support Requests</p>
                  <p className="text-2xl font-bold">{contactForms.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dealers & Centers</p>
                  <p className="text-2xl font-bold">{dealers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={cn(
                  'ml-1 px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Warranties Tab */}
              {activeTab === 'warranties' && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  {warranties.length === 0 ? (
                    <div className="p-12 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No warranty registrations yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50">
                            <th className="p-4 text-left font-medium">Serial Number</th>
                            <th className="p-4 text-left font-medium">Customer</th>
                            <th className="p-4 text-left font-medium hidden md:table-cell">Email</th>
                            <th className="p-4 text-left font-medium hidden lg:table-cell">Purchase Date</th>
                            <th className="p-4 text-left font-medium">Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {warranties.map((warranty, idx) => (
                            <tr key={warranty.id || idx} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary" />
                                  <span className="font-mono text-sm">{warranty.serialNumber}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  {warranty.name}
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell text-muted-foreground">
                                {warranty.email}
                              </td>
                              <td className="p-4 hidden lg:table-cell">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(warranty.purchaseDate)}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  {formatDateTime(warranty.registeredAt)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Forms Tab */}
              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  {contactForms.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No contact form submissions yet</p>
                    </div>
                  ) : (
                    contactForms.map((form, idx) => (
                      <div key={form.id || idx} className="bg-card rounded-xl border border-border p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{form.firstName} {form.lastName}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {form.phone}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium',
                              form.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                            )}>
                              {form.status}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(form.submittedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <p className="text-sm">{form.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  {orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50">
                            <th className="p-4 text-left font-medium">Order Number</th>
                            <th className="p-4 text-left font-medium">Customer</th>
                            <th className="p-4 text-left font-medium hidden md:table-cell">Email</th>
                            <th className="p-4 text-left font-medium">Total</th>
                            <th className="p-4 text-left font-medium">Status</th>
                            <th className="p-4 text-left font-medium hidden lg:table-cell">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, idx) => (
                            <tr key={order.id || idx} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-primary" />
                                  <span className="font-mono text-sm font-medium">{order.order_number}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  {order.customer_name}
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell text-muted-foreground text-sm">
                                {order.customer_email}
                              </td>
                              <td className="p-4 font-medium">
                                ₹{order.total_amount.toLocaleString('en-IN')}
                              </td>
                              <td className="p-4">
                                <span className={cn(
                                  'px-2 py-1 rounded-full text-xs font-medium',
                                  order.status === 'not_dispatched' ? 'bg-warning/20 text-warning' :
                                  order.status === 'dispatched' ? 'bg-primary/20 text-primary' :
                                  order.status === 'shipped' ? 'bg-accent/20 text-accent' :
                                  'bg-success/20 text-success'
                                )}>
                                  {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </td>
                              <td className="p-4 hidden lg:table-cell">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(order.created_at || '')}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Dealers Tab */}
              {activeTab === 'dealers' && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="p-4 text-left font-medium">Name</th>
                          <th className="p-4 text-left font-medium">Type</th>
                          <th className="p-4 text-left font-medium">Location</th>
                          <th className="p-4 text-left font-medium hidden md:table-cell">Address</th>
                          <th className="p-4 text-left font-medium hidden lg:table-cell">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dealers.map(dealer => (
                          <tr key={dealer.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                            <td className="p-4 font-medium">{dealer.name}</td>
                            <td className="p-4">
                              <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                dealer.type === 'Dealer' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                              )}>
                                {dealer.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {dealer.city}, {dealer.country}
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell text-muted-foreground text-sm">
                              {dealer.address}
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 text-primary" />
                                  {dealer.phone}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {dealer.email}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}