"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import type { Product as ApiProduct } from "@/lib/services/types";
import type { Category, Size } from "@/lib/services/types";
import { metaService } from "@/lib/services/meta-service";

export type AdminProductFormMode = "create" | "edit";

export interface AdminProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AdminProductFormMode;
  product: ApiProduct | null;
  onSubmitFormData: (formData: FormData) => Promise<void>;
}

type VariationRow = {
  id?: number;
  size_id: string;
  sku?: string;
  price: string;
  quantity_per_pack: string;
  stock: string;
  absorbency_level: string;
  is_active: string;
};

export default function AdminProductFormModal({
  isOpen,
  onClose,
  mode,
  product,
  onSubmitFormData,
}: AdminProductFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [featuredImageIndex, setFeaturedImageIndex] = useState("0");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);
  const [variations, setVariations] = useState<VariationRow[]>([
    { size_id: "", price: "", quantity_per_pack: "", stock: "", absorbency_level: "", is_active: "1" },
  ]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      setLoadingMeta(true);
      try {
        const [catRes, sizeRes] = await Promise.all([
          metaService.getCategories(),
          metaService.getSizes(),
        ]);
        if (cancelled) return;
        if (catRes.success && catRes.data) setCategories(catRes.data);
        if (sizeRes.success && sizeRes.data) setSizes(sizeRes.data);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && product) {
      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setCategoryId(String(product.category?.id ?? product.category_id ?? ""));
      setIsActive(product.is_active === 1 ? true : false);
      setFeaturedImageIndex("0");
      setImageFiles([]);
      setDeleteImageIds([]);
      const vars = (product.variations ?? []).map((v) => ({
        id: v.id,
        size_id: String(v.size?.id ?? v.size_id ?? ""),
        price: String(v.price ?? ""),
        quantity_per_pack: String(v.quantity_per_pack ?? ""),
        stock: String(v.stock ?? ""),
        absorbency_level: String(v.absorbency_level ?? ""),
        is_active: v.is_active === false || v.is_active === 0 ? "0" : "1",
      }));
      setVariations(
        vars.length > 0
          ? vars
          : [{ size_id: "", price: "", quantity_per_pack: "", stock: "", absorbency_level: "", is_active: "1" }],
      );
    } else if (mode === "create") {
      setName("");
      setDescription("");
      setCategoryId("");
      setIsActive(true);
      setFeaturedImageIndex("0");
      setImageFiles([]);
      setDeleteImageIds([]);
      setVariations([
        { size_id: "", price: "", quantity_per_pack: "", stock: "", absorbency_level: "", is_active: "1" },
      ]);
    }
  }, [isOpen, mode, product]);

  const addVariationRow = () => {
    setVariations((v) => [
      ...v,
      { size_id: "", price: "", quantity_per_pack: "", stock: "", absorbency_level: "", is_active: "1" },
    ]);
  };

  const removeVariationRow = (index: number) => {
    setVariations((v) => (v.length <= 1 ? v : v.filter((_, i) => i !== index)));
  };

  const updateVariation = (index: number, patch: Partial<VariationRow>) => {
    setVariations((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("description", description.trim());
    fd.append("category_id", categoryId);
    fd.append("is_active", isActive ? "1" : "0");
    fd.append("featured_image_index", featuredImageIndex.trim() || "0");

    imageFiles.forEach((file, i) => {
      fd.append(`images[${i}]`, file);
    });

    deleteImageIds.forEach((id) => {
      fd.append("delete_image_ids[]", id);
    });

    variations.forEach((row, i) => {
      if (mode === "edit" && row.id) {
        fd.append(`variations[${i}][id]`, String(row.id));
      }
      fd.append(`variations[${i}][size_id]`, row.size_id);
      fd.append(`variations[${i}][price]`, row.price);
      fd.append(`variations[${i}][quantity_per_pack]`, row.quantity_per_pack || "0");
      fd.append(`variations[${i}][stock]`, row.stock || "0");
      if (row.absorbency_level.trim()) {
        fd.append(`variations[${i}][absorbency_level]`, row.absorbency_level.trim());
      }
      fd.append(`variations[${i}][is_active]`, row.is_active);
    });

    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitFormData(buildFormData());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <Card className="relative my-8 w-full max-w-lg transform text-left shadow-xl transition-all sm:my-8 sm:max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{mode === "edit" ? "Edit product" : "Add product"}</CardTitle>
              <CardDescription>
                Matches admin API: POST /api/products and POST /api/products/:id
              </CardDescription>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
              <X size={20} className="text-gray-600" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required className="border-gray-300" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    disabled={loadingMeta}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    Active
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Featured image index</label>
                  <Input
                    value={featuredImageIndex}
                    onChange={(e) => setFeaturedImageIndex(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">New images (optional)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                    className="border-gray-300"
                  />
                </div>
                {mode === "edit" && product && (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Current Images</label>
                    {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                      <div className="grid gap-3">
                        {product.images.map((img) => {
                          // Handle both ProductImage objects and string paths
                          const imgObj = typeof img === 'string' ? { id: 0, image_url: img, alt_text: 'Image' } : img;
                          const isToDelete = deleteImageIds.includes(String(imgObj.id));
                          return (
                            <div
                              key={imgObj.id}
                              className={`flex items-center gap-3 rounded-lg border p-2 ${
                                isToDelete ? 'bg-red-50 opacity-50' : 'bg-gray-50'
                              }`}
                            >
                              <img
                                src={imgObj.image_url}
                                alt={imgObj.alt_text}
                                className="h-16 w-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-xs text-gray-700">{imgObj.alt_text}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (isToDelete) {
                                    setDeleteImageIds(deleteImageIds.filter((id) => id !== String(imgObj.id)));
                                  } else {
                                    setDeleteImageIds([...deleteImageIds, String(imgObj.id)]);
                                  }
                                }}
                                className={isToDelete ? 'text-green-600' : 'text-red-600'}
                              >
                                {isToDelete ? 'Restore' : 'Delete'}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No images yet</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">Variations</p>
                  <Button type="button" variant="outline" size="sm" onClick={addVariationRow} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add row
                  </Button>
                </div>
                {variations.map((row, index) => (
                  <div key={index} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Size</label>
                      <select
                        value={row.size_id}
                        onChange={(e) => updateVariation(index, { size_id: e.target.value })}
                        required
                        disabled={loadingMeta}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                      >
                        <option value="">Select size</option>
                        {sizes.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Price</label>
                      <Input
                        value={row.price}
                        onChange={(e) => updateVariation(index, { price: e.target.value })}
                        required
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Qty / pack</label>
                      <Input
                        value={row.quantity_per_pack}
                        onChange={(e) => updateVariation(index, { quantity_per_pack: e.target.value })}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Stock</label>
                      <Input
                        value={row.stock}
                        onChange={(e) => updateVariation(index, { stock: e.target.value })}
                        required
                        className="border-gray-300"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600">Absorbency (optional)</label>
                      <Input
                        value={row.absorbency_level}
                        onChange={(e) => updateVariation(index, { absorbency_level: e.target.value })}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between sm:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <input
                          type="checkbox"
                          checked={row.is_active === "1"}
                          onChange={(e) => updateVariation(index, { is_active: e.target.checked ? "1" : "0" })}
                        />
                        Variation active
                      </label>
                      {variations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariationRow(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || loadingMeta} className="flex-1 bg-primary hover:bg-primary/90">
                  {submitting ? "Saving…" : mode === "edit" ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
