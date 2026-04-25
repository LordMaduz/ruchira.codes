import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpertiseCategory {
  id: string;
  number: string;
  title: string;
  technologies: string[];
  story: string;
  impact: string;
}

export default function SkillsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.scrollWidth / expertiseCategories.length;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / expertiseCategories.length;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : expertiseCategories.length - 1;
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < expertiseCategories.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(newIndex);
  };

  // Keyboard navigation (only when section is hovered)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered) return; // Only respond when hovering over this section

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isHovered]);

  const expertiseCategories: ExpertiseCategory[] = [
    {
      id: "ai-engineering",
      number: "01",
      title: "AI Engineering",
      technologies: ["Agentic AI", "Prompt Engineering", "RAG Pipeline", "Vector Search"],
      story: "Most AI impresses in the demo and quietly fails after. I'm interested in the part that comes after the demo.",
      impact: "AI features that ship to production and stay there. Systems where the AI layer enhances the experience without becoming a single point of failure."
    },
    {
      id: "distributed",
      number: "02",
      title: "Distributed Systems",
      technologies: ["Microservices", "Event-Driven Design", "CQRS", "Domain-Driven Design"],
      story: "A million things happening at once, and nobody should feel any of it. That's the invisible work I find most satisfying.",
      impact: "Real-time experiences without the complexity. Systems that grow with your business, not against it."
    },
    {
      id: "security",
      number: "03",
      title: "Security",
      technologies: ["Zero-Trust Architecture", "ABAC", "OAuth 2.0", "RBAC", "API Gateway"],
      story: "The best security is the kind nobody notices. Invisible to the people who belong. Absolute to the ones who don't.",
      impact: "99.9% uptime with zero security breaches. Users stay secure without friction. Compliance teams get audit trails that actually make sense."
    },
    {
      id: "observability",
      number: "04",
      title: "Observability",
      technologies: ["OpenTelemetry", "Grafana", "Prometheus", "Distributed Tracing"],
      story: "I'd rather know your system is about to break before you do. Usually I do.",
      impact: "80% faster incident detection. 75% faster resolution times. Problems fixed before customers complain."
    },
    {
      id: "api",
      number: "05",
      title: "API Design",
      technologies: ["REST APIs", "GraphQL", "gRPC", "Apache Camel", "WebSockets"],
      story: "An API is a conversation between two systems. I design the kind people don't complain about.",
      impact: "Developers integrate in hours, not days. Clear documentation means fewer support tickets. APIs that evolve without breaking existing clients."
    }
  ];

  return (
    <section id="skills" className="bg-white dark:bg-zinc-950 text-black dark:text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-[1.05] tracking-tight">
              <span className="text-black dark:text-white">What I Can Do</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-4xl text-center mx-auto leading-relaxed px-4">
            I don't think about technology. I think about the puzzle inside it.
            The moment something clicks, time comes back and someone somewhere has a better day.
            That's the job.
          </p>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow - Desktop Only */}
          <button
            onClick={handlePrevious}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-white/20 rounded-full opacity-0 group-hover:opacity-100 hover:border-[#007AFF] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 shadow-lg"
            aria-label="Previous skill"
          >
            <ChevronLeft className="w-6 h-6 text-black dark:text-white" />
          </button>

          {/* Right Arrow - Desktop Only */}
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-white/20 rounded-full opacity-0 group-hover:opacity-100 hover:border-[#007AFF] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 shadow-lg"
            aria-label="Next skill"
          >
            <ChevronRight className="w-6 h-6 text-black dark:text-white" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-px-6 lg:scroll-px-12"
          >
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-[7.5%] sm:w-[12.5%] md:w-[15%]"></div>
              {expertiseCategories.map((category, idx) => (
                <div
                  key={category.id}
                  className={`group relative flex-shrink-0 w-[85%] sm:w-[75%] md:w-[70%] snap-center transition-all duration-300 ${
                    activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  }`}
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <div className="h-full">
                  {/* Glassmorphism Card */}
                  <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-md border border-gray-300 dark:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-gray-100/80 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-white/20"
                  >

                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,122,255,0.3) 0%, rgba(0,122,255,0.5) 100%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* Header Section */}
                <div className="mb-4">
                  {/* Number Badge */}
                  <div className="flex items-start gap-3 mb-3">


                    {/* Title */}
                    <h3 className="text-sm sm:text-sm md:text-lg lg:text-xl font-bold text-black dark:text-white leading-tight pt-1">
                      {category.title}
                    </h3>
                  </div>


                </div>

                {/* Technologies Pills — visible only on active card */}
                <div className={`flex flex-wrap gap-2 transition-all duration-300 ${activeIndex === idx ? 'opacity-100 max-h-40 mb-3' : 'opacity-0 max-h-0 overflow-hidden mb-0'}`}>
                  {category.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 backdrop-blur-sm rounded-full border border-gray-300 dark:border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Content - Always Visible */}
                <div className="mt-4">
                  <div className="pt-3 border-t border-gray-300 dark:border-white/10">
                    {/* Story */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#007AFF] uppercase tracking-wider mb-2">
                        How I Use It
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {category.story}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
                </div>
              ))}
              <div className="flex-shrink-0 w-[7.5%] sm:w-[12.5%] md:w-[15%]"></div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {expertiseCategories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'bg-[#007AFF] w-8'
                    : 'bg-gray-400 dark:bg-white/20'
                }`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}