"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Bed, Bath, Ruler, Phone, TrendingUp } from "lucide-react";
import { CookingPot } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  // Required props
  imageUrl: string;
  title: string;

  // Optional props
  useEmbedPlayer?: boolean;
  youtubeVideoUrl?: string;
  id?: string | number;
  subtitle?: string;
  name?: string;
  location?: string;
  financeType?: string;
  price?: string | number;
  beds?: number;
  baths?: number;
  sqft?: number;
  agentName?: string;
  agentPhone?: string;
  kitchens?: number;
  newListing?: boolean;
  trending?: boolean;
};

import { RainbowButton } from "@/components/ui/rainbow-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function HouseCard({
  youtubeVideoUrl,
  imageUrl,
  title,
  subtitle,
  location,
  financeType,
  price,
  beds,
  baths,
  sqft,
  newListing,
  kitchens,
  trending,
  id,
  useEmbedPlayer,
  agentName,
  agentPhone,
}: Props) {
  const router = useRouter();

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

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : url;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Handle phone call
  const handleCall = () => {
    if (agentPhone) {
      window.location.href = `tel:${agentPhone}`;
    }
  };
  const handleSubtitleCollapse = () => {
    CollapseSubTitle(!isSubTitleCollpase);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const subTitleWordLimitBeforeCollapse = 200;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubTitleCollpase, CollapseSubTitle] = useState(true);
  return (
    <Card className="max-w-[350px] min-w-[350px] min-h-0 overflow-hidden rounded-xl shadow-md bg-white">
      {/* Video/Image section */}
      <div className="relative w-full aspect-video">
        {useEmbedPlayer && youtubeVideoUrl ? (
          <iframe
            className="w-full h-full -mt-6"
            src={getYouTubeEmbedUrl(youtubeVideoUrl)}
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <Image
            className="w-full h-full object-cover -mt-6"
            src={imageUrl}
            alt={title}
            fill
          />
        )}

        {/* Tags overlay */}
        {(trending || newListing) && (
          <div className="absolute bottom-0 -mb-4 left-3 flex gap-2 flex-wrap z-10">
            {trending && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex justify-center items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
            {newListing && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full flex justify-center items-center gap-1">
                New Listing
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content below video */}
      <div className="p-4 space-y-2 flex flex-col h-full">
        <h2 className="text-lg font-semibold">{title}</h2>

        {subtitle && (
          <>
            <div className="flex flex-row">
              <p className="text-sm text-gray-500">
                {isSubTitleCollpase
                  ? subtitle
                      .split("")
                      .slice(0, subTitleWordLimitBeforeCollapse)
                      .join("")
                  : subtitle}
                <Button
                  onClick={handleSubtitleCollapse}
                  className="inline-block   rounded-xl scale-75 py-1 text-sm font-medium  bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors"
                >
                  {isSubTitleCollpase ? "Show more" : "Show less"}
                </Button>
              </p>
            </div>
          </>
        )}

        {/* Price */}
        {/*{price && <h1 className="text-2xl font-bold">₹{formatINR(price)}</h1>}*/}

        {/* Location */}
        {/*{location && <p className="text-sm text-gray-500">{location}</p>}*/}

        {/* Beds, Baths, Kitchens, Sqft */}
        {/*{(beds || baths || kitchens || sqft) && (*/}
        {
          <div className="flex gap-4 text-sm text-gray-600 mt-1">
            {/*{beds !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" /> {beds}
              </div>
            )}*/}
            {/*{baths !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" /> {baths}
              </div>
            )}*/}
            {/*{kitchens !== undefined && (
              <div className="flex items-center gap-1">
                <CookingPot className="w-4 h-4" /> {kitchens}
              </div>
            )}*/}
            {/*{sqft !== undefined && (
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" /> {sqft.toLocaleString()} sqft
              </div>
            )}*/}
          </div>
        }

        {/* Agent info and Contact button */}
        {(agentName || agentPhone) && (
          <div className="flex items-center justify-between mt-3">
            {agentName && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {agentName.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-semibold">{agentName}</p>
                  {agentPhone && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Phone className="w-3 h-3" /> {agentPhone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {agentPhone && (
              <button
                onClick={handleCall}
                className="bg-black text-white px-3 py-1 rounded-md text-sm"
              >
                Contact
              </button>
            )}
          </div> // <-- closes the flex container
        )}
        {/* Action buttons: Watch Tour & View Details */}
        {(youtubeVideoUrl || id) && (
          <div className="flex flex-col w-full items-center justify-center gap-2 -mb-6 mt-6">
            {/*{id && (
              <Button
                variant="outline"
                className="flex-1 w-full rounded-md py-2 text-sm"
                onClick={() => {
                  router.push(`/houses/${id}`);
                }}
              >
                View Details
              </Button>
            )}*/}
            {youtubeVideoUrl && (
              <RainbowButton
                onClick={() => window.open(youtubeVideoUrl, "_blank")}
                className="w-full flex-1 border border-gray-300 rounded-md py-2 text-sm"
              >
                Watch tour
              </RainbowButton>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
