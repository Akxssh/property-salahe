"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "motion/react";
import {
  Upload,
  X,
  CheckCircle,
  ArrowLeft,
  LogOut,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import HouseCard from "@/components/ui/house-card";
import Link from "next/link";

// ─── types ──────────────────────────────────────────────────────────────────
type FormData = {
  title: string;
  subtitle: string;
  name: string;
  location: string;
  finance_type: string;
  price: string; // string so input works, convert on submit
  beds: string;
  baths: string;
  kitchens: string;
  sqft: string;
  agent_name: string;
  agent_phone: string;
  youtube_video_url: string;
  use_embed_player: boolean;
  new_listing: boolean;
  trending: boolean;
};

const EMPTY_FORM: FormData = {
  title: "",
  subtitle: "",
  name: "",
  location: "",
  finance_type: "",
  price: "",
  beds: "",
  baths: "",
  kitchens: "",
  sqft: "",
  agent_name: "",
  agent_phone: "",
  youtube_video_url: "",
  use_embed_player: false,
  new_listing: true,
  trending: false,
};

const FINANCE_TYPES = ["Cash", "Loan", "EMI", "Lease", "Rent"];

// ─── small reusables ─────────────────────────────────────────────────────────
function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label className="text-gray-400 text-xs font-medium tracking-wide uppercase flex items-center gap-1">
      {children}
      {required && <span className="text-red-400">*</span>}
    </Label>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
  icon: Icon,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  icon?: React.FC<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${Icon ? "pl-10" : "pl-3"} bg-gray-800/50 border-gray-700 text-white placeholder-gray-600 focus:border-blue-500`}
        />
      </div>
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-gray-300">{label}</p>
        {description && (
          <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
          ${checked ? "bg-blue-600" : "bg-gray-700"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

// ─── section header ──────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-gray-700/50 mb-1">
      <AnimatedGradientText>
        <span className="text-xs font-bold uppercase tracking-widest">
          {children}
        </span>
      </AnimatedGradientText>
    </div>
  );
}

// ─────────────────────────────────────────────────── MAIN PAGE ───────────────
export default function UploadPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── auth guard ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace("/auth/login");
      } else {
        setUserEmail(data.user.email ?? null);
        setAuthLoading(false);
      }
    });
  }, [router]);

  // ── form helpers ──
  const set = useCallback(
    (key: keyof FormData) => (val: string) =>
      setForm((f) => ({ ...f, [key]: val })),
    [],
  );
  const toggle = useCallback(
    (key: keyof FormData) => () => setForm((f) => ({ ...f, [key]: !f[key] })),
    [],
  );

  // ── image pick ──
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
  };

  // ── sign out ──
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  // ── submit ──
  const handleSubmit = async () => {
    setError(null);

    // validate required
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!form.price) {
      setError("Price is required.");
      return;
    }
    if (!imageFile && !form.youtube_video_url) {
      setError("Upload at least an image or provide a YouTube URL.");
      return;
    }

    setUploading(true);

    let imageUrl: string | null = null;

    // upload image to supabase storage
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(fileName, imageFile, { contentType: imageFile.type });

      if (error) {
        setError("Image upload failed: " + error.message);
        setUploading(false);
        return;
      }

      // get public URL
      const { data: urlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(data.path);
      imageUrl = urlData.publicUrl;
    }

    // insert property
    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      name: form.name || null,
      location: form.location,
      finance_type: form.finance_type || null,
      price: form.price ? Number(form.price) : null,
      beds: form.beds ? Number(form.beds) : null,
      baths: form.baths ? Number(form.baths) : null,
      kitchens: form.kitchens ? Number(form.kitchens) : null,
      sqft: form.sqft ? Number(form.sqft) : null,
      agent_name: form.agent_name || null,
      agent_phone: form.agent_phone || null,
      youtube_video_url: form.youtube_video_url || null,
      use_embed_player: form.use_embed_player,
      new_listing: form.new_listing,
      trending: form.trending,
      image_url: imageUrl,
    };

    const { error: insertError } = await supabase
      .from("properties")
      .insert([payload]);

    if (insertError) {
      setError("Failed to create property: " + insertError.message);
      setUploading(false);
      return;
    }

    // success
    setUploading(false);
    setSuccess(true);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    removeImage();
    setSuccess(false);
    setError(null);
  };

  // ── loading / auth guard ──
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── success screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card
            className="relative overflow-hidden border-0 shadow-2xl text-center"
            style={{
              background:
                "linear-gradient(145deg, rgba(30,30,40,0.95), rgba(20,20,30,0.98))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <BorderBeam size={300} duration={8} />
            <div className="relative z-10 px-8 py-14 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Property Listed!
              </h2>
              <p className="text-gray-500 text-sm text-center">
                Your property{" "}
                <span className="text-white font-semibold">"{form.title}"</span>{" "}
                has been successfully added.
              </p>
              <div className="flex gap-3 mt-2 w-full">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  List Another
                </button>
                <Link
                  href="/"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium text-center transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── top nav ── */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-800 border border-gray-700">
                <span className="text-xs font-bold text-white">PS</span>
              </span>
              <span className="text-sm font-semibold">
                Property<span className="text-purple-400">Salahe</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">
              {userEmail}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── page title ── */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <AnimatedGradientText>
          <span className="text-lg font-bold">List a New Property</span>
        </AnimatedGradientText>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the details below. A live preview updates on the right.
        </p>
      </div>

      {/* ── two-col layout ── */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* ──── LEFT: FORM ──── */}
          <div className="flex-1 min-w-0">
            <Card
              className="relative overflow-hidden border-0 shadow-xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(30,30,40,0.9), rgba(24,24,34,0.95))",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <BorderBeam size={400} duration={14} delay={4} />

              <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">
                {/* ── Image upload ── */}
                <div>
                  <SectionHeader>Property Image</SectionHeader>
                  {!imagePreviewUrl ? (
                    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl py-10 px-4 cursor-pointer transition-colors gap-3 group">
                      <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
                        <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          JPG, PNG, WEBP — max 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImagePick}
                      />
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-700">
                      <img
                        src={imagePreviewUrl}
                        alt="preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-xs text-gray-300">
                        {imageFile?.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Core info ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeader>Core Information</SectionHeader>
                  <TextField
                    label="Property Title"
                    placeholder="e.g. Luxurious 3BHK Apartment"
                    value={form.title}
                    onChange={set("title")}
                    required
                  />
                  <TextField
                    label="Subtitle"
                    placeholder="e.g. Sea-facing, fully furnished"
                    value={form.subtitle}
                    onChange={set("subtitle")}
                  />
                  <TextField
                    label="Property Name"
                    placeholder="e.g. Ocean View Towers"
                    value={form.name}
                    onChange={set("name")}
                  />
                  <TextField
                    label="Location"
                    placeholder="e.g. Panvel, Maharashtra"
                    value={form.location}
                    onChange={set("location")}
                    required
                  />
                </div>

                {/* ── Specs ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeader>Specifications</SectionHeader>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <TextField
                      label="Beds"
                      placeholder="3"
                      value={form.beds}
                      onChange={set("beds")}
                      type="number"
                    />
                    <TextField
                      label="Baths"
                      placeholder="2"
                      value={form.baths}
                      onChange={set("baths")}
                      type="number"
                    />
                    <TextField
                      label="Kitchens"
                      placeholder="1"
                      value={form.kitchens}
                      onChange={set("kitchens")}
                      type="number"
                    />
                    <TextField
                      label="Sqft"
                      placeholder="1200"
                      value={form.sqft}
                      onChange={set("sqft")}
                      type="number"
                    />
                  </div>
                </div>

                {/* ── Pricing & finance ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeader>Pricing</SectionHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Price (₹)"
                      placeholder="2500000"
                      value={form.price}
                      onChange={set("price")}
                      type="number"
                      required
                    />
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel>Finance Type</FieldLabel>
                      <select
                        value={form.finance_type}
                        onChange={(e) => set("finance_type")(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-800">
                          Select type
                        </option>
                        {FINANCE_TYPES.map((ft) => (
                          <option key={ft} value={ft} className="bg-gray-800">
                            {ft}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Agent ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeader>Agent Details</SectionHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Agent Name"
                      placeholder="John Doe"
                      value={form.agent_name}
                      onChange={set("agent_name")}
                    />
                    <TextField
                      label="Agent Phone"
                      placeholder="+91 9876543210"
                      value={form.agent_phone}
                      onChange={set("agent_phone")}
                    />
                  </div>
                </div>

                {/* ── Media ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeader>Media</SectionHeader>
                  <TextField
                    label="YouTube Video URL"
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.youtube_video_url}
                    onChange={set("youtube_video_url")}
                    icon={LinkIcon}
                  />
                  <ToggleSwitch
                    label="Use Embed Player"
                    checked={form.use_embed_player}
                    onChange={toggle("use_embed_player")}
                    description="Embed the video directly in the card"
                  />
                </div>

                {/* ── Status toggles ── */}
                <div className="flex flex-col gap-1">
                  <SectionHeader>Status</SectionHeader>
                  <ToggleSwitch
                    label="New Listing"
                    checked={form.new_listing}
                    onChange={toggle("new_listing")}
                    description="Mark as a newly added property"
                  />
                  <ToggleSwitch
                    label="Trending"
                    checked={form.trending}
                    onChange={toggle("trending")}
                    description="Highlight as trending"
                  />
                </div>

                {/* ── error ── */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* ── submit ── */}
                <ShimmerButton
                  className="w-full shadow-lg mt-1"
                  onClick={handleSubmit}
                  disabled={uploading}
                >
                  <span className="flex items-center justify-center gap-2 text-sm font-semibold text-white px-4 py-2.5">
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Listing property…
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        List Property
                      </>
                    )}
                  </span>
                </ShimmerButton>
              </div>
            </Card>
          </div>

          {/* ──── RIGHT: LIVE PREVIEW ──── */}
          <div className="xl:w-96 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-3 px-1">
                <AnimatedGradientText>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Live Preview
                  </span>
                </AnimatedGradientText>
              </div>

              <Card
                className="relative overflow-hidden border-0 shadow-xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(30,30,40,0.85), rgba(24,24,34,0.9))",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <BorderBeam size={250} duration={10} delay={6} />
                <div className="relative z-10 p-4">
                  {form.title || imagePreviewUrl || form.location ? (
                    <HouseCard
                      id="preview"
                      title={form.title || "Your Title"}
                      subtitle={form.subtitle}
                      imageUrl={imagePreviewUrl ?? undefined}
                      youtubeVideoUrl={form.youtube_video_url || undefined}
                      useEmbedPlayer={form.use_embed_player}
                      name={form.name || undefined}
                      location={form.location || undefined}
                      price={form.price ? Number(form.price) : undefined}
                      financeType={form.finance_type || undefined}
                      beds={form.beds ? Number(form.beds) : undefined}
                      baths={form.baths ? Number(form.baths) : undefined}
                      kitchens={
                        form.kitchens ? Number(form.kitchens) : undefined
                      }
                      sqft={form.sqft ? Number(form.sqft) : undefined}
                      agentName={form.agent_name || undefined}
                      agentPhone={form.agent_phone || undefined}
                      newListing={form.new_listing}
                      trending={form.trending}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-gray-600" />
                      </div>
                      <p className="text-gray-600 text-sm text-center">
                        Start filling in the form
                        <br />
                        to see your preview here
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
