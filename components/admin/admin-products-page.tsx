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
import { isApiSuccess } from "@/lib/admin/extract";
import { toast } from "sonner";

const PAGE_SIZE = 20;

function apiProductToGrid(p: ApiProduct): UiProduct {
  const variations = p.variations ?? [];
  const totalStock = variations.length
    ? variations.reduce((s, v) => s + (Number(v.stock) || 0), 0)
    : Number(p.stock) || 0;
  const minPrice = variations.length
    ? Math.min(...variations.map((v) => Number(v.price) || 0))
    : Number(p.price) || 0;
  // Status comes from the product-level is_active flag (same source the
  // edit/view modals use). Treat 0 / "0" / false as inactive; default active
  // when the flag is absent.
  const isActive =
    p.is_active === undefined || p.is_active === null
      ? true
      : Number(p.is_active) === 1;
  return {
    id: String(p.id),
    name: p.name,
    sku: p.slug,
    category: p.category?.name ?? "",
    // categoryData: p.category?? "",
    // images: p.images ? p.images.map((img) => img.url) : [],
    price: `$${minPrice.toFixed(2)}`,
    stock: totalStock,
    status: isActive ? "active" : "inactive",
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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGridProduct, setSelectedGridProduct] = useState<UiProduct | null>(null);
  const [selectedApiProduct, setSelectedApiProduct] = useState<ApiProduct | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [formProduct, setFormProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(2);

  // Server-side filters (admin products API: search / min_price / max_price)
  const [searchInput, setSearchInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [filters, setFilters] = useState({ search: "", minPrice: "", maxPrice: "" });

  // Debounce filter inputs before refetching.
  useEffect(() => {
    const t = setTimeout(
      () => setFilters({ search: searchInput, minPrice: minPriceInput, maxPrice: maxPriceInput }),
      450,
    );
    return () => clearTimeout(t);
  }, [searchInput, minPriceInput, maxPriceInput]);

  const fetchProducts = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) setIsLoadMoreLoading(true);
      else setLoading(true);
      try {
        const res = await productService.getAdminProducts({
          page: pageNum,
          pagination: PAGE_SIZE,
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });
        if (!isApiSuccess(res)) {
          toast.error((res as { message?: string }).message ?? "Failed to load products");
          if (!append) setApiProducts([]);
          return;
        }
        const payload = res.data as unknown as {
          data?: ApiProduct[];
          next_page_url?: string | null;
          current_page?: number;
        };
        const items = payload.data ?? [];
        setApiProducts((prev) => (append ? [...prev, ...items] : items));
        setHasMore(Boolean(payload.next_page_url));
        setNextPage((payload.current_page ?? pageNum) + 1);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Failed to load products");
        if (!append) setApiProducts([]);
      } finally {
        if (append) setIsLoadMoreLoading(false);
        else setLoading(false);
      }
    },
    [filters],
  );

  // Refetch from page 1 whenever filters change.
  useEffect(() => {
    void fetchProducts(1, false);
  }, [fetchProducts]);

  // Search is now server-side; render the products as returned by the API.
  const gridProducts: UiProduct[] = apiProducts.map(apiProductToGrid);

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
        await fetchProducts(1, false);
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
          await fetchProducts(1, false);
        } else {
          toast.error((res as { message?: string }).message ?? "Update failed");
          throw new Error("update failed");
        }
      } else {
        const res = await productService.addProduct(formData);
        if (isApiSuccess(res)) {
          toast.success("Product created");
          await fetchProducts(1, false);
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
                placeholder="Search by product name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 text-sm md:text-base"
              />
            </div>
            {/* Price range (server-side: min_price / max_price) */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Min price"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-28 text-sm md:text-base"
              />
              <span className="text-gray-400">–</span>
              <Input
                type="number"
                min={0}
                placeholder="Max price"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-28 text-sm md:text-base"
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
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <ProductGrid
          products={gridProducts}
          getStatusColor={getStatusColor}
          getStockStatus={getStockStatus}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDelete={handleConfirmDelete}
        />
      )}
      {isLoadMoreLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : hasMore ? (
        <div className="flex justify-center py-4">
          <Button onClick={() => fetchProducts(nextPage, true)} variant="outline" className="bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-bold h-9">
            Load More
          </Button>
        </div>
      ) : null}

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
