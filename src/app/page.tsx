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
    agent_photo?: string;
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
    <div className="flex flex-col min-h-screen pt-32 sm:pb-32 pb-48 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <NavbarMain className="fixed top-0 mb-24" />
      <HeroSectionOne />

      <div className="flex flex-wrap gap-2 justify-center items-center">
        {/*<Card className="p-0 overflow-hidden w-full max-w-sm rounded-xl border shadow-md group">
          <div className="relative h-56 w-full -mt-1">
            <Image
              src="/riquiza.png"
              fill
              alt="Modern luxury house"
              className="object-cover"
            />
          </div>

          <div className="p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Riqueza Siri</h3>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Active
              </span>
            </div>

            <p className="text-sm text-gray-500">
              A stunning view of modern architecture perfect for your next
              getaway.
            </p>

            <button className="mt-4 w-full rounded-lg bg-black py-2 text-sm font-medium text-white hover:bg-gray-800">
              View Details
            </button>
          </div>
        </Card>*/}
        {/*<Card className="relative mx-6 p-6 m-3 w-md max-w-2xl flex flex-col items-center justify-center overflow-hidden
    bg-gray-900
    bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)]
    [background-size:14px_14px]">

          <span className="relative z-10 text-3xl font-bold leading-snug text-white">
            Top properties
          </span>
        </Card>*/}

        {/*<div className="grid gap-2 grid-cols-2 p-2 md:grid-cols-4">
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
        </div>*/}
        <HouseCard
          key="house-id"
          name="Property Name"
          location="City, Area"
          price="₹00,00,000"
          financeType="Loan / Cash"
          beds="0"
          baths="0"
          kitchens="0"
          sqft="0000 sq ft"
          agentPhone="+91 00000 00000"
          agentName="Agent Name"
          youtubeVideoUrl="https://youtube.com/"
          newListing={false}
          trending={false}
          imageUrl="/riquiza.png"
        />
      </div>
      <Footer className="absolute bottom-0 left-0 right-0" />
    </div>
  );
}
