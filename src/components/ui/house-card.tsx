"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Bed, Bath, Ruler, Phone, TrendingUp } from "lucide-react";
import { CookingPot } from "lucide-react";
type Props = {
  name: string;
  location: string;
  financeType: string;
  price: string | number;
  beds: number;
  baths: number;
  sqft: number;
  agentName: string;
  agentPhone: string;
  kitchens: number;
  newListing?: boolean;
  youtubeVideoUrl?: string;
  imageUrl: string;
  trending?: Boolean;
};
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HouseCard({
  name,
  location,
  financeType,
  price,
  beds,
  baths,
  sqft,
  agentName,
  agentPhone,
  youtubeVideoUrl,
  newListing,
  kitchens,
  imageUrl,
  trending,
}: Props) {
  // Function to format price into Indian numbering system (lakhs, crores)
  const formatINR = (amount: string | number) => {
    const num =
      typeof amount === "string"
        ? parseInt(amount.replace(/[^0-9]/g, ""))
        : amount;
    if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(2)} Cr`;
    if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(2)} L`;
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    // Outer Card container
    <Card className="max-w-[350px] overflow-hidden rounded-xl shadow-md bg-white">
      {/* Image section */}
      <div className="relative">
        <Image
          src={imageUrl || "https://picsum.photos/1920/1080?random=1"}
          width={1920}
          height={1080}
          className="w-full h-48 object-cover object-top -mt-8 scale-110"
          alt="property image"
        />

        {/* Tags overlay on top-left of image */}
        <div className="absolute top-2 left-2 flex gap-2  -mt-4">
          {trending === true ? (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex justify-center items-center gap-1">
              <TrendingUp />
              Trending
            </span>
          ) : null}
          {newListing === true ? (
            <span className="bg-black text-white text-xs px-2  flex justify-center items-center gap-1 py-1 rounded-full">
              New Listing
            </span>
          ) : null}
          <span className="bg-white text-black text-xs px-2 py-1 rounded-full flex justify-center items-center gap-1">
            {financeType}
          </span>
        </div>
      </div>

      {/* Content below image */}
      <div className="p-4 space-y-2 flex flex-col h-full">
        <h2 className="text-lg font-semibold">
          Riqueza Siri – Premium Apartments
        </h2>
        <p className="text-sm text-gray-500">
          Ready-to-move 2 & 3 BHK apartments in Hoskote Town spread across 1.5
          acres with 128 units. BMRDA approved with OC & CC in place. Features
          25+ world-class amenities including swimming pool, gym, badminton
          court, and jogging track. High-quality fittings with Jaguar bathroom
          fixtures. Peaceful environment away from city pollution, ideal for
          families seeking a serene lifestyle. Bank loans available from SBI,
          HDFC with 80-85% funding. Prices starting from ₹59 Lakhs.
        </p>

        {/*  Price
        <h1 className="text-2xl font-bold">₹{formatINR(price)}</h1>

         Location
        <p className="text-sm text-gray-500">{location}</p>

         Beds, Baths,Kitchens, Sqft
        <div className="flex gap-4 text-sm text-gray-600 mt-1">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {beds}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {baths}
          </div>
          <div className="flex items-center gap-1">
            <CookingPot className="w-4 h-4" /> {kitchens}
          </div>
          <div className="flex items-center gap-1">
            {" "}
            <Ruler className="w-4 h-4" /> {sqft?.toLocaleString() ?? "0"} sqft
          </div>
        </div>

         Agent info and Contact button */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {agentName.charAt(0).toUpperCase()}
            </div>
            {/* Placeholder for agent image */}
            <div className="text-sm">
              <p className="font-semibold">{agentName}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Phone className="w-3 h-3" /> {agentPhone}
              </div>
            </div>
          </div>
          <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
            Contact
          </button>
        </div>

        {/* Action buttons: Schedule Tour & View Details */}
        <div className="flex items-center justify-center gap-2 -mb-6  mt-6">
          {youtubeVideoUrl && (
            <RainbowButton
              onClick={() => window.open(youtubeVideoUrl, "_blank")}
              className="flex-1 border border-gray-300 rounded-md py-2 text-sm"
            >
              Watch tour
            </RainbowButton>
          )}
          <Button variant="outline" className="flex-1  rounded-md py-2 text-sm">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
