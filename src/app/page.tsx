"use client";
import { supabase } from "@/lib/supabase";
import { NavbarMain } from "@/components/ui/header";
import Footer from "@/components/ui/footer"
import HeroSectionOne from "@/components/hero-section-demo-1";
import { Button } from "@/components/ui/button";;
import { ArrowRight } from "lucide-react";
import HouseCard from "@/components/ui/house-card";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
export default function Home() {
  type House = {
    id: string;
    name: string;
    location: string;
    finance_type: string;
    price: number;
    beds: number;
    baths: number;
    kitchens: number;
    sqft: number;
    agent_name: string;
    agent_phone: string;
    youtube_video_url?: string;
    new_listing?: boolean;
    trending?: boolean;
    image_url: string;
    created_at: string;
  };

  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      const { data, error } = await supabase.from<House>("houses").select("*");
      if (error) console.error(error);
      else if (data) setHouses(data);
      setLoading(false);
    };

    fetchHouses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <NavbarMain className="fixed top-0" />
      <HeroSectionOne />
      {/* 
      <Input type="file" className="hidden" ref={fileInput} onChange={handleFile} />
      */}
      <div className="w-full flex justify-center gap-2 m-2 items-center"><Button className="w-[75%] max-w-3xl">Explore houses in you area<ArrowRight /></Button></div>
      <Card className="relative mx-6 p-6 m-3 w-md max-w-2xl flex flex-col items-center justify-center overflow-hidden
  bg-gray-900
  bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)]
  [background-size:14px_14px]">

        <span className="relative z-10 text-3xl font-bold leading-snug text-white">
          Top properties
        </span>
      </Card>
      <div className="grid gap-2 grid-cols-2 p-2 md:grid-cols-4">
        {houses.map((house) => (
          <HouseCard
            key={house.id}
            name={house.name}
            location={house.location}
            price={house.price}
            financeType={house.finance_type}
            beds={house.beds}
            baths={house.baths}
            kitchens={house.kitchens}
            sqft={house.sqft}
            agentPhone={house.agent_phone}
            agentName={house.agent_name}
            youtubeVideoUrl={house.youtube_video_url}
            newListing={house.new_listing}
            trending={house.trending}
            imageUrl={house.image_url}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}
