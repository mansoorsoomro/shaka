'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product, ProductCategory, ProductVariation, ProductSize } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  product?: Product;
  mode?: 'create' | 'edit';
  categories?: ProductCategory[];
  sizes?: ProductSize[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode = 'create',
  categories = [],
  sizes = []
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sku: '',
    category_id: '',
    is_active: 1,
    variations: [] as Partial<ProductVariation>[],
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        sku: product.sku,
        category_id: product.category.id.toString(),
        is_active: product.is_active,
        variations: product.variations.map(variation => ({
          id: variation.id,
          size_id: variation.size.id.toString(),
          sku: variation.sku,
          price: variation.price,
          quantity_per_pack: variation.quantity_per_pack,
          stock: variation.stock,
          absorbency_level: variation.absorbency_level,
          is_active: variation.is_active,
          price_per_piece: variation.price_per_piece,
        })),
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        sku: '',
        category_id: '',
        is_active: 1,
        variations: [{
          size_id: '',
          sku: '',
          price: 0,
          quantity_per_pack: 1,
          stock: 0,
          absorbency_level: '',
          is_active: 1,
          price_per_piece: 0,
        }],
      });
    }
  }, [product, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariationChange = (index: number, field: string, value: string | number) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
    }));
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          size_id: '',
          sku: '',
          price: 0,
          quantity_per_pack: 1,
          stock: 0,
          absorbency_level: '',
          is_active: 1,
          price_per_piece: 0,
        },
      ],
    }));
  };

  const removeVariation = (index: number) => {
    if (formData.variations.length > 1) {
      setFormData((prev) => ({
        ...prev,
        variations: prev.variations.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a mock product object for now (in a real app, this would be sent to the API)
    const newProduct: Product = {
      id: product?.id || Date.now(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      sku: formData.sku,
      category: categories.find(cat => cat.id.toString() === formData.category_id) || {
        id: parseInt(formData.category_id),
        name: 'Unknown',
        slug: '',
        description: '',
        is_active: 1,
        created_at: '',
        updated_at: '',
      },
      is_active: formData.is_active,
      featured_image: product?.featured_image || null,
      images: product?.images || [],
      variations: formData.variations.map((variation, index) => ({
        id: variation.id || Date.now() + index,
        product_id: product?.id || Date.now(),
        size: sizes.find(size => size.id.toString() === variation.size_id) || {
          id: parseInt(variation.size_id || '0'),
          name: 'Unknown',
          code: '',
          is_active: 1,
          created_at: '',
          updated_at: '',
        },
        sku: variation.sku || '',
        price: variation.price || 0,
        quantity_per_pack: variation.quantity_per_pack || 1,
        stock: variation.stock || 0,
        absorbency_level: variation.absorbency_level || '',
        is_active: variation.is_active || 1,
        price_per_piece: variation.price_per_piece || 0,
        total_pieces: (variation.quantity_per_pack || 1) * (variation.stock || 0),
        created_at: '',
        updated_at: '',
      })),
      created_at: product?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSubmit(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <Card className="relative w-full max-w-2xl my-8 transform text-left shadow-xl transition-all sm:my-8 max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{mode === 'edit' ? 'Edit Product' : 'Create New Product'}</CardTitle>
              <CardDescription>{mode === 'edit' ? 'Update product details' : 'Add a new product to your catalog'}</CardDescription>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <Input
                    type="text"
                    name="sku"
                    placeholder="Enter SKU"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <Input
                  type="text"
                  name="slug"
                  placeholder="Enter slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleSelectChange('category_id', value)}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select
                    value={formData.is_active.toString()}
                    onValueChange={(value) => handleSelectChange('is_active', parseInt(value))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Product Variations */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Product Variations</h3>
                  <Button
                    type="button"
                    onClick={addVariation}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Variation
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.variations.map((variation, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Variation {index + 1}</h4>
                        {formData.variations.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeVariation(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size *
                          </label>
                          <Select
                            value={variation.size_id}
                            onValueChange={(value) => handleVariationChange(index, 'size_id', value)}
                          >
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {sizes.map((size) => (
                                <SelectItem key={size.id} value={size.id.toString()}>
                                  {size.name} ({size.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Variation SKU *
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter variation SKU"
                            value={variation.sku || ''}
                            onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
                            required
                            className="border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                          </label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={variation.price || ''}
                            onChange={(e) => handleVariationChange(index, 'price', parseFloat(e.target.value))}
                            required
                            className="border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity per Pack *
                          </label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={variation.quantity_per_pack || ''}
                            onChange={(e) => handleVariationChange(index, 'quantity_per_pack', parseInt(e.target.value))}
                            required
                            className="border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock *
                          </label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={variation.stock || ''}
                            onChange={(e) => handleVariationChange(index, 'stock', parseInt(e.target.value))}
                            required
                            className="border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Absorbency Level *
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g., Light, Medium, Heavy"
                            value={variation.absorbency_level || ''}
                            onChange={(e) => handleVariationChange(index, 'absorbency_level', e.target.value)}
                            required
                            className="border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {mode === 'edit' ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
      });
    }
  }, [product, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: product?.id || Date.now().toString(),
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`,
      stock: parseInt(formData.stock) || 0,
      status: formData.status,
      rating: parseFloat(formData.rating) || 0,
    };
    onSubmit(newProduct);
    setFormData({
      name: '',
      sku: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      rating: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <Card className="relative w-full max-w-md my-8 transform text-left shadow-xl transition-all sm:my-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{mode === 'edit' ? 'Edit Product' : 'Create New Product'}</CardTitle>
              <CardDescription>{mode === 'edit' ? 'Update product details' : 'Add a new product to your catalog'}</CardDescription>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <Input
                  type="text"
                  name="sku"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Input
                  type="text"
                  name="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <Input
                  type="text"
                  name="price"
                  placeholder="Enter price (e.g., 99.99)"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  name="stock"
                  placeholder="Enter stock quantity"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <Input
                  type="number"
                  name="rating"
                  placeholder="Enter rating (0-5)"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {mode === 'edit' ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
