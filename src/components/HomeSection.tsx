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
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 dark:text-gray-400">Engineer & AWS Solutions Architect</span>
        </h1>

        {/* Recruiter Status Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm font-semibold">Open Work Visa</span>
          </div>
          <span className="text-gray-300 dark:text-gray-700 select-none">·</span>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm font-semibold">No Sponsorship Required</span>
          </div>
          <span className="text-gray-300 dark:text-gray-700 select-none">·</span>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-sm font-medium">Auckland, New Zealand</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 leading-relaxed max-w-xl mx-auto">
          I started out wanting to build video games as a kid.
          <br />
          Ended up building something far more interesting instead.
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto">
          I'm one of those engineers who lives in both enterprise architecture and AI, and I genuinely can't wait to do that work in Auckland.
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
            onClick={() => scrollToSection('contact')}
            className="px-8 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-full hover:bg-emerald-500/20 transition-all duration-200 border border-emerald-500/20 w-full sm:w-auto"
          >
            Open to Opportunities
          </button>
        </div>
      </div>
    </section>
  );
}