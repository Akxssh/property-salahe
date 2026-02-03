"use client";

import React from "react";
import {
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { X, Home as HomeIcon, Building2, Phone, MapPin } from "lucide-react";

export default function Base({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex ">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 py-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Property Salahe
              </h2>
              <SidebarCloseButton />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#properties" onClick={() => setSidebarOpen(false)}>
                      <HomeIcon className="w-4 h-4" /> Browse Properties
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#loans" onClick={() => setSidebarOpen(false)}>
                      <Building2 className="w-4 h-4" /> Housing Loans
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#contact" onClick={() => setSidebarOpen(false)}>
                      <Phone className="w-4 h-4" /> Contact Us
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#locations" onClick={() => setSidebarOpen(false)}>
                      <MapPin className="w-4 h-4" /> Locations
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="px-4 py-3 text-sm text-gray-500">
              © 2025 Property Salahe
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {/* Header now respects sidebar width */}
          <header className="flex-1 bg-white/30 dark:bg-black/30 border-b border-gray-200/30 dark:border-gray-800/30 backdrop-blur-md px-4 py-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <a href="/" className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-800 dark:bg-white">
                  <span className="text-xs font-bold text-white dark:text-slate-800">
                    PS
                  </span>
                </span>
                <span className="text-base font-semibold text-slate-800 dark:text-white">
                  Property<span className="text-purple-600">Salahe</span>
                </span>
              </a>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 transition-all duration-300 justify-start items-start ">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function SidebarCloseButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar}>
      <X />
    </button>
  );
}
