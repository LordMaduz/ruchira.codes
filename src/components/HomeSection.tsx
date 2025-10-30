import imageBlack from "../assets/Ruchira_Black.png";
import imageWhite from "../assets/Ruchira_White.png";
import { useThemeStore } from "../store/themeStore";

interface HomeSectionProps {
  setActiveSection: (section: string) => void;
}

export default function HomeSection({ setActiveSection }: HomeSectionProps) {
  const theme = useThemeStore((state) => state.theme);
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
  };

  return (
    <section id="home" className="bg-white dark:bg-zinc-950 text-black dark:text-white pt-20 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-2xl mx-auto px-6 text-center">

        {/* Profile Image */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-gray-300 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-colors duration-300 shadow-2xl">
            <img
              src={theme === 'dark' ? imageBlack : imageWhite}
              alt="Ruchira Rajapaksha"
              className="w-full h-full object-cover scale-105"
              style={{ objectPosition: "50% 20%" }}
              loading="eager"
            />
          </div>
        </div>

        {/* Greeting */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 leading-tight">
          Hey, I'm Ruchira.
          <br />
          <span className="text-gray-600 dark:text-gray-400">Engineer & AWS Certified Solutions Architect.</span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 leading-relaxed max-w-xl mx-auto">
          Engineer who designs distributed systems that process
          millions of transactions, then builds them in production.
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto">
           Not just diagrams.
           Not just code. End-to-end solutions that don't break when they scale.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="https://cal.com/ruchira-rajapaksha"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 w-full sm:w-auto text-center"
          >
            Hire me
          </a>
          <button
            className="px-8 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-full hover:bg-emerald-500/20 transition-all duration-200 border border-emerald-500/20 w-full sm:w-auto"
          >
            Open to Opportunities
          </button>
        </div>
      </div>
    </section>
  );
}