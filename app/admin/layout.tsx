"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { isAdminUser } from "@/lib/auth/role";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = isAdminUser(user);

  const loginPath = useMemo(() => {
    if (!pathname) return "/login";
    return `/login?redirect=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.replace(loginPath);
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isAuthenticated, loginPath, mounted, router, user]);

  if (!mounted || !isAuthenticated || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="mt-16 min-h-screen transition-all duration-300 md:ml-64 md:mt-0">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
