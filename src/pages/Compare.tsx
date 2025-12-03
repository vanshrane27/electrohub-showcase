import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { products, categories, ProductCategory, Product } from '@/data/products';
import { Plus, X, Star, Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Compare() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('laptop');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const categoryProducts = products.filter(p => p.category === selectedCategory);
  const availableProducts = categoryProducts.filter(
    p => !selectedProducts.find(sp => sp.id === p.id)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSelector(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const clearAll = () => {
    setSelectedProducts([]);
  };

  // Get all unique spec labels from selected products
  const allSpecLabels = [...new Set(selectedProducts.flatMap(p => p.specs.map(s => s.label)))];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Compare Products</h1>
            <p className="text-muted-foreground">
              Select 2 to 4 products from the same category to compare specifications
            </p>
          </div>

          {/* Category Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3">Select Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as ProductCategory);
                    setSelectedProducts([]);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {selectedProducts.map(product => (
              <div
                key={product.id}
                className="relative bg-card rounded-xl border border-border p-4"
              >
                <button
                  onClick={() => removeProduct(product.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
              </div>
            ))}

            {selectedProducts.length < 4 && (
              <button
                onClick={() => setShowSelector(true)}
                className="aspect-square bg-card rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Add Product</span>
              </button>
            )}
          </div>

          {/* Product Selector Modal */}
          {showSelector && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold">Select Product</h3>
                  <button onClick={() => setShowSelector(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {availableProducts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No more products available in this category
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {availableProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="p-4 bg-background rounded-xl border border-border hover:border-primary text-left transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full aspect-video object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                          <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedProducts.length >= 2 && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold">Comparison</h2>
                <Button variant="ghost" onClick={clearAll}>
                  Clear All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-muted-foreground font-medium w-48">
                        Feature
                      </th>
                      {selectedProducts.map(product => (
                        <th key={product.id} className="p-4 text-center font-medium">
                          {product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr className="border-b border-border bg-secondary/30">
                      <td className="p-4 font-medium">Price</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <span className="font-bold text-lg text-primary">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Rating</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="font-medium">{product.rating}</span>
                            <span className="text-muted-foreground text-sm">
                              ({product.reviewCount})
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Stock */}
                    <tr className="border-b border-border bg-secondary/30">
                      <td className="p-4 font-medium">Availability</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          {product.inStock ? (
                            <span className="inline-flex items-center gap-1 text-success">
                              <Check className="w-4 h-4" /> In Stock
                            </span>
                          ) : (
                            <span className="text-destructive">Out of Stock</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Specs */}
                    {allSpecLabels.map((label, i) => (
                      <tr key={label} className={cn('border-b border-border', i % 2 === 0 && 'bg-secondary/30')}>
                        <td className="p-4 font-medium">{label}</td>
                        {selectedProducts.map(product => {
                          const spec = product.specs.find(s => s.label === label);
                          return (
                            <td key={product.id} className="p-4 text-center">
                              {spec?.value || <Minus className="w-4 h-4 mx-auto text-muted-foreground" />}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Features */}
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium align-top">Key Features</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="p-4">
                          <ul className="text-sm space-y-1">
                            {product.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedProducts.length < 2 && (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground">
                Select at least 2 products to start comparing
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
