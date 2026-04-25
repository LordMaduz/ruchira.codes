import { useState, useRef, useEffect } from "react";
import {
  X,
  ArrowRight,
  Calendar,
  Building2,
  Users,
  Database,
  Network,
  Globe,
  TrendingUp,
  Code,
  Brain,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import dbs from '../assets/dbs.png';
import grubtech from '../assets/grubtech.png';

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.scrollWidth / projects.length;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / projects.length;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : projects.length - 1;
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < projects.length - 1 ? activeIndex + 1 : 0;
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

  const projects = [
        {
      id: "landednz",
      number: "01",
      title: "LandedNZ: AI Settlement Companion",
      company: "LandedNZ",
      role: "Sole Architect & Engineer",
      timeline: "February 2026 - Present",
      teamSize: "Sole architect and Engineer",
      description: "Full-stack AI-powered settlement companion for skilled migrants relocating to New Zealand. Personalised task roadmap, RAG pipeline, pgvector, Claude API, and SSE streaming built end to end.",
      icon: <Brain className="w-6 h-6" />,
      metrics: [
        { label: "Roadmap Engine", value: "AI", change: "RAG pipeline" },
        { label: "Response Time", value: "<1s", change: "SSE streaming" },
        { label: "Task Coverage", value: "21", change: "90-day plan" }
      ],
      technologies: ["Next.js", "React", "Node.js", "Fastify", "PostgreSQL", "pgvector", "Claude API", "RAG", "SSE", "Supabase", "React Native", "Expo", "TypeScript", "Docker"],
      impact: "My wife got into university in Auckland. We started planning the move and suddenly we were drowning in Google tabs, conflicting answers, and zero way to know what was actually true. I got frustrated enough to build the solution myself. LandedNZ is what came out of that night.",
      fullDetails: {
        overview: "LandedNZ is a full-stack AI-powered settlement companion for skilled migrants relocating to New Zealand. The system generates a personalised, prioritised task roadmap and provides context-aware settlement guidance through a RAG-powered chat advisor.",
        challenge: "Skilled migrants arriving in New Zealand face an invisible problem. There is no single source of truth for what to do, in what order, and why it matters. Missing an IRD number application in week one results in 45% emergency tax on every paycheck. Signing a lease before researching school zones costs thousands. The consequences are real, financial, and avoidable. But only if you know the order of operations before you arrive.",
        solution: "Built LandedNZ, a full-stack AI-powered settlement companion that generates a personalised, prioritised task roadmap based on visa type, city, family situation, and arrival date. The system is architecturally split into two isolated concerns: a deterministic roadmap engine that handles task sequencing and dependency resolution, and a generative AI chat advisor powered by a RAG pipeline for context-aware settlement guidance. The roadmap never fails because the AI does.",
        keyResults: [
          { metric: "Roadmap Personalisation", improvement: "Visa, city, family, job, arrival date, the 5 inputs generate a fully sequenced settlement plan" },
          { metric: "AI Response Time", improvement: "Real-time streaming chat via Server-Sent Events which generates responses under 1 second" },
          { metric: "Task Coverage", improvement: "21 settlement tasks across 3 phases covering the first 90 days in New Zealand" },
          { metric: "Architecture Isolation", improvement: "Deterministic engine and AI layer fully decoupled, zero AI dependency on critical path" }
        ],
        stakeholders: [
          "Skilled Migrants: Personalised settlement roadmap from day one. Know exactly what to do, in what order, before costly mistakes happen",
          "Partner Visa Holders: Specific task sequences for dependants. IRD, tax code, bank account, and work rights handled correctly from arrival",
          "NZ Employers: New hires who arrive with their IRD number and tax code sorted, no emergency tax rate complications from day one",
          "NZ Tech Community: Open demonstration of production AI engineering, RAG pipeline, vector search, and streaming chat built without framework abstractions"
        ],
        recognition: "Solo full-stack build, sole architect and engineer across frontend, backend, AI pipeline, and mobile"
      }
    },
    {
      id: "globe",
      number: "03",
      title: "GloBE: Tax Compliance Engine",
      company: "DBS Bank Singapore",
      role: "Lead Solutions Architect",
      timeline: "June 2024 - June 2025",
      teamSize: "8-person technical team + 15 stakeholders across jurisdictions",
      description: "Architected externalized tax calculation engine achieving 96% processing time reduction while ensuring 100% OECD BEPS 2.0 compliance across 15+ jurisdictions.",
      icon: <Globe className="w-6 h-6" />,
      metrics: [
        { label: "Processing Reduction", value: "96%", change: "Reduction" },
        { label: "Compliance Rate", value: "100%", change: "OECD Standards" },
        { label: "Jurisdictions", value: "15+", change: "Coverage" }
      ],
      technologies: ["MVEL", "Java", "Spring Boot", "HFM", "MongoDB", "Docker"],
      impact: "Fifteen countries. One deadline. One wrong calculation and a multinational corporation fails a global tax audit. I built the engine that made sure that never happened.",
      fullDetails: {
        overview: "Designed and implemented externalized tax calculation engine enabling rapid adaptation to evolving OECD regulations while reducing technical dependencies for tax professionals.",
        challenge: "OECD BEPS 2.0 Pillar Two regulations mandating 15% global minimum tax by FY2025, with complex jurisdiction-specific formulas requiring quarterly provisioning and legacy system limitations.",
        solution: "Built externalized MVEL-based calculation engine with semantic versioning, enabling tax professionals to modify business logic independently while maintaining integration with core financial systems (HFM, CbCR, UAMS).",
        keyResults: [
          { metric: "Processing Time", improvement: "5 days → 2 hours per jurisdiction (96%)" },
          { metric: "Technical Dependency", improvement: "60% reduction in IT involvement" },
          { metric: "Compliance Readiness", improvement: "3 months ahead of FY2025 deadline" },
          { metric: "User Autonomy", improvement: "Self-service template modifications" }
        ],
        stakeholders: [
          "Tax Teams (15+ jurisdictions): Self-service logic modifications",
          "Finance & Treasury: 70% faster quarterly cycles",
          "External Consultants (IRAS, KPMG): Audit-ready historical calculations"
        ],
        recognition: "Recognized by IRAS as compliance best practice for multinational tax reporting"
      }
    },
    {
      id: "derivative-trading",
      number: "04",
      title: "DEGA: Derivative Trading & Settlement System",
      company: "DBS Bank Singapore",
      role: "Senior Application Developer",
      timeline: "September 2022 - April 2024",
      teamSize: "Trade operations team",
      description: "Engineered reactive file processing system handling 50,000+ monthly trade files from Bloomberg and market data sources, achieving 60% faster processing and 20% cost reduction for derivative trading operations.",
      icon: <TrendingUp className="w-6 h-6" />,
      metrics: [
        { label: "Monthly Files", value: "50K+", change: "Processed" },
        { label: "Processing Speed", value: "60%", change: "Faster" },
        { label: "Cost Reduction", value: "20%", change: "Infrastructure" }
      ],
      technologies: ["Java 17", "Spring WebFlux", "AWS SDK v2", "AWS S3", "Project Reactor", "OpenShift", "Docker"],
      impact: "Financial markets don't wait. When Bloomberg sends a file, the trading desk needs it processed before the next tick. I built the system that made sure they never had to ask twice.",
      fullDetails: {
        overview: "Developed high-performance file processing system for derivative trading operations, enabling efficient ingestion of trade data and market data from Bloomberg and external sources for trade settlement, risk management, and compliance reporting.",
        challenge: "Traditional blocking I/O for trade file processing caused bottlenecks during market volatility periods when file volumes spike. Legacy systems struggled with large trade confirmation files (100MB+) from Bloomberg and market data feeds, causing delays in settlement and risk reporting for trading desk operations.",
        solution: "Migrated to reactive AWS SDK v2 with Spring WebFlux for non-blocking file operations. Implemented asynchronous parallel uploads/downloads using AWS Transfer Manager. Built efficient streaming for large trade files with minimal memory footprint, enabling real-time processing of Bloomberg feeds and trade confirmations.",
        keyResults: [
          { metric: "Processing Speed", improvement: "60% faster file uploads/downloads for trade data" },
          { metric: "User Base", improvement: "1,000+ daily trading users supported" },
          { metric: "File Volume", improvement: "50,000+ trade files processed monthly" },
          { metric: "Cost Efficiency", improvement: "20% reduction in infrastructure costs" }
        ],
        stakeholders: [
          "Trade Teams: 60% faster processing of Bloomberg feeds and trade confirmations",
          "Risk Management: Real-time trade data for position monitoring and risk calculations",
          "IT Infrastructure: 20% cost savings through optimized resource utilization"
        ],
        recognition: "Production system deployed supporting critical derivative trading operations"
      }
    },
    {
      id: "food-ordering",
      number: "05",
      title: "High-Volume Food Order Management System",
      company: "GrubTech Sri Lanka",
      role: "Senior Software Engineer",
      timeline: "April 2022 - September 2022",
      teamSize: "Platform engineering team",
      description: "Built scalable multi-brand food order processing system handling 500,000+ daily orders with real-time inventory management, reducing database load by 40% and API response times by 35%.",
      icon: <Code className="w-6 h-6" />,
      metrics: [
        { label: "Daily Orders", value: "500K+", change: "Processed" },
        { label: "Database Load", value: "40%", change: "Reduced" },
        { label: "Response Time", value: "35%", change: "Faster" }
      ],
      technologies: ["Java 11", "Spring Boot", "Redis", "Redisson", "MongoDB", "Confluent Kafka", "AWS", "Docker"],
      impact: "Five hundred thousand food orders a day. Every single one of them is someone who is hungry and waiting. That's enough reason to get it right.",
      fullDetails: {
        overview: "Engineered high-performance order processing system for multi-brand food delivery platform, handling real-time order placement, inventory management, and order tracking for multiple restaurant brands simultaneously with write-behind caching architecture.",
        challenge: "High-volume order placement during peak hours (lunch/dinner) overwhelmed database systems, causing slow order confirmations and inventory sync delays. Platform needed to handle 500K+ daily orders across multiple restaurant brands with instant response times while maintaining accurate real-time inventory to prevent overselling.",
        solution: "Implemented write-behind caching architecture using Redis with Redisson for instant order confirmation with delayed database persistence. Built reactive processing pipeline for non-blocking order handling. Designed automatic inventory synchronization with conflict resolution for multi-brand operations across thousands of menu items.",
        keyResults: [
          { metric: "Order Volume", improvement: "500,000+ daily orders processed seamlessly" },
          { metric: "Database Efficiency", improvement: "40% reduction in database write load" },
          { metric: "API Performance", improvement: "35% faster order confirmation response" },
          { metric: "Inventory Accuracy", improvement: "Real-time sync preventing overselling across brands" }
        ],
        stakeholders: [
          "Customers: Instant order confirmation improving user experience during peak hours",
          "Restaurant Partners: Real-time inventory management preventing overselling and order cancellations",
          "Platform Operations: 40% lower database costs through efficient caching strategy"
        ],
        recognition: "Production system processing millions of orders monthly across multiple restaurant brands"
      }
    }
  ];

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
     <section id="projects" className="bg-white dark:bg-zinc-950 text-black dark:text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">

       <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-[1.05] tracking-tight">
              <span className="text-black dark:text-white">What I've Built and Why</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-4xl text-center mx-auto leading-relaxed px-4">
            I don't build things to add them to a CV.
            I build them because something is broken and it's bothering me.
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
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-black dark:text-white" />
          </button>

          {/* Right Arrow - Desktop Only */}
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-white/20 rounded-full opacity-0 group-hover:opacity-100 hover:border-[#007AFF] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 shadow-lg"
            aria-label="Next project"
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
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project.id);
                    setActiveTab("overview");
                  }}
                  className={`group cursor-pointer relative flex-shrink-0 w-[85%] sm:w-[75%] md:w-[70%] snap-center transition-all duration-300 ${
                    activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  }`}
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <div className="h-full">
                    {/* Glassmorphism Card */}
                    <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-md border border-gray-300 dark:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-gray-100/80 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-white/20">

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
                        {/* Title */}
                        <div className="flex items-start gap-3 mb-3">
                          <h3 className="text-sm sm:text-sm md:text-lg lg:text-xl font-bold text-black dark:text-white leading-tight pt-1">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      {/* Summary Info - Always Visible */}
                      <div className="space-y-2 mb-3">
                        {/* Company */}
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#007AFF] flex-shrink-0" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{project.company}</span>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#007AFF] flex-shrink-0" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{project.timeline}</span>
                        </div>

                        {/* Team Size */}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#007AFF] flex-shrink-0" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{project.teamSize}</span>
                        </div>

                        {/* Impact */}
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-300 dark:border-white/10">
                          <TrendingUp className="w-4 h-4 text-[#007AFF] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{project.impact}</p>
                        </div>
                      </div>

                      {/* Click to View Details Indicator */}
                      <div className="text-center pt-2">
                        <span className="text-xs text-[#007AFF] uppercase tracking-wider">Click to View Details</span>
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
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'bg-[#007AFF] w-8'
                    : 'bg-gray-400 dark:bg-white/20'
                }`}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>


      {/* Original Modal Structure with Minimalist Colors */}
      {selectedProject && selectedProjectData && (
        <div className="fixed inset-0 bg-white/95 dark:bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b border-gray-300 dark:border-gray-800 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 pr-2">
                  <div className="flex items-center justify-center flex-shrink-0"/>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm sm:text-sm md:text-lg lg:text-xl font-bold text-black dark:text-white mb-2 leading-tight">{selectedProjectData.title}</h2>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{selectedProjectData.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{selectedProjectData.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{selectedProjectData.teamSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedProject(null); }}
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 dark:border-gray-800 hover:border-[#007AFF] flex items-center justify-center transition-colors group flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white group-hover:text-[#007AFF]" />
                </button>
              </div>

              {/* Key Impact */}
              <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 p-4 sm:p-6 mt-4">
                <h4 className="text-xs sm:text-sm font-bold text-[#007AFF] mb-2">KEY IMPACT</h4>
                <p className="text-sm sm:text-base text-black dark:text-white leading-relaxed">{selectedProjectData.impact}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="p-4 sm:p-6">
              <div className="border-b border-gray-300 dark:border-gray-800 mb-6">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                  {['overview', 'results', 'impact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors border-b-2 whitespace-nowrap ${
                        activeTab === tab
                          ? 'text-[#007AFF] border-[#007AFF]'
                          : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-transparent'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Challenge */}
                     <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 p-3 sm:p-4">
                      <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white mb-2 sm:mb-3">Challenge</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {selectedProjectData.fullDetails.challenge}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 p-3 sm:p-4">
                      <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white mb-2 sm:mb-3">Solution</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {selectedProjectData.fullDetails.solution}
                      </p>
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-black dark:text-white mb-3 sm:mb-4">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProjectData.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {selectedProjectData.fullDetails.keyResults.map((result, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 p-3 sm:p-4">
                        <h5 className="text-sm sm:text-base font-semibold  text-black dark:text-white mb-2">{result.metric}</h5>
                        <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          {result.improvement}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recognition */}
                  {selectedProjectData.fullDetails.recognition && (
                    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 p-4 sm:p-6">
                      <h4 className="text-sm sm:text-base font-semibold text-[#007AFF] mb-2 sm:mb-3">Recognition</h4>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedProjectData.fullDetails.recognition}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'impact' && (
                <div className="space-y-4">
                  <h4 className="text-sm sm:text-base  font-semibold text-black dark:text-white mb-3 sm:mb-4">Stakeholder Benefits</h4>
                  {selectedProjectData.fullDetails.stakeholders.map((stakeholder, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{stakeholder}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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