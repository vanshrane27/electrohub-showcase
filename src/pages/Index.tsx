import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getBestSellers, getNewArrivals } from '@/data/products';
import { 
  Monitor, Laptop, Cpu, Shield, Headphones, Lightbulb, 
  CreditCard, Star, ChevronRight, ArrowRight, Send 
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const usps = [
  { icon: Shield, title: '3-Year Warranty', desc: 'Extended coverage on all products' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer service' },
  { icon: Lightbulb, title: 'Innovation First', desc: 'Cutting-edge technology' },
  { icon: CreditCard, title: 'Easy EMI', desc: 'Flexible payment options' },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'Gaming Enthusiast', rating: 5, text: 'The NexaBook Pro is an absolute beast! Best gaming laptop I\'ve ever owned.', avatar: 'RS' },
  { name: 'Priya Patel', role: 'Content Creator', rating: 5, text: 'Crystal clear display and amazing color accuracy. Perfect for my editing work.', avatar: 'PP' },
  { name: 'Amit Kumar', role: 'IT Professional', rating: 4, text: 'Reliable workstation PCs. Our entire office uses NexaTech products.', avatar: 'AK' },
];

const categories = [
  { name: 'Smart TVs', icon: Monitor, desc: 'Immersive entertainment', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400' },
  { name: 'Laptops', icon: Laptop, desc: 'Power on the go', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { name: 'Desktop PCs', icon: Cpu, desc: 'Ultimate performance', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400' },
];

export default function Index() {
  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: 'Subscribed!', description: 'Thank you for subscribing to our newsletter.' });
      setEmail('');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 gradient-glow opacity-50" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                <Lightbulb className="w-4 h-4" />
                Innovating Tomorrow, Today
              </span>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Experience{' '}
                <span className="text-gradient">Next-Gen</span>
                <br />Technology
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Discover premium TVs, powerful laptops, and high-performance PCs designed for the future. Built with precision, delivered with excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button variant="hero" size="xl">
                    Explore Products
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="glass" size="xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative animate-float">
                <img
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"
                  alt="Premium Smart TV"
                  className="rounded-2xl shadow-elevated"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl border border-border shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="font-heading font-bold text-xl">₹29,999</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect device for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to="/products"
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-glow">
                    <cat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-muted-foreground text-sm">{cat.desc}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground">Our most popular products</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">Latest additions to our collection</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Choose NexaTech?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering excellence in every product
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map(usp => (
              <div
                key={usp.title}
                className="p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <usp.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{usp.title}</h3>
                <p className="text-muted-foreground text-sm">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real experiences from real customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive deals, new product launches, and tech tips.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              required
            />
            <Button type="submit" variant="hero" className="px-6">
              Subscribe <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
