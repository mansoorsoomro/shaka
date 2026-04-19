"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Loader2 } from "lucide-react";
import AdminProductFormModal from "@/components/admin/admin-product-form-modal";
import ProductDetailModal from "@/components/product-detail-modal";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import ProductGrid from "@/components/products/product-grid";
import type { Product as UiProduct } from "@/types";
import type { Product as ApiProduct } from "@/lib/services/types";
import { productService } from "@/lib/services/product-service";
import { extractPaginatedProducts, isApiSuccess } from "@/lib/admin/extract";
import { toast } from "sonner";

function apiProductToGrid(p: ApiProduct): UiProduct {
  const variations = p.variations ?? [];
  const totalStock = variations.length
    ? variations.reduce((s, v) => s + (Number(v.stock) || 0), 0)
    : Number(p.stock) || 0;
  const minPrice = variations.length
    ? Math.min(...variations.map((v) => Number(v.price) || 0))
    : Number(p.price) || 0;
  const allOff =
    variations.length > 0 && variations.every((v) => v.is_active === false);
  return {
    id: String(p.id),
    name: p.name,
    sku: p.slug,
    category: p.category?.name ?? "",
    // categoryData: p.category?? "",
    // images: p.images ? p.images.map((img) => img.url) : [],
    price: `$${minPrice.toFixed(2)}`,
    stock: totalStock,
    status: allOff ? "inactive" : "active",
    rating: p.rating ?? 0,
  };
}

