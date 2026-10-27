// @ts-nocheck
"use client";
import Hero from "@/components/home/Hero";
import IntroSection from "@/components/home/IntroSection";
import ServicesSection from "@/components/home/ServicesSection";
import CapabilitiesSection from "@/components/home/CapabilitiesSection";
import ProcessSection from "@/components/home/ProcessSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import CoverageSection from "@/components/home/CoverageSection";
import CredentialsSection from "@/components/home/CredentialsSection";
import CtaBand from "@/components/site/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <IntroSection />
      <ServicesSection />
      <CapabilitiesSection />
      <ProcessSection />
      <ProjectsSection />
      <CoverageSection />
      <CredentialsSection />
      <CtaBand />
    </>
  );
}