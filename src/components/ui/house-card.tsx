import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Bed, Bath, Ruler, Phone, TrendingUp } from "lucide-react";
import { CookingPot } from "lucide-react"
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
  kitchens: number
  newListing?: boolean
  youtubeVideoUrl?: string
  imageUrl: string
  trending?: Boolean
};

export default function HouseCard({
  name,
  location,
  financeType,
  price,
  beds,
  baths,
  sqft, agentName,
  agentPhone,
  youtubeVideoUrl,
  newListing,
  kitchens,
  imageUrl,
  trending
}: Props) {

  // Function to format price into Indian numbering system (lakhs, crores)
  const formatINR = (amount: string | number) => {
    const num = typeof amount === "string" ? parseInt(amount.replace(/[^0-9]/g, "")) : amount;
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
          className="w-full h-48 object-cover object-top -mt-6"
          alt="property image"
        />

        {/* Tags overlay on top-left of image */}
        <div className="absolute top-2 left-2 flex gap-2  -mt-4">
          {trending === true ? <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex justify-center items-center gap-1"><TrendingUp />Trending</span> : null}
          {newListing === true ? <span className="bg-black text-white text-xs px-2  flex justify-center items-center gap-1 py-1 rounded-full">New Listing</span> : null}
          <span className="bg-white text-black text-xs px-2 py-1 rounded-full flex justify-center items-center gap-1">{financeType}</span>
        </div>
      </div>

      {/* Content below image */}
      <div className="p-4 space-y-2 flex flex-col h-full">

        {/* Price */}
        <h1 className="text-2xl font-bold">₹{formatINR(price)}</h1>

        {/* Location */}
        <p className="text-sm text-gray-500">{location}</p>

        {/* Beds, Baths,Kitchens, Sqft */}
        <div className="flex gap-4 text-sm text-gray-600 mt-1">
          <div className="flex items-center gap-1"><Bed className="w-4 h-4" /> {beds}</div>
          <div className="flex items-center gap-1"><Bath className="w-4 h-4" /> {baths}</div>
          <div className="flex items-center gap-1"><CookingPot className="w-4 h-4" /> {kitchens}</div>
          <div className="flex items-center gap-1"> <Ruler className="w-4 h-4" /> {sqft?.toLocaleString() ?? "0"} sqft</div>
        </div>

        {/* Agent info and Contact button */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div> {/* Placeholder for agent image */}
            <div className="text-sm">
              <p className="font-semibold">{agentName}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Phone className="w-3 h-3" /> {agentPhone}
              </div>
            </div>
          </div>
          <button className="bg-black text-white px-3 py-1 rounded-md text-sm">Contact</button>
        </div>

        {/* Action buttons: Schedule Tour & View Details */}
        <div className="flex items-center justify-center gap-2 -mb-6  mt-6">
          {youtubeVideoUrl && (
            <button className="flex-1 border border-gray-300 rounded-md py-2 text-sm">
              Watch tour
            </button>
          )}
          <button className="flex-1 bg-black text-white rounded-md py-2 text-sm">View Details</button>
        </div>

      </div>
    </Card>
  );
}
