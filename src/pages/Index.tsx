import { useState } from "react";
import Navigation from "@/components/Navigation";
import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ResumeSection from "@/components/ResumeSection";
import CertificationsSection from "@/components/CertificationsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import RecommendationSection from "@/components/RecommendationSection";
import Footer from "@/components/Footer";

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Fixed Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* All Sections Rendered - Smooth Scroll */}
      <main>
        {/* Home Section - KEEP min-h-screen */}
        <HomeSection setActiveSection={setActiveSection} />

        {/* About Section - Natural height */}
        <AboutSection setActiveSection={setActiveSection} />

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}