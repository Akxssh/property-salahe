"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Badge } from "@/components/ui/badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Search, Phone, Building2, MapPin, Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import Footer from "@/components/ui/footer";
import { NavbarMain } from "@/components/ui/header";
import { supabase } from "@/lib/supabase";
import { useEffect, useState, useMemo } from "react";
import HouseCard from "@/components/ui/house-card";
import { Input } from "@/components/ui/input";

export default function Home() {
  type Property = {
    id: string;
    image_url: string;
    title: string;
    use_embed_player?: boolean;
    youtube_video_url?: string;
    subtitle?: string;
    name?: string;
    location?: string;
    finance_type?: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    agent_name?: string;
    agent_phone?: string;
    kitchens?: number;
    new_listing?: boolean;
    trending?: boolean;
    created_at?: string;
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          setError(error.message);
        } else if (data) {
          setProperties(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!search.trim()) return properties;

    const searchLower = search.toLowerCase();
    return properties.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.location?.toLowerCase().includes(searchLower) ||
        p.name?.toLowerCase().includes(searchLower),
    );
  }, [search, properties]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Property Salahe
              </h2>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#properties">
                      <Home className="w-4 h-4" />
                      <span>Browse Properties</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#loans">
                      <Building2 className="w-4 h-4" />
                      <span>Housing Loans</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#contact">
                      <Phone className="w-4 h-4" />
                      <span>Contact Us</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#locations">
                      <MapPin className="w-4 h-4" />
                      <span>Locations</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="px-4 py-2 text-sm text-gray-500">
              © 2024 Property Salahe
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">
          {/* FIXED HEADER */}
          <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 px-4 py-3">
              <SidebarTrigger>
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <NavbarMain />
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 bg-zinc-50 dark:bg-black">
            {/* HERO SECTION */}
            <section className="container mx-auto px-4 py-12 md:py-20">
              <div className="max-w-4xl mx-auto text-center">
                {/* Animated Headline */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-700 dark:text-slate-300 mb-6">
                  {"Find your property in days, not years"
                    .split(" ")
                    .map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          ease: "easeInOut",
                        }}
                        className="inline-block mr-2"
                      >
                        {word}
                      </motion.span>
                    ))}
                </h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto"
                >
                  With property{" "}
                  <span className="text-red-400 font-semibold">salahe</span>,
                  you can launch your property in days, not years. Say goodbye
                  to long delays and endless paperwork.
                </motion.p>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1 }}
                  className="max-w-2xl mx-auto mb-8"
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search properties by title, location, or name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-12 pr-4 py-6 text-lg shadow-lg border-2 focus:border-blue-500"
                    />
                  </div>
                </motion.div>

                {/* Loan Promo Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                  className="max-w-2xl mx-auto"
                  id="loans"
                >
                  <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200">
                    <BorderBeam size={250} duration={12} delay={9} />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Left Side - Promo Info */}
                      <div className="flex flex-col gap-3 text-left">
                        <AnimatedGradientText>
                          <span className="text-lg font-bold">
                            🏠 Housing Loans · Limited Offer
                          </span>
                        </AnimatedGradientText>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Limited Time
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-300"
                          >
                            80-85% Funding
                          </Badge>
                        </div>

                        <div className="flex flex-col mt-2">
                          <span className="text-xs text-gray-600 font-medium">
                            Call us now
                          </span>
                          <a
                            href="tel:+918073269676"
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Phone className="w-5 h-5" />
                            +91 80732-69676
                          </a>
                        </div>
                      </div>

                      {/* Right Side - CTA Button */}
                      <ShimmerButton className="shadow-lg shrink-0">
                        <span className="whitespace-nowrap text-center text-sm font-medium leading-none tracking-tight text-white px-4 py-2">
                          Apply Now
                        </span>
                      </ShimmerButton>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </section>

            {/* PROPERTIES SECTION */}
            <section className="container mx-auto px-4 py-12" id="properties">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Available Properties
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredProperties.length} properties found
                  {search && ` for "${search}"`}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-20">
                  <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-4">Loading properties...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-20">
                  <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error: {error}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredProperties.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    {search
                      ? "No properties found matching your search"
                      : "No properties available"}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="mt-4 text-blue-500 hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Properties Grid */}
              {!loading && !error && filteredProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <HouseCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      subtitle={property.subtitle}
                      imageUrl={property.image_url}
                      youtubeVideoUrl={property.youtube_video_url}
                      useEmbedPlayer={property.use_embed_player}
                      name={property.name}
                      location={property.location}
                      price={property.price}
                      financeType={property.finance_type}
                      beds={property.beds}
                      baths={property.baths}
                      kitchens={property.kitchens}
                      sqft={property.sqft}
                      agentName={property.agent_name}
                      agentPhone={property.agent_phone}
                      newListing={property.new_listing}
                      trending={property.trending}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
