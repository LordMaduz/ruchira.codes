import { useState } from "react";
import Navigation from "@/components/Navigation";
import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ProjectDrawer from "@/components/ProjectDrawer";

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [open, setOpen] = useState<{ id: string; el: HTMLElement } | null>(null);
  const openProject = (id: string, el: HTMLElement) => setOpen({ id, el });

  return (
    <div className="min-h-screen">
      {/* Fixed Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* All Sections Rendered - Smooth Scroll */}
      <main>
        {/* Home Section - KEEP min-h-screen */}
        <HomeSection setActiveSection={setActiveSection} onOpenProject={openProject} />

        {/* About Section - Natural height */}
        <AboutSection />

        {/* Skills Section */}
        <SkillsSection onOpenProject={openProject} />

        {/* Projects Section */}
        <ProjectsSection onOpenProject={openProject} />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </main>

      <ProjectDrawer id={open?.id ?? null} opener={open?.el ?? null} onClose={() => setOpen(null)} />
    </div>
  );
}