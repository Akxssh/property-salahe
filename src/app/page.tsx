import { supabase } from "@/lib/supabase";
import HomePageClient from "./home-page-client";

export default async function Home() {
  const { data, error } = await supabase.from("global_properties").select("*");

  if (error) {
    console.error("", error);
    // Handle the error appropriately
    // For now, we can return a message or an empty state
    return <div>Error fetching data.</div>;
  }

  // Ensure data is not null, provide a fallback empty array
  const properties = data ?? [];

  return <HomePageClient data={properties} />;
}
