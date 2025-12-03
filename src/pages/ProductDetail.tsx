import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getProductById, products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { 
  Star, ShoppingCart, Zap, ChevronDown, ChevronUp, 
  Check, Truck, Shield, RotateCcw, Minus, Plus 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const product = id ? getProductById(id) : null;

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/products')}>Products</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Main */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="aspect-square bg-card rounded-2xl overflow-hidden border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(product.rating)
                          ? 'fill-warning text-warning'
                          : 'text-muted'
                      )}
                    />
                  ))}
                  <span className="ml-2 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-heading text-4xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2 py-1 bg-success/20 text-success text-sm font-medium rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5 text-success" />
                    <span className="text-success font-medium">In Stock</span>
                  </>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-card rounded-lg border border-border text-center">
                  <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Free Delivery</p>
                </div>
                <div className="p-3 bg-card rounded-lg border border-border text-center">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">3 Year Warranty</p>
                </div>
                <div className="p-3 bg-card rounded-lg border border-border text-center">
                  <RotateCcw className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specs Table */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6">Detailed Specifications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.specs.map((spec, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex justify-between py-3 px-4 rounded-lg',
                    i % 2 === 0 ? 'bg-secondary/50' : 'bg-background'
                  )}
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          {product.faqs.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-16">
              <h2 className="font-heading text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-muted-foreground">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-8 mb-8">
              <div className="text-center">
                <div className="font-heading text-5xl font-bold text-foreground">{product.rating}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(product.rating)
                          ? 'fill-warning text-warning'
                          : 'text-muted'
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {product.reviewCount} reviews
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-center">
              Customer reviews coming soon. Be the first to review this product!
            </p>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
