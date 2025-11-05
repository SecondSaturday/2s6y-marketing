"use client";

import Image from "next/image";
import AnimatedLogo from "@/components/branding/AnimatedLogo";

export default function LandingPage() {
  return (
    <div className="h-screen-mobile flex flex-col"
>
      {/* Navigation Bar */}
      <nav className="navbar bg-base-300 border-b border-base-300 px-4 md:px-8 z-50">
        <div className="navbar-start">
          <a href="https://2s6y.bykc.pro" className="flex items-center gap-2">
            <Image
              src="/2s6y/favicon.svg"
              alt="2s6y Logo"
              width={32}
              height={32}
              className="w-6 h-6"
            />
          </a>
        </div>
        <div className="navbar-center"></div>
        <div className="navbar-end gap-4">
          <a href="https://2s6y.bykc.pro/signin" className="btn btn-ghost btn-sm">
            Sign In
          </a>
          <a href="https://2s6y.bykc.pro/sign-up" className="btn btn-primary btn-sm">
            Get Started
          </a>
        </div>
      </nav>

      <main className="flex-1 bg-base-300 flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Mobile Layout (< 768px) */}
      <div className="w-full max-w-sm mx-auto md:hidden flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="w-80 h-80">
          <AnimatedLogo />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-serif text-base-content leading-tight">
            Remember when we <span className="italic">actually knew</span> what was going on in each other&apos;s lives?
          </h1>

          <p className="text-sm text-base-content/70 leading-relaxed max-w-xs">
            How about a monthly ritual for sharing what matters? Write your
            story, see theirs, stay connected without the noise.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a href="https://2s6y.bykc.pro/sign-up" className="btn btn-primary btn-lg w-full">
              Get Started
            </a>
            <span>Existing users, <a
              href="https://2s6y.bykc.pro/signin"
              className="link link-primary text-center"
            >
              Sign In
            </a></span>
          </div>
        </div>
      </div>

      {/* Tablet Layout (768px - 1023px) */}
      <div className="hidden md:flex lg:hidden w-full max-w-2xl mx-auto flex-col items-center gap-12">
        {/* Logo */}
        <div className="w-96 h-96">
          <AnimatedLogo />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-serif text-base-content leading-tight max-w-2xl">
            Remember when we <span className="italic">actually knew</span> what was going on in each other&apos;s lives?
          </h1>

          <p className="text-base text-base-content/70 leading-relaxed max-w-md">
            How about a monthly ritual for sharing what matters? Write your
            story, see theirs, stay connected without the noise.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-md items-center">
            <a href="https://2s6y.bykc.pro/sign-up" className="btn btn-primary btn-lg px-12">
              Get Started
            </a>
            <span>Existing users, <a
              href="https://2s6y.bykc.pro/signin"
              className="link link-primary text-center"
            >
              Sign In
            </a></span>
          </div>
        </div>
      </div>

      {/* Desktop Layout (>= 1024px) */}
      <div className="hidden lg:flex w-full max-w-7xl mx-auto items-center justify-between gap-16">
        {/* Left: Content */}
        <div className="flex flex-col gap-8 max-w-xl">
          <h1 className="text-5xl font-serif text-base-content leading-tight">
            Remember when we <span className="italic">actually knew</span> what was going on in each other&apos;s lives?
          </h1>

          <p className="text-lg text-base-content/70 leading-relaxed">
            How about a monthly ritual for sharing what matters? Write your
            story, see theirs, stay connected without the noise.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 items-start">
            <a href="https://2s6y.bykc.pro/sign-up" className="btn btn-primary btn-lg px-12">
              Get Started
            </a>
            <span>Existing users, <a
              href="https://2s6y.bykc.pro/signin"
              className="link link-primary text-center"
            >
              Sign In
            </a></span>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="w-[600px] h-[600px] flex-shrink-0">
          <AnimatedLogo />
        </div>
      </div>
    </main>
    </div>
  );
}
