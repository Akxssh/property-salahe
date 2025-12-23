"use client";

import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { Card } from "@/components/ui/card";
export default function HeroSectionOne() {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 py-10 md:py-20">
      <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
        {"Find your property in days, not years"
          .split(" ")
          .map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
      </h1>
      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          delay: 0.8,
        }}
        className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
      >
        With property <span className="text-red-400">salahe</span>, you can
        launch your property in days, not years. Say goodbye to long delays and
        endless paperwork—our platform streamlines everything from planning to
        building, helping you reach your goals faster and more efficiently than
        ever before.
      </motion.p>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
        className="relative z-10 mt-8 flex flex-row flex-wrap items-center justify-center gap-4"
      >
        <div className="flex gap-1 w-full mx-4 max-w-4xl  rounded-md bg-transparent justify-center items-start">
          <div className="">
            <Input
              placeholder="Search property..."
              className="shadow-md p-4 max-w-xl"
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
            />
            {open ? <Card className="w-full p-4 mt-1 rounded-md"></Card> : ""}
          </div>
          <Button
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search-icon lucide-search"
            >
              <path d="M21 21L16.66 16.66" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            Search
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 1.2,
        }}
        className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 flex flex-col items-center justify-center gap-2"
      >
        <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
          <div className="relative mx-auto max-w-4xl">
            <video
              id="founderVid"
              src="/founder_intro_small.mp4"
              autoPlay
              muted
              playsInline
              className="w-full h-auto object-cover"
              onPlay={() => {
                const btn = document.getElementById("startBtn");
                btn.style.opacity = "0.0"; // still clickable
              }}
              onPause={() => {
                const btn = document.getElementById("startBtn");
                btn.style.opacity = "1";
              }}
              onEnded={() => {
                const btn = document.getElementById("startBtn");
                btn.style.opacity = "1";
              }}
            />

            <Button
              id="startBtn"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  px-6 py-3 rounded-md text-black scale-[2] bg-white"
              onClick={() => {
                const v = document.getElementById("founderVid");

                if (v.paused) {
                  // v.currentTime = 0
                  v.muted = false;
                  v.play();
                } else {
                  v.pause();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-play-icon lucide-play"
              >
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
              </svg>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Aceternity UI</h1>
      </div>
      <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Login
      </button>
    </nav>
  );
};
