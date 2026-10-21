import imageBlack from "../assets/Ruchira_Black.png";
import imageWhite from "../assets/Ruchira_White.png";
import { useThemeStore } from "../store/themeStore";
import AskBox from "./AskBox";

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
    <section className="home" id="home">
      <div className="wrap">
        <div className="photo">
          <img
            src={theme === 'dark' ? imageBlack : imageWhite}
            alt="Ruchira Rajapaksha"
            loading="eager"
          />
        </div>
        <h1>Hey, I'm Ruchira.<span>AI Product Engineer</span></h1>
        <div className="status">
          <span className="on"><i />Open to new roles</span>
          <span className="sep" aria-hidden="true">·</span>
          <span className="where">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19.5 10.5c0 7.1-7.5 11.3-7.5 11.3s-7.5-4.2-7.5-11.3a7.5 7.5 0 1 1 15 0Z" /><circle cx="12" cy="10.5" r="2.5" /></svg>
            Auckland, New Zealand
          </span>
        </div>
        <p className="lede">I started out wanting to build video games as a kid. Ended up building something far more interesting instead.</p>
        <p className="lede">Now I'm at Arbitr, an AI translation platform, working on the checks that hand work to a person when the AI isn't sure.</p>
        <div className="ctas">
          <a className="btn solid" href="https://cal.com/ruchira-rajapaksha" target="_blank" rel="noopener noreferrer">Book a 20-minute chat</a>
          <a className="btn soft" href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}>See my work</a>
        </div>
        <AskBox />
      </div>
    </section>
  );
}
