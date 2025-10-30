import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  FileText,
  BookOpen
} from "lucide-react";
import { useThemeStore } from "../store/themeStore";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useThemeStore();

  const socialLinks = [
    { icon: Mail, href: "mailto:maduz.ruchira@gmail.com", label: "Email" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/ruchirarajapaksha/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/LordMaduz", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/maduz_ruchira", label: "Twitter" },
    { icon: FileText, href: "https://medium.com/@maduz.ruchira", label: "Medium" },
    { icon: BookOpen, href: "https://www.baeldung.com/author/ruchiramadhushanrajapaksha", label: "Baeldung" }
  ];

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 80; // Adjust this value based on your fixed header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="pb-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto backdrop-blur-md border rounded-full px-4 sm:px-6 py-3 sm:py-4 shadow-2xl border-gray-200 dark:border-white/10" style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))'
          : 'rgba(255, 255, 255, 0.95)'
      }}>

        {/* Copyright Text - Centered */}
        <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} Ruchira Rajapaksha. All Rights Reserved
        </div>

      </div>
    </footer>
  );
}