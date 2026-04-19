import type { User } from "@/lib/services/types";

const ADMIN_ROLE_KEYWORDS = ["admin@gmail.com", "admin", "administrator", "superadmin", "super_admin"] as const;

function normalizeRoleLabel(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function isAdminKeyword(value: string): boolean {
  if (ADMIN_ROLE_KEYWORDS.includes(value)) return true;

  // Handle labels like "admin-user" or "role:admin" without matching "domainadmin".
  const tokens = value.split(/[^a-z0-9_]+/).filter(Boolean);
  return tokens.some((token) => ADMIN_ROLE_KEYWORDS.includes(token));
}

function isTruthyAdminFlag(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes"].includes(normalized);
  }

  return false;
}

function extractRoleLabels(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string") {
    const normalized = normalizeRoleLabel(value);
    return normalized ? [normalized] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractRoleLabels(item));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.slug, record.name, record.role, record.type];
    return candidates.flatMap((candidate) => extractRoleLabels(candidate));
  }

  return [];
}

function isSafeInternalPath(path?: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export function isAdminPath(path?: string | null): boolean {
  return Boolean(path && (path === "/admin" || path.startsWith("/admin/")));
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;

  if (isTruthyAdminFlag(user.is_admin)) return true;

  const roleLabels = extractRoleLabels([
    user.email,
    user.role,
    user.roles,
    user.user_type,
    user.account_type,
    user.type,
  ]);

  return roleLabels.some(isAdminKeyword);
}

interface RoleAwareRedirectOptions {
  user: User | null | undefined;
  requestedPath?: string | null;
  defaultUserPath?: string;
  defaultAdminPath?: string;
}

export function getRoleAwareRedirectPath({
  user,
  requestedPath,
  defaultUserPath = "/",
  defaultAdminPath = "/admin/dashboard",
}: RoleAwareRedirectOptions): string {
  const isAdmin = isAdminUser(user);
  const safeRequestedPath = isSafeInternalPath(requestedPath) ? requestedPath : null;

  if (isAdmin) {
    if (safeRequestedPath && isAdminPath(safeRequestedPath)) {
      return safeRequestedPath;
    }

    return defaultAdminPath;
  }

  if (safeRequestedPath && !isAdminPath(safeRequestedPath)) {
    return safeRequestedPath;
  }

  return defaultUserPath;
}
