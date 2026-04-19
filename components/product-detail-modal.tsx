'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Star, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

const getStatusColor = (status: number) => {
  return status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
};

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onEdit,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Product Details</CardTitle>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                <p className="font-semibold text-foreground">{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                <p className="font-semibold text-foreground">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground">{product.category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(product.is_active)}>
                  {product.is_active === 1 ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="font-semibold text-foreground">{product.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{product.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{new Date(product.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {product.featured_image && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Featured Image
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={product.featured_image.image_url}
                  alt={product.featured_image.alt_text}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div>
                  <p className="text-sm font-medium">{product.featured_image.alt_text}</p>
                  <p className="text-xs text-muted-foreground">{product.featured_image.image_path}</p>
                </div>
              </div>
            </div>
          )}

          {/* All Images */}
          {product.images && product.images.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Product Images ({product.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="flex flex-col items-center gap-2">
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="text-center">
                      <p className="text-xs font-medium">{image.alt_text}</p>
                      {image.is_featured === 1 && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Variations */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Product Variations</h3>
            <div className="space-y-4">
              {product.variations && product.variations.length > 0 ? (
                product.variations.map((variation) => (
                  <div key={variation.id} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <p className="font-medium">{variation.size?.name} ({variation.size?.code})</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">SKU</p>
                        <p className="font-medium">{variation.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium text-lg text-primary">${variation.price?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Stock</p>
                        <p className={`font-medium ${variation.stock && variation.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {variation.stock} packs ({variation.total_pieces} pieces)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity per Pack</p>
                        <p className="font-medium">{variation.quantity_per_pack}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Absorbency Level</p>
                        <p className="font-medium">{variation.absorbency_level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price per Piece</p>
                        <p className="font-medium">${variation.price_per_piece?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={getStatusColor(variation.is_active ? 1 : 0)}>
                          {variation.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No variations available</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Edit Product
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
