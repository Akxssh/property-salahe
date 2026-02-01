"use client";
import HeroSectionOne from "@/components/hero-section-demo-1";
import { Card } from "@/components/ui/card";
import Footer from "@/components/ui/footer";
import { NavbarMain } from "@/components/ui/header";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import HouseCard from "@/components/ui/house-card";

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase.from("properties").select("*", {
          order: "created_at.desc",
        });

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

  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pb-32 pb-48 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <NavbarMain className="fixed top-0 mb-24" />
      <HeroSectionOne />
      <div className="flex flex-wrap gap-4 justify-center items-center p-4">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found</p>
          </div>
        )}
        <div className="grid md:grid-cols-2 grid-rows-2 gap-4 items-start">
          {!loading && !error && properties.length > 0 && (
            <>
              {properties.map((property) => (
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
            </>
          )}{" "}
        </div>
      </div>
      <Footer className="absolute bottom-0 left-0 right-0" />
    </div>
  );
}
