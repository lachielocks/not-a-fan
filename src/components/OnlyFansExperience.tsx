"use client";

import { useCallback, useEffect, useState } from "react";
import { FanScene } from "./FanScene";

const MESSAGES = [
  "Nice try.",
  "Wrong kind of fans.",
  "This site is literally called “not a fan.”",
  "Did you really click that?",
  "It's a ceiling fan. Calm down.",
  "Your browser history is judging you.",
  "∞% off. Still no.",
  "The only thing dropping here is a fan.",
  "Go touch grass. Or a light switch.",
] as const;

const SITE_URL = "https://lachiethurlow.com";

export default function OnlyFansExperience() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [fanDropped, setFanDropped] = useState(false);

  useEffect(() => {
    const dropTimer = window.setTimeout(() => setFanDropped(true), 500);
    return () => window.clearTimeout(dropTimer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  const handleImpact = useCallback(() => {
    setShaking(true);
    window.setTimeout(() => setShaking(false), 650);
  }, []);

  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden bg-[#07070a] text-zinc-100 ${shaking ? "screen-shake" : ""}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1b4b_0%,transparent_55%)] opacity-70"
        aria-hidden
      />

      {fanDropped && <FanScene onImpact={handleImpact} />}

      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 pt-12 text-center sm:pt-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
          Content not found
        </p>

        <h1
          key={messageIndex}
          className="message-in max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
        >
          {MESSAGES[messageIndex]}
        </h1>

        <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
          You wanted exclusive content. You got exclusive{" "}
          <span className="text-zinc-300">air circulation</span>.
        </p>
      </div>

      <div className="relative z-20 mt-auto flex justify-center px-6 pb-10">
        <a
          href={SITE_URL}
          className="rounded-full border border-zinc-700 bg-zinc-900/90 px-6 py-3 text-sm font-medium text-zinc-200 backdrop-blur-sm transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          Leave with your dignity
        </a>
      </div>

      <footer className="relative z-10 space-y-1 pb-5 text-center text-xs text-zinc-600">
        <p>no creators were harmed · fan may contain blades</p>
        <p className="text-zinc-500">still learning how to make a fan in three.js</p>
      </footer>
    </div>
  );
}
