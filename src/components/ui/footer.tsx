import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white w-screen py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding / Logo */}
        <div className="text-lg font-bold">PropertySalahe</div>

        {/* Links */}
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} PropertySalahe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
