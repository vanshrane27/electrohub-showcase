import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, Download, HelpCircle, MessageSquare, 
  ChevronDown, ChevronUp, Search, CheckCircle, Loader2,
  Phone, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How do I register my product warranty?',
    a: 'Fill out the warranty registration form above with your product details and purchase information. You will receive a confirmation email once registered.',
  },
  {
    q: 'What is covered under warranty?',
    a: 'Our standard warranty covers manufacturing defects and hardware failures. Physical damage, water damage, and unauthorized repairs are not covered.',
  },
  {
    q: 'How long does repair take?',
    a: 'Most repairs are completed within 5-7 business days. Complex repairs may take up to 14 days. You will be notified of the status via email.',
  },
  {
    q: 'Can I extend my warranty?',
    a: 'Yes! Extended warranty plans are available for purchase within 30 days of your original purchase. Contact our support team for details.',
  },
  {
    q: 'Where can I find drivers for my product?',
    a: 'Use the Drivers & Software section below. Select your product category and model to find the latest drivers and software updates.',
  },
];

const drivers = [
  { name: 'NexaBook Pro Graphics Driver', version: 'v4.5.2', date: '2024-01-15', size: '145 MB' },
  { name: 'NexaVision TV Firmware', version: 'v2.1.0', date: '2024-01-10', size: '89 MB' },
  { name: 'NexaTower Audio Driver', version: 'v1.8.3', date: '2024-01-05', size: '23 MB' },
  { name: 'Universal USB Controller', version: 'v3.0.1', date: '2024-01-01', size: '12 MB' },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [warrantyForm, setWarrantyForm] = useState({
    productSerial: '',
    purchaseDate: '',
    email: '',
    name: '',
  });
  const [warrantyCheckSerial, setWarrantyCheckSerial] = useState('');
  const [warrantyStatus, setWarrantyStatus] = useState<null | { valid: boolean; expiry: string }>(null);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    message: '',
  });
  const [submittingWarranty, setSubmittingWarranty] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleWarrantyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingWarranty(true);

    try {
      const { data, error } = await supabase
        .from('warranties')
        .insert({
          serial_number: warrantyForm.productSerial,
          purchase_date: warrantyForm.purchaseDate,
          name: warrantyForm.name,
          email: warrantyForm.email,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

        toast({
          title: 'Warranty Registered!',
          description: 'Your product warranty has been successfully registered.',
        });
        setWarrantyForm({ productSerial: '', purchaseDate: '', email: '', name: '' });
    } catch (error) {
      console.error('Error registering warranty:', error);
      toast({
        title: 'Error',
        description: 'Failed to register warranty. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingWarranty(false);
    }
  };

  const handleWarrantyCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!warrantyCheckSerial.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a serial number',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('serial_number', warrantyCheckSerial)
        .order('registered_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        // No warranty found
        setWarrantyStatus({
          valid: false,
          expiry: '',
        });
        toast({
          title: 'Warranty Not Found',
          description: 'No warranty found for this serial number.',
          variant: 'destructive',
        });
        return;
      }

      // Calculate warranty expiry (assuming 1 year warranty from purchase date)
      const purchaseDate = new Date(data.purchase_date);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const today = new Date();
      const isValid = expiryDate > today;

    setWarrantyStatus({
        valid: isValid,
        expiry: expiryDate.toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error checking warranty:', error);
      toast({
        title: 'Error',
        description: 'Failed to check warranty status. Please try again.',
        variant: 'destructive',
    });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);

    try {
      // 1. Store in Supabase
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('contact_forms')
        .insert({
          first_name: contactForm.firstName,
          last_name: contactForm.lastName,
          phone: contactForm.phone,
          message: contactForm.message,
          status: 'New',
        })
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // 2. Trigger n8n webhook for Retell AI call
      const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (n8nWebhookUrl) {
        try {
          const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: contactForm.firstName,
              last_name: contactForm.lastName,
              phone: contactForm.phone,
              message: contactForm.message,
            }),
      });

          if (!n8nResponse.ok) {
            console.warn('N8N webhook failed, but data saved in Supabase');
          }
        } catch (webhookError) {
          // Don't fail the form submission if webhook fails
          console.warn('Failed to trigger n8n webhook:', webhookError);
        }
      }

        toast({
          title: 'Message Sent!',
          description: 'Our support team will contact you within 24 hours.',
        });
        setContactForm({ firstName: '', lastName: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingContact(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Support Center</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get help with your NexaTech products. Register warranty, download drivers, or contact our support team.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Warranty Section */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Product Warranty
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Register Warranty */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-heading text-lg font-semibold mb-4">Register Warranty</h3>
                <form onSubmit={handleWarrantyRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Serial Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., NXT-123456789"
                      value={warrantyForm.productSerial}
                      onChange={e => setWarrantyForm({ ...warrantyForm, productSerial: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Date</label>
                    <input
                      type="date"
                      required
                      value={warrantyForm.purchaseDate}
                      onChange={e => setWarrantyForm({ ...warrantyForm, purchaseDate: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={warrantyForm.name}
                      onChange={e => setWarrantyForm({ ...warrantyForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={warrantyForm.email}
                      onChange={e => setWarrantyForm({ ...warrantyForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submittingWarranty}>
                    {submittingWarranty ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Register Warranty'
                    )}
                  </Button>
                </form>
              </div>

              {/* Check Warranty */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-heading text-lg font-semibold mb-4">Check Warranty Status</h3>
                <form onSubmit={handleWarrantyCheck} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Serial Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., NXT-123456789"
                      value={warrantyCheckSerial}
                      onChange={e => setWarrantyCheckSerial(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Check Status
                  </Button>
                </form>

                {warrantyStatus && (
                  <div className={cn(
                    'mt-6 p-4 rounded-lg',
                    warrantyStatus.valid ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={cn('w-5 h-5', warrantyStatus.valid ? 'text-success' : 'text-destructive')} />
                      <span className="font-medium">
                        {warrantyStatus.valid ? 'Warranty Active' : 'Warranty Expired'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expiry Date: {warrantyStatus.expiry}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Drivers Section */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
              <Download className="w-6 h-6 text-primary" />
              Drivers & Software
            </h2>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="p-4 text-left font-medium">Name</th>
                    <th className="p-4 text-left font-medium hidden sm:table-cell">Version</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Date</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Size</th>
                    <th className="p-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">{driver.name}</td>
                      <td className="p-4 hidden sm:table-cell text-muted-foreground">{driver.version}</td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{driver.date}</td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{driver.size}</td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              Contact Support
            </h2>

            <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.firstName}
                      onChange={e => setContactForm({ ...contactForm, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.lastName}
                      onChange={e => setContactForm({ ...contactForm, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" disabled={submittingContact}>
                  {submittingContact ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>

              {/* WhatsApp and Call Us Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}