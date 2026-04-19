"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-primary px-4 text-white md:hidden">
      <div className="text-xl font-bold">ADMIN</div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-white hover:bg-primary/80 hover:text-white"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
}
