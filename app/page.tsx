"use client";

import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/moving-border";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconBrain,
  IconPalette,
  IconCode,
  IconRocket,
  IconUsers,
  IconBulb,
} from "@tabler/icons-react";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.02] bg-grid-black/[0.02] relative">
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Product Design <br /> meets AI Engineering
          </h1>
          <TextGenerateEffect
            words="Creating intelligent, user-centered experiences that seamlessly blend design thinking with cutting-edge AI technology."
            className="text-center text-base md:text-lg text-neutral-300 max-w-3xl mx-auto mt-6"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button
              borderRadius="1.75rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              View Projects
            </Button>
            <Button
              borderRadius="1.75rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              Contact Me
            </Button>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="mt-32">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-neutral-200 mb-4">
            Dual Expertise
          </h2>
          <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
            Bridging the gap between beautiful interfaces and intelligent systems
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Product Design Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
              <IconPalette className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Product Design</h3>
              <p className="text-neutral-300 mb-6">
                Crafting intuitive, delightful user experiences through research, prototyping, and iterative design.
              </p>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  User Research & Testing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  UI/UX Design & Prototyping
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Design Systems
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Product Strategy
                </li>
              </ul>
            </div>

            {/* AI Engineering Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20">
              <IconBrain className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">AI Engineering</h3>
              <p className="text-neutral-300 mb-6">
                Building intelligent systems that learn, adapt, and enhance user experiences through machine learning.
              </p>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Large Language Models (LLMs)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Machine Learning & Deep Learning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  AI Product Integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Natural Language Processing
                </li>
              </ul>
            </div>
          </div>

          {/* Featured Work - Bento Grid */}
          <h2 className="text-3xl md:text-5xl font-bold text-center text-neutral-200 mb-12">
            Featured Work
          </h2>
          <BentoGrid className="max-w-7xl mx-auto mb-20">
            <BentoGridItem
              title="AI-Powered Design Tools"
              description="Developed intelligent design assistance features that learn from user patterns and suggest improvements."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40"></div>
              }
              className="md:col-span-2"
              icon={<IconBulb className="h-4 w-4 text-neutral-500" />}
            />
            <BentoGridItem
              title="User-Centric ML Models"
              description="Created machine learning models with human-in-the-loop feedback for better accuracy."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-900/40 to-cyan-900/40"></div>
              }
              className="md:col-span-1"
              icon={<IconUsers className="h-4 w-4 text-neutral-500" />}
            />
            <BentoGridItem
              title="Conversational Interfaces"
              description="Designed and built natural language interfaces that feel intuitive and responsive."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-900/40 to-teal-900/40"></div>
              }
              className="md:col-span-1"
              icon={<IconCode className="h-4 w-4 text-neutral-500" />}
            />
            <BentoGridItem
              title="Product Innovation"
              description="Led cross-functional teams to ship products that combine beautiful design with intelligent features."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-900/40 to-purple-900/40"></div>
              }
              className="md:col-span-2"
              icon={<IconRocket className="h-4 w-4 text-neutral-500" />}
            />
          </BentoGrid>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-400">
            © 2025 Portfolio. Built with Next.js and Aceternity UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
