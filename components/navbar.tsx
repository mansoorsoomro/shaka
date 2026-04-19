"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, User, ChevronDown } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { CartDrawer } from "./cart-drawer"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { productService } from "@/lib/services/product-service"
import { Category } from "@/lib/services/types"
import { isAdminUser } from "@/lib/auth/role"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { items, toggleCart, initCart } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const isAdmin = isAdminUser(user)
  const accountPath = isAdmin ? "/admin/dashboard" : "/profile"
  const accountLabel = isAdmin ? "Admin Dashboard" : "Profile"

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories()
        if (response.success && response.data) {
          setCategories(response.data)
          console.log("Fetched categories:", response.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    initCart()
    fetchCategories()
  }, [initCart])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-b border-transparent",
          isScrolled
            ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-zinc-200 shadow-sm py-0"
            : "bg-black/20 backdrop-blur-sm py-0"
        )}
      >
        <div className={cn(
          "w-full flex h-20 items-center justify-between border-b transition-colors duration-300",
          isScrolled ? "border-zinc-200" : "border-white/10"
        )}>
          <div className="flex items-center h-full">
            <div className={cn(
              "px-8 flex items-center h-full border-r transition-colors duration-300",
              isScrolled ? "border-zinc-200" : "border-white/10"
            )}>
              <Link href="/" className="text-2xl font-bold tracking-tighter text-brand-green">
                shaka
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium px-8 h-full">
              <Link
                href="/"
                className={cn(
                  "transition-colors hover:text-brand-green h-full flex items-center",
                  pathname === "/"
                    ? "text-brand-green border-b-2 border-brand-green"
                    : (isScrolled ? "text-zinc-600" : "text-white")
                )}
              >
                Home
              </Link>
              <div className="group relative h-full flex items-center">
                <Link
                  href="/shop"
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-brand-green h-full",
                    (pathname === "/shop" || pathname.startsWith("/shop/"))
                      ? "text-brand-green border-b-2 border-brand-green"
                      : (isScrolled ? "text-zinc-600" : "text-white")
                  )}
                >
                  Shop <ChevronDown className="h-4 w-4" />
                </Link>
                <div className="absolute left-0 top-full hidden w-48 bg-white border shadow-lg group-hover:block text-zinc-800 z-50">
                  <Link href="/shop" className="block px-4 py-2 hover:bg-muted font-normal">
                    View All
                  </Link>
                  {!loadingCategories && categories.length > 0 && (
                    <>
                      <div className="border-t border-zinc-200" />
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/shop?category=${category.slug}`}
                          className="block px-4 py-2 hover:bg-muted font-normal"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
              {[
                { name: "About Us", href: "/about" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Resources", href: "/resources" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-brand-green h-full flex items-center whitespace-nowrap",
                    pathname === link.href
                      ? "text-brand-green border-b-2 border-brand-green"
                      : (isScrolled ? "text-zinc-600" : "text-white")
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center h-full">
            {mounted && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "px-6 h-full border-l transition-colors hover:bg-black/5 flex items-center gap-2 outline-none",
                      isScrolled ? "text-zinc-600 border-zinc-200" : "text-white border-white/10"
                    )}
                  >
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="truncate">
                    {user ? `${user.firstname} ${user.lastname}` : "Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(accountPath)} className="cursor-pointer">
                    {accountLabel}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      router.push("/")
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className={cn(
                  "px-6 h-full border-l transition-colors hover:bg-black/5 flex items-center gap-2",
                  isScrolled ? "text-zinc-600 border-zinc-200" : "text-white border-white/10"
                )}
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-bold hidden lg:block">Login</span>
              </button>
            )}
            <button
              onClick={() => {
                initCart()
                toggleCart()
              }}
              className={cn(
                "px-6 h-full border-l transition-colors hover:bg-black/5 relative",
                isScrolled ? "text-zinc-600 border-zinc-200" : "text-white border-white/10"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-4 right-4 h-4 w-4 bg-brand-green text-[10px] text-white flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}
