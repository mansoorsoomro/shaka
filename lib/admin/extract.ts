import type { Product } from "@/lib/services/types";

export function extractPaginatedProducts(response: unknown): {
  items: Product[];
  currentPage: number;
  lastPage: number;
} {
  const r = response as Record<string, unknown>;
  const data = r?.data as Record<string, unknown> | Product[] | undefined;
  if (Array.isArray(data)) {
    return { items: data as Product[], currentPage: 1, lastPage: 1 };
  }
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    const inner = data as { data: Product[]; current_page?: number; last_page?: number };
    return {
      items: inner.data,
      currentPage: Number(inner.current_page ?? 1),
      lastPage: Number(inner.last_page ?? 1),
    };
  }
  return { items: [], currentPage: 1, lastPage: 1 };
}

export function isApiSuccess(response: unknown): boolean {
  const r = response as Record<string, unknown>;
  return Boolean(r?.success === true || r?.status === true);
}

export function extractOrdersList(response: unknown): unknown[] {
  const r = response as Record<string, unknown>;
  const data = r?.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: unknown[] }).data;
  }
  return [];
}
