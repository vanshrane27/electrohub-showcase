import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-1 bg-warning text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Best Seller
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <Button
          size="sm"
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-medium text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {product.shortSpecs}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-lg text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-xs text-success font-medium">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.inStock ? (
            <span className="text-xs text-success">In Stock</span>
          ) : (
            <span className="text-xs text-destructive">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};