function apiProductToDetailModal(apiProduct: ApiProduct): import("@/types").Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    sku: apiProduct.sku || apiProduct.slug,
    category: apiProduct.category ? {
      id: apiProduct.category.id,
      name: apiProduct.category.name,
      slug: apiProduct.category.slug || "",
      description: apiProduct.category.description || "",
      is_active: apiProduct.category.is_active || 1,
      created_at: apiProduct.category.created_at || "",
      updated_at: apiProduct.category.updated_at || "",
    } : {
      id: 0,
      name: "Uncategorized",
      slug: "",
      description: "",
      is_active: 1,
      created_at: "",
      updated_at: "",
    },
    is_active: apiProduct.is_active ?? 1,
    featured_image: apiProduct.featured_image ? {
      id: apiProduct.featured_image.id || 0,
      image_path: apiProduct.featured_image.image_path || "",
      image_url: apiProduct.featured_image.image_url || "",
      is_featured: apiProduct.featured_image.is_featured || 1,
      alt_text: apiProduct.featured_image.alt_text || "",
      created_at: apiProduct.featured_image.created_at || "",
    } : null,
    images: (apiProduct.images && Array.isArray(apiProduct.images)) ? apiProduct.images.map(img => ({
      id: img.id || 0,
      image_path: img.image_path || "",
      image_url: img.image_url || "",
      is_featured: img.is_featured || 0,
      alt_text: img.alt_text || "",
      created_at: img.created_at || "",
    })) : [],
    variations: (apiProduct.variations && Array.isArray(apiProduct.variations)) ? apiProduct.variations.map(v => ({
      id: v.id || 0,
      product_id: apiProduct.id,
      size: v.size ? {
        id: v.size.id || 0,
        name: v.size.name || "Unknown",
        code: v.size.code || "",
        is_active: v.size.is_active ?? 1,
        created_at: v.size.created_at || "",
        updated_at: v.size.updated_at || "",
      } : {
        id: 0,
        name: "Unknown",
        code: "",
        is_active: 1,
        created_at: "",
        updated_at: "",
      },
      sku: v.sku || "",
      price: v.price || 0,
      quantity_per_pack: v.quantity_per_pack || 1,
      stock: v.stock || 0,
      absorbency_level: v.absorbency_level || "",
      is_active: typeof v.is_active === 'boolean' ? (v.is_active ? 1 : 0) : (v.is_active ?? 1),
      price_per_piece: v.price_per_piece || 0,
      total_pieces: v.total_pieces || 0,
      created_at: v.created_at || "",
      updated_at: v.updated_at || "",
    })) : [],
    created_at: apiProduct.created_at || "",
    updated_at: apiProduct.updated_at || "",
  };
}

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGridProduct, setSelectedGridProduct] = useState<UiProduct | null>(null);
  const [selectedApiProduct, setSelectedApiProduct] = useState<ApiProduct | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [formProduct, setFormProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);

  const loadProducts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ paginated: true, pagination: p });
      if (!isApiSuccess(res)) {
        toast.error((res as { message?: string }).message ?? "Failed to load products");
        setApiProducts([]);
        return;
      }
      const { items, lastPage: lp } = extractPaginatedProducts(res);
      setApiProducts(items);
      setLastPage(lp);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load products";
      toast.error(msg);
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(page);
  }, [loadProducts, page]);

  const gridProducts: UiProduct[] = apiProducts.map(apiProductToGrid);

  const filteredProducts = gridProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "discontinued":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 20) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const resolveApiProductForForm = async (grid: UiProduct): Promise<ApiProduct | null> => {
    const fromList = apiProducts.find((x) => String(x.id) === grid.id);
    if (fromList?.variations && fromList.variations.length > 0) return fromList;
    try {
      const res = await productService.getProduct(grid.sku || grid.id);
      if (isApiSuccess(res) && res.data) return res.data as ApiProduct;
    } catch {
      /* fall through */
    }
    return fromList ?? null;
  };

  const handleDelete = async () => {
    if (!selectedGridProduct) return;
    try {
      const res = await productService.deleteProduct(Number(selectedGridProduct.id));
      if (isApiSuccess(res)) {
        toast.success("Product deleted");
        setIsDeleteModalOpen(false);
        setSelectedGridProduct(null);
        await loadProducts(page);
      } else {
        toast.error((res as { message?: string }).message ?? "Delete failed");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast.error(msg);
    }
  };

  const handleAddProduct = () => {
    setFormMode("create");
    setFormProduct(null);
    setIsFormModalOpen(true);
  };

  const handleViewProduct = async (product: UiProduct) => {
    console.log("product",product);
    
    const full = await resolveApiProductForForm(product);
    if (!full) {
      toast.error("Could not load product details for viewing");
      return;
    }
    setSelectedGridProduct(product); // Keep the grid product for other operations
    setSelectedApiProduct(full); // Store the full API product for the modal
    setIsDetailModalOpen(true);
  };

  const handleEditProduct = async (product: UiProduct) => {
    const full = await resolveApiProductForForm(product);
    if (!full) {
      toast.error("Could not load product details for editing");
      return;
    }
    setFormMode("edit");
    setFormProduct(full);
    setIsFormModalOpen(true);
  };

  const handleConfirmDelete = (product: UiProduct) => {
    setSelectedGridProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitFormData = async (formData: FormData) => {
    try {
      if (formMode === "edit" && formProduct) {
        const res = await productService.editProduct(formProduct.id, formData);
        if (isApiSuccess(res)) {
          toast.success("Product updated");
          await loadProducts(page);
        } else {
          toast.error((res as { message?: string }).message ?? "Update failed");
          throw new Error("update failed");
        }
      } else {
        const res = await productService.addProduct(formData);
        if (isApiSuccess(res)) {
          toast.success("Product created");
          await loadProducts(page);
        } else {
          toast.error((res as { message?: string }).message ?? "Create failed");
          throw new Error("create failed");
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
      throw e;
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Products Management</h1>
        <p className="text-sm text-muted-foreground md:text-base">Manage your product catalog (API)</p>
      </div>

      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search by product name or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm md:text-base"
              />
            </div>
            <Button
              onClick={handleAddProduct}
              className="w-full bg-primary hover:bg-primary/90 whitespace-nowrap md:w-auto"
            >
              <Plus size={18} className="mr-2" />
              New Product
            </Button>
          </div>
          {lastPage > 1 && (
            <div className="mt-4 flex items-center justify-between gap-2 text-sm">
              <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {lastPage}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          getStatusColor={getStatusColor}
          getStockStatus={getStockStatus}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDelete={handleConfirmDelete}
        />
      )}

      <AdminProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        product={formProduct}
        onSubmitFormData={handleSubmitFormData}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedApiProduct ? apiProductToDetailModal(selectedApiProduct) : null}
        onEdit={(p) => {
          void handleEditProduct(selectedGridProduct!);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedGridProduct?.name ?? ""}
        itemType="product"
      />
    </div>
  );
}
