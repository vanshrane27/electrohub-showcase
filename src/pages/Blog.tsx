import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Calendar, User, ChevronRight, Clock } from 'lucide-react';

const blogPosts = [
  {
    id: 'best-gaming-laptops-under-50k',
    title: 'Best Gaming Laptops Under ₹50,000 in 2024',
    excerpt: 'Looking for a gaming laptop that won\'t break the bank? We\'ve compiled the top gaming laptops under ₹50,000 that deliver excellent performance for popular titles.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    author: 'Arun Kumar',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Laptops',
  },
  {
    id: 'how-to-choose-smart-tv',
    title: 'How to Choose the Perfect Smart TV for Your Home',
    excerpt: 'From screen size to panel type, resolution to smart features - this comprehensive guide will help you make the right decision when buying a new TV.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    author: 'Priya Sharma',
    date: '2024-01-10',
    readTime: '10 min read',
    category: 'TVs',
  },
  {
    id: 'pc-build-guide-2024',
    title: 'Complete PC Build Guide for Beginners (2024 Edition)',
    excerpt: 'Building your first PC? This step-by-step guide covers everything from choosing components to assembling your dream machine.',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800',
    author: 'Vikram Singh',
    date: '2024-01-05',
    readTime: '15 min read',
    category: 'Desktop PCs',
  },
  {
    id: 'oled-vs-qled',
    title: 'OLED vs QLED: Which TV Technology Is Right for You?',
    excerpt: 'A detailed comparison of OLED and QLED display technologies to help you understand the differences and make an informed purchase.',
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800',
    author: 'Priya Sharma',
    date: '2024-01-01',
    readTime: '7 min read',
    category: 'TVs',
  },
  {
    id: 'laptop-maintenance-tips',
    title: '10 Essential Laptop Maintenance Tips for Longevity',
    excerpt: 'Keep your laptop running smoothly for years with these simple but effective maintenance practices.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    author: 'Arun Kumar',
    date: '2023-12-28',
    readTime: '6 min read',
    category: 'Laptops',
  },
  {
    id: 'ssd-upgrade-guide',
    title: 'How to Upgrade Your PC with an SSD: Complete Guide',
    excerpt: 'Transform your computer\'s performance with an SSD upgrade. Learn how to choose, install, and migrate your data.',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
    author: 'Vikram Singh',
    date: '2023-12-20',
    readTime: '12 min read',
    category: 'Desktop PCs',
  },
];

export default function Blog() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Tech Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert guides, reviews, and tips to help you make the most of your technology.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Post */}
          <div className="mb-16">
            <Link
              to={`/blog/${featuredPost.id}`}
              className="group block bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-flex px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full w-fit mb-4">
                    {featuredPost.category}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Other Posts */}
          <div>
            <h2 className="font-heading text-2xl font-bold mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group block bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(post.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-card rounded-2xl border border-border p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-2">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest tech news and guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 gradient-primary text-primary-foreground font-medium rounded-lg hover:shadow-glow transition-shadow">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
