import { Card } from "@/components/ui/card";
import { NavbarMain } from "@/components/ui/header";
import HouseCard from "@/components/ui/house-card";
export default function Explore() {
  return (
    <div className="min-h-screen pt-16 px-6 md:px-20">
      <NavbarMain className="absolute top-0 left-0" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <HouseCard
          name="Unknown Property"
          location="Unknown Location"
          financeType="Lease"
          price="1,00,000"
          beds={2}
          baths={2}
          kitchens={2}
          sqft={1200}
          agentName="Who Knows"
          agentPhone="123456789"
          youtubeVideoUrl=""
          newListing={true}
          imageUrl="https://picsum.photos/400/300?random=1"
        />

        <HouseCard
          name="Sunny Villa"
          location="Bangalore, KA"
          financeType="Sale"
          price={1_50_00_000}
          beds={4}
          baths={3}
          kitchens={1}
          sqft={2500}
          agentName="Rahul Sharma"
          agentPhone="9876543210"
          youtubeVideoUrl="https://youtube.com/sunny-villa-tour"
          newListing={true}
          imageUrl="https://picsum.photos/400/300?random=2"
        />

        <HouseCard
          name="Cozy Apartment"
          location="Mysore, KA"
          financeType="Rent"
          price={25_000}
          beds={2}
          baths={1}
          kitchens={1}
          sqft={800}
          agentName="Anita Rao"
          agentPhone="9123456789"
          youtubeVideoUrl=""
          newListing={false}
          imageUrl="https://picsum.photos/400/300?random=3"
        />

        <HouseCard
          name="Modern Loft"
          location="Hubli, KA"
          financeType="Lease"
          price="75,000"
          beds={3}
          baths={2}
          kitchens={1}
          sqft={1500}
          agentName="Kiran Patel"
          agentPhone="9988776655"
          youtubeVideoUrl="https://youtube.com/modern-loft-tour"
          newListing={false}
          imageUrl="https://picsum.photos/400/300?random=4"
        />

        <HouseCard
          name="Luxury Penthouse"
          location="Bangalore, KA"
          financeType="Sale"
          price={5_00_00_000}
          beds={5}
          baths={4}
          kitchens={2}
          sqft={4000}
          agentName="Sneha Kumar"
          agentPhone="9876501234"
          youtubeVideoUrl="https://youtube.com/luxury-penthouse-tour"
          newListing={true}
          imageUrl="https://picsum.photos/400/300?random=5"
        />
      </div>
    </div>
  );
}
