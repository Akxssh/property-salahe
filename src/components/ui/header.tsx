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
import Header from "@/components/ui/header";
export default function Base({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen">
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
                      <HomeIcon className="w-4 h-4 mr-2" /> Browse Properties
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#loans" onClick={() => setSidebarOpen(false)}>
                      <Building2 className="w-4 h-4 mr-2" /> Housing Loans
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#contact" onClick={() => setSidebarOpen(false)}>
                      <Phone className="w-4 h-4 mr-2" /> Contact Us
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#locations" onClick={() => setSidebarOpen(false)}>
                      <MapPin className="w-4 h-4 mr-2" /> Locations
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
          {/* Header */}
          {/*<header className="flex items-center gap-3 bg-white/30 dark:bg-black/30 border-b border-gray-200/30 dark:border-gray-800/30 backdrop-blur-md px-4 py-3">*/}
          {/*<SidebarTrigger className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-800 dark:bg-white text-white dark:text-slate-800" />
            <a href="/" className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-slate-800 dark:text-white">
                Property <span className="text-purple-600">Salahe</span>
              </span>
            </a>
          </header>

         Page content */}
          <Header SidebarTrigger={SidebarTrigger} />
          <main className="flex-1 pt-12 transition-all duration-300">
            {children}
          </main>
        </div>
        {/*</header>*/}
      </div>
    </SidebarProvider>
  );

  function SidebarCloseButton() {
    const { toggleSidebar } = useSidebar();
    return (
      <button
        onClick={toggleSidebar}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    );
  }
}
