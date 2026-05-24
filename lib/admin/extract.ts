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

/**
 * Generic list extractor that handles both `{ data: [] }` and the
 * Laravel paginator shape `{ data: { data: [] } }`.
 */
export function extractList<T = unknown>(response: unknown): T[] {
  const r = response as Record<string, unknown>;
  const data = r?.data;
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data;
  }
  return [];
}

/**
 * Extract the `data` object from an API response (non-list payloads such as
 * the admin dashboard). Falls back to the raw response when there is no
 * `data` wrapper.
 */
export function extractData<T = Record<string, unknown>>(response: unknown): T {
  const r = response as Record<string, unknown>;
  if (r && typeof r === "object" && "data" in r && r.data && typeof r.data === "object") {
    return r.data as T;
  }
  return (r ?? {}) as T;
}
