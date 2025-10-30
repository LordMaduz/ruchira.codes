import { useState } from "react";
import { Home, Mail, Linkedin, Github, Twitter, BookOpen, Menu, X, Award, FileDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useThemeStore } from "../store/themeStore";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useThemeStore();

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: sectionId === 'home' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleBookCall = () => {
    window.open('https://cal.com/ruchira-rajapaksha', '_blank');
  };

  const RESUME_DRIVE_FILE_ID = import.meta.env.VITE_RESUME_DRIVE_FILE_ID;

  const downloadResume = () => {
    try {
      const pdfResume = `https://drive.google.com/uc?export=download&id=${RESUME_DRIVE_FILE_ID}`;
      window.open(pdfResume, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const socialLinks = [
    { icon: Mail, href: "mailto:maduz.ruchira@gmail.com", label: "Email" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/ruchirarajapaksha/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/LordMaduz", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/maduz_ruchira", label: "Twitter" },
    { icon: BookOpen, href: "https://www.baeldung.com/author/ruchiramadhushanrajapaksha", label: "Baeldung" },
    { icon: Award, href: "https://www.credly.com/users/ruchira-madhushan-rajapaksha/badges#credly", label: "AWS Certifications" }
  ];

  return (
    <nav className="fixed top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-50">
      <div className="max-w-4xl mx-auto backdrop-blur-md border rounded-full px-2 sm:px-6 shadow-2xl border-gray-200 dark:border-white/10" style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))'
          : 'rgba(255, 255, 255, 0.95)'
      }}>
        <div className="flex items-center justify-between h-11 sm:h-14">

          {/* Left: Icon Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-6">
            {/* Home Icon */}
            <button
              onClick={() => scrollToSection('home')}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                activeSection === 'home'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800'
              }`}
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Social Media Icons - Desktop Only */}
            <div className="hidden md:flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Theme Toggle, Resume & CTA Button */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Resume Download - Desktop */}
            <button
              onClick={downloadResume}
              className="hidden sm:flex items-center gap-1.5 p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
              aria-label="Download Resume"
              title="Download Resume"
            >
              <FileDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleBookCall}
              className="hidden sm:flex px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200"
            >
              Book a call
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-3 right-3 sm:left-4 sm:right-4 top-full mt-2 backdrop-blur-md border rounded-3xl shadow-2xl border-gray-200 dark:border-white/10" style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))'
            : 'rgba(255, 255, 255, 0.95)'
        }}>
          <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
            {/* Social Links */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 font-medium">Connect</p>
              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Resume Download - Mobile */}
            <button
              onClick={downloadResume}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Resume</span>
            </button>

            {/* CTA */}
            <button
              onClick={handleBookCall}
              className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200"
            >
              Book a call
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}