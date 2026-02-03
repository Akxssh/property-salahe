"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import Base from "@/components/ui/base";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import HouseCard from "@/components/ui/house-card";
import { supabase } from "@/lib/supabase";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Filter,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
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

type SortOption = "newest" | "price_asc" | "price_desc" | "trending";

// ─── Helpers ────────────────────────────────────────────────────────────────
const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest First",
  price_asc: "Price: Low → High",
  price_desc: "Price: High → Low",
  trending: "Trending",
};

// ─── Reusable sub-components ────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="py-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
            ${checked ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400"}`}
          onClick={onChange}
        >
          {checked && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </label>
  );
}

function RangeInputPair({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  prefix,
  suffix,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) => onChangeMin(Number(e.target.value))}
          className={`w-full border border-gray-300 dark:border-gray-600 rounded-md text-sm py-1.5 text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${prefix ? "pl-5 pr-2" : "px-2"}`}
        />
      </div>
      <span className="text-gray-400 text-sm">–</span>
      <div className="relative flex-1">
        <input
          type="number"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) => onChangeMax(Number(e.target.value))}
          className={`w-full border border-gray-300 dark:border-gray-600 rounded-md text-sm py-1.5 text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${suffix ? "pr-5 pl-2" : "px-2"}`}
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function Explore() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";

  // ── data ──
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── search + sort ──
  const [search, setSearch] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // ── filters ──
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(
    new Set(),
  );
  const [selectedBeds, setSelectedBeds] = useState<Set<number>>(new Set());
  const [selectedBaths, setSelectedBaths] = useState<Set<number>>(new Set());
  const [selectedFinanceTypes, setSelectedFinanceTypes] = useState<Set<string>>(
    new Set(),
  );
  const [onlyNewListing, setOnlyNewListing] = useState(false);
  const [onlyTrending, setOnlyTrending] = useState(false);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(99999999);
  const [sqftMin, setSqftMin] = useState(0);
  const [sqftMax, setSqftMax] = useState(99999);

  // ── mobile sidebar toggle ──
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── fetch ──
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          setError(error.message);
        } else if (data) {
          setProperties(data);
        }
      } catch {
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── derive unique facets from data ──
  const locations = useMemo(
    () =>
      [...new Set(properties.map((p) => p.location).filter(Boolean))].sort(),
    [properties],
  );
  const bedOptions = useMemo(
    () =>
      [
        ...new Set(
          properties.map((p) => p.beds).filter((v): v is number => v != null),
        ),
      ].sort((a, b) => a - b),
    [properties],
  );
  const bathOptions = useMemo(
    () =>
      [
        ...new Set(
          properties.map((p) => p.baths).filter((v): v is number => v != null),
        ),
      ].sort((a, b) => a - b),
    [properties],
  );
  const financeTypes = useMemo(
    () =>
      [
        ...new Set(properties.map((p) => p.finance_type).filter(Boolean)),
      ].sort(),
    [properties],
  );

  // ── filtered + sorted results ──
  const results = useMemo(() => {
    let out = properties;

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q),
      );
    }
    if (selectedLocations.size)
      out = out.filter((p) => p.location && selectedLocations.has(p.location));
    if (selectedBeds.size)
      out = out.filter((p) => p.beds != null && selectedBeds.has(p.beds));
    if (selectedBaths.size)
      out = out.filter((p) => p.baths != null && selectedBaths.has(p.baths));
    if (selectedFinanceTypes.size)
      out = out.filter(
        (p) => p.finance_type && selectedFinanceTypes.has(p.finance_type),
      );
    if (onlyNewListing) out = out.filter((p) => p.new_listing);
    if (onlyTrending) out = out.filter((p) => p.trending);
    out = out.filter(
      (p) => (p.price ?? 0) >= priceMin && (p.price ?? 0) <= priceMax,
    );
    out = out.filter(
      (p) => (p.sqft ?? 0) >= sqftMin && (p.sqft ?? 0) <= sqftMax,
    );

    // sort
    out = [...out].sort((a, b) => {
      if (sort === "price_asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "price_desc") return (b.price ?? 0) - (a.price ?? 0);
      if (sort === "trending")
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      // newest
      return (
        new Date(b.created_at ?? "").getTime() -
        new Date(a.created_at ?? "").getTime()
      );
    });

    return out;
  }, [
    properties,
    search,
    selectedLocations,
    selectedBeds,
    selectedBaths,
    selectedFinanceTypes,
    onlyNewListing,
    onlyTrending,
    priceMin,
    priceMax,
    sqftMin,
    sqftMax,
    sort,
  ]);

  // ── active tags ──
  type Tag = { key: string; label: string; remove: () => void };

  const activeTags: Tag[] = useMemo(() => {
    const tags: Tag[] = [];
    if (search.trim())
      tags.push({
        key: "search",
        label: `"${search}"`,
        remove: () => setSearch(""),
      });
    selectedLocations.forEach((loc) =>
      tags.push({
        key: `loc-${loc}`,
        label: loc,
        remove: () =>
          setSelectedLocations((s) => {
            const n = new Set(s);
            n.delete(loc);
            return n;
          }),
      }),
    );
    selectedBeds.forEach((b) =>
      tags.push({
        key: `bed-${b}`,
        label: `${b} bed`,
        remove: () =>
          setSelectedBeds((s) => {
            const n = new Set(s);
            n.delete(b);
            return n;
          }),
      }),
    );
    selectedBaths.forEach((b) =>
      tags.push({
        key: `bath-${b}`,
        label: `${b} bath`,
        remove: () =>
          setSelectedBaths((s) => {
            const n = new Set(s);
            n.delete(b);
            return n;
          }),
      }),
    );
    selectedFinanceTypes.forEach((ft) =>
      tags.push({
        key: `ft-${ft}`,
        label: ft,
        remove: () =>
          setSelectedFinanceTypes((s) => {
            const n = new Set(s);
            n.delete(ft);
            return n;
          }),
      }),
    );
    if (onlyNewListing)
      tags.push({
        key: "new",
        label: "New Listing",
        remove: () => setOnlyNewListing(false),
      });
    if (onlyTrending)
      tags.push({
        key: "trending",
        label: "Trending",
        remove: () => setOnlyTrending(false),
      });
    if (priceMin > 0)
      tags.push({
        key: "pmin",
        label: `₹${priceMin.toLocaleString()}+`,
        remove: () => setPriceMin(0),
      });
    if (priceMax < 99999999)
      tags.push({
        key: "pmax",
        label: `Up to ₹${priceMax.toLocaleString()}`,
        remove: () => setPriceMax(99999999),
      });
    if (sqftMin > 0)
      tags.push({
        key: "smin",
        label: `${sqftMin}+ sqft`,
        remove: () => setSqftMin(0),
      });
    if (sqftMax < 99999)
      tags.push({
        key: "smax",
        label: `Up to ${sqftMax} sqft`,
        remove: () => setSqftMax(99999),
      });
    return tags;
  }, [
    search,
    selectedLocations,
    selectedBeds,
    selectedBaths,
    selectedFinanceTypes,
    onlyNewListing,
    onlyTrending,
    priceMin,
    priceMax,
    sqftMin,
    sqftMax,
  ]);

  const clearAll = useCallback(() => {
    setSearch("");
    setSelectedLocations(new Set());
    setSelectedBeds(new Set());
    setSelectedBaths(new Set());
    setSelectedFinanceTypes(new Set());
    setOnlyNewListing(false);
    setOnlyTrending(false);
    setPriceMin(0);
    setPriceMax(99999999);
    setSqftMin(0);
    setSqftMax(99999);
  }, []);

  // helpers for toggling sets
  const toggleSet = <T,>(
    setter: (fn: (prev: Set<T>) => Set<T>) => void,
    val: T,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  };

  // count helpers
  const locationCount = (loc: string) =>
    properties.filter((p) => p.location === loc).length;
  const bedCount = (b: number) => properties.filter((p) => p.beds === b).length;
  const bathCount = (b: number) =>
    properties.filter((p) => p.baths === b).length;
  const ftCount = (ft: string) =>
    properties.filter((p) => p.finance_type === ft).length;

  // ─────────────────────────────────────────────────────── SIDEBAR CONTENT ────
  const SidebarContent = (
    <div className="flex flex-col gap-1 px-4 py-3">
      {/* Price */}
      <SectionDivider label="Price Range (₹)" />
      <RangeInputPair
        min={0}
        max={99999999}
        valueMin={priceMin}
        valueMax={priceMax}
        onChangeMin={setPriceMin}
        onChangeMax={setPriceMax}
        prefix="₹"
      />

      {/* Location */}
      <SectionDivider label="Location" />
      {locations.map((loc) => (
        <CheckboxRow
          key={loc}
          label={loc}
          checked={selectedLocations.has(loc)}
          onChange={() => toggleSet(setSelectedLocations, loc)}
          count={locationCount(loc)}
        />
      ))}

      {/* Beds */}
      <SectionDivider label="Bedrooms" />
      {bedOptions.map((b) => (
        <CheckboxRow
          key={b}
          label={`${b} Bedroom${b > 1 ? "s" : ""}`}
          checked={selectedBeds.has(b)}
          onChange={() => toggleSet(setSelectedBeds, b)}
          count={bedCount(b)}
        />
      ))}

      {/* Baths */}
      <SectionDivider label="Bathrooms" />
      {bathOptions.map((b) => (
        <CheckboxRow
          key={b}
          label={`${b} Bathroom${b > 1 ? "s" : ""}`}
          checked={selectedBaths.has(b)}
          onChange={() => toggleSet(setSelectedBaths, b)}
          count={bathCount(b)}
        />
      ))}

      {/* Finance type */}
      <SectionDivider label="Finance Type" />
      {financeTypes.map((ft) => (
        <CheckboxRow
          key={ft}
          label={ft}
          checked={selectedFinanceTypes.has(ft)}
          onChange={() => toggleSet(setSelectedFinanceTypes, ft)}
          count={ftCount(ft)}
        />
      ))}

      {/* Sqft */}
      <SectionDivider label="Area (sqft)" />
      <RangeInputPair
        min={0}
        max={99999}
        valueMin={sqftMin}
        valueMax={sqftMax}
        onChangeMin={setSqftMin}
        onChangeMax={setSqftMax}
        suffix="ft²"
      />

      {/* Toggles */}
      <SectionDivider label="Status" />
      <CheckboxRow
        label="New Listing"
        checked={onlyNewListing}
        onChange={() => setOnlyNewListing((v) => !v)}
        count={properties.filter((p) => p.new_listing).length}
      />
      <CheckboxRow
        label="Trending"
        checked={onlyTrending}
        onChange={() => setOnlyTrending((v) => !v)}
        count={properties.filter((p) => p.trending).length}
      />

      {/* Clear */}
      {activeTags.length > 0 && (
        <button
          onClick={clearAll}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────── RENDER ─────────────────
  return (
    <Base>
      <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:flex lg:w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 h-screen overflow-y-auto">
          <div className="w-full">
            <div className="px-4 pt-5 pb-2">
              <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" /> Filters
              </h2>
            </div>
            {SidebarContent}
          </div>
        </aside>

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-50 w-72 bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" /> Filters
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              {SidebarContent}
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ─── TOP BAR ─── */}
          <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
            {/* Row 1: search + sort + mobile filter btn */}
            <div className="flex items-center gap-3 max-w-6xl mx-auto">
              {/* Mobile filter trigger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeTags.length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-xs font-bold">
                    {activeTags.length}
                  </span>
                )}
              </button>

              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, location, or name…"
                  className="pl-10 pr-4 py-2 text-sm border-2 focus:border-blue-500 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Sort:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {SORT_LABELS[sort]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-40 overflow-hidden">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSort(opt);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          ${sort === opt ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950 dark:text-blue-300" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                      >
                        {SORT_LABELS[opt]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: active tags + result count */}
            <div className="flex items-center gap-2 mt-2.5 max-w-6xl mx-auto flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0">
                {results.length}{" "}
                {results.length === 1 ? "property" : "properties"}
              </span>

              {activeTags.map((tag) => (
                <span
                  key={tag.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium"
                >
                  {tag.label}
                  <button
                    onClick={tag.remove}
                    className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {activeTags.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-red-600 underline underline-offset-2 transition-colors ml-1"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* ─── GRID ─── */}
          <div className="flex-1 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {/* loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 mt-4 text-sm">
                    Loading properties…
                  </p>
                </div>
              )}

              {/* error */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="p-4 bg-red-50 rounded-full mb-3">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              )}

              {/* empty */}
              {!loading && !error && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    No properties match your filters
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting or removing some filters
                  </p>
                  {activeTags.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}

              {/* results */}
              {!loading && !error && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((p) => (
                    <HouseCard
                      key={p.id}
                      id={p.id}
                      title={p.title}
                      subtitle={p.subtitle}
                      imageUrl={p.image_url}
                      youtubeVideoUrl={p.youtube_video_url}
                      useEmbedPlayer={p.use_embed_player}
                      name={p.name}
                      location={p.location}
                      price={p.price}
                      financeType={p.finance_type}
                      beds={p.beds}
                      baths={p.baths}
                      kitchens={p.kitchens}
                      sqft={p.sqft}
                      agentName={p.agent_name}
                      agentPhone={p.agent_phone}
                      newListing={p.new_listing}
                      trending={p.trending}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
}
