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
      id: "backend",
      number: "01",
      title: "Backend Engineering & Microservices",
      technologies: ["Java 21", "Spring Boot", "Spring Framework", "Go", "Node.js"],
      story: "I build backend systems that handle millions of requests. My approach is simple where I design APIs that feel intuitive to developers while being robust enough for enterprise scale. Every endpoint I create is crafted thinking about the developer experience first, clear contracts, predictable behavior, and responses that make sense. Because when backend systems just work, everyone's day gets better.",
      impact: "Users get instant responses. Developers get APIs they actually enjoy working with. Operations teams sleep peacefully at night."
    },
    {
      id: "distributed",
      number: "02",
      title: "Distributed Systems & Event-Driven Architecture",
      technologies: ["Microservices", "Event-Driven Design", "CQRS", "Domain-Driven Design"],
      story: "I architect systems where services communicate like a well-orchestrated conversation, not shouting at each other, but listening, responding, and staying in sync. When one service processes data, others react in real-time without polling or waiting. This isn't just about technical elegance; it's about building systems that scale naturally and degrade gracefully when things go wrong.",
      impact: "Real-time experiences without the complexity. Systems that grow with your business, not against it."
    },
    {
      id: "kafka",
      number: "03",
      title: "Event Streaming & Real-Time Data",
      technologies: ["Apache Kafka", "Kafka Streams", "CloudEvents", "AWS Kinesis", "Reactor Kafka"],
      story: "I design event streams that ensure users never wait for something that can happen in the background. When a customer places an order, they get instant confirmation, not because of magic, but because of well-architected event pipelines that prioritize user experience over system complexity. Every event tells a story, and I make sure that story reaches the right audience at the right time.",
      impact: "Instant user feedback. Zero data loss. Systems that feel responsive even under heavy load."
    },
    {
      id: "reactive",
      number: "04",
      title: "Reactive Programming & High-Performance Systems",
      technologies: ["Project Reactor", "Spring WebFlux", "Non-blocking I/O", "Backpressure Handling"],
      story: "I write code that doesn't waste time waiting. While traditional systems sit idle waiting for databases or external APIs, reactive systems I build keep working, handling thousands of concurrent users without spinning up thousands of threads. It's about respecting server resources while delivering blazing-fast responses to users. Every millisecond saved is a better user experience delivered.",
      impact: "Sub-20ms response times. Servers that handle 10x more load with the same resources. Smooth experiences even during traffic spikes."
    },
    {
      id: "cloud",
      number: "05",
      title: "Cloud-Native Architecture & Infrastructure",
      technologies: ["AWS (EC2, S3, Lambda, ECS, EKS)", "Kubernetes", "Docker", "OpenShift", "Terraform"],
      story: "I build applications that were born for the cloud not retrofitted into it. Auto-scaling when traffic surges, self-healing when things fail, and costing pennies when idle. My infrastructure code is as important as application code, because reliability and cost-efficiency shouldn't be afterthoughts. I design systems that operations teams can deploy with confidence and finance teams can approve without hesitation.",
      impact: "20% lower infrastructure costs. Zero-downtime deployments. Systems that scale automatically when you need them."
    },
    {
      id: "database",
      number: "06",
      title: "Data Architecture & Caching Strategies",
      technologies: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch", "DynamoDB"],
      story: "I choose databases like a chef choosing ingredients, each one serving a specific purpose. PostgreSQL for transactional integrity, Redis for lightning-fast caching, MongoDB for flexible schemas, Elasticsearch for powerful search. But it's not just about picking the right database; it's about designing data flows where users get instant results while maintaining consistency behind the scenes. Smart caching means users see their changes immediately, even if the full save happens later.",
      impact: "35% faster API responses. 40% reduced database load. Users see instant updates without compromise on data integrity."
    },
    {
      id: "api",
      number: "07",
      title: "API Design & Integration",
      technologies: ["RESTful APIs", "GraphQL", "gRPC", "OpenAPI 3.0", "Apache Camel", "WebSockets"],
      story: "I design APIs that feel like conversations, not contracts. Whether it's REST for simplicity, GraphQL for flexibility, or gRPC for performance, I choose the right protocol for the right job. Every endpoint is documented, every error message is helpful, and every response is structured in a way that makes frontend developers smile. Integration shouldn't be painful, it should be predictable and pleasant.",
      impact: "Developers integrate in hours, not days. Clear documentation means fewer support tickets. APIs that evolve without breaking existing clients."
    },
    {
      id: "security",
      number: "08",
      title: "Security & Access Control",
      technologies: ["Zero-Trust Architecture", "ABAC (Cedar, OPA)", "OAuth 2.0", "RBAC", "APISIX Gateway"],
      story: "I build security into systems from day one, not as an afterthought. Zero-trust means never assuming anyone or anything is safe by default. Attribute-based access control means users can do exactly what they need, nothing more, nothing less. And when something goes wrong, audit trails tell us exactly what happened. Security doesn't have to be a user experience nightmare; it should be invisible to legitimate users and impenetrable to bad actors.",
      impact: "99.9% uptime with zero security breaches. Users stay secure without friction. Compliance teams get audit trails that actually make sense."
    },
    {
      id: "observability",
      number: "09",
      title: "Observability & Performance Monitoring",
      technologies: ["OpenTelemetry", "Grafana", "Prometheus", "Distributed Tracing", "APM Tools"],
      story: "I build systems that tell me when something's wrong before users notice. Distributed tracing means I can follow a single request across dozens of services and pinpoint exactly where the slowdown happened. Metrics and dashboards aren't just pretty graphs, they're early warning systems that help teams fix issues in minutes instead of hours. When production incidents happen, my monitoring setup tells us exactly what, where, and why.",
      impact: "80% faster incident detection. 75% faster resolution times. Problems fixed before customers complain."
    }
  ];

  return (
    <section id="skills" className="bg-white dark:bg-zinc-950 text-black dark:text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.05] tracking-tight">
              <span className="text-black dark:text-white">What I Can Do</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl text-center mx-auto leading-relaxed">
            Technology is just a tool. What matters is how you wield it, not to show off technical prowess, but to solve real problems and make people's lives better.
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
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white leading-tight pt-1">
                      {category.title}
                    </h3>
                  </div>


                </div>

                {/* Technologies Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
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