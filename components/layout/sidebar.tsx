"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  UserCircle,
  HelpCircle,
  Info,
  FileQuestion,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: UserCircle },
  ];

  const secondaryLinks = [
    { href: "/admin/about", label: "About Us", icon: Info },
    { href: "/admin/how-it-works", label: "How It Works", icon: HelpCircle },
    { href: "/admin/faqs", label: "FAQs", icon: FileQuestion },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-primary p-6 text-white transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="mb-12 text-2xl font-bold">ADMIN</div>
        <nav className="space-y-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors",
                  isActive ? "bg-white text-primary" : "text-white hover:bg-primary/80",
                )}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/30" />

          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors",
                  isActive ? "bg-white text-primary" : "text-white hover:bg-primary/80",
                )}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="mt-8 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-white transition-colors hover:bg-primary/80"
              >
                <LogOut size={20} />
                Logout
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access the admin dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </div>
    </>
  );
}
