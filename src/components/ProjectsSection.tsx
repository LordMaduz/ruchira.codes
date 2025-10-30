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
      id: "hedge-accounting",
      number: "01",
      title: "Corporate Banking Hedge Accounting Platform",
      company: "DBS Bank Singapore",
      role: "Technical Lead",
      timeline: "June 2024 - Present",
      teamSize: "Cross-functional team across 5+ departments",
      description: "Built enterprise scale hedge accounting platform processing 1M+ daily transactions with reactive microservices, supporting fair value, cash flow, and net investment hedges for corporate banking clients.",
      icon: <Database className="w-6 h-6" />,
      metrics: [
        { label: "Daily Transactions", value: "1M+", change: "12K req/sec" },
        { label: "Response Time", value: "20ms", change: "Low latency" },
        { label: "System Uptime", value: "99.9%", change: "High availability" }
      ],
      technologies: ["Java 21", "Spring Boot", "Kafka", "CloudEvents", "Project Reactor", "Redis", "PostgreSQL", "Kubernetes"],
      impact: "Processed 1M+ daily hedge accounting transactions (12K requests per second) with 20ms latency and 99.9% uptime, enabling real-time hedge effectiveness testing and valuation for corporate banking clients.",
      fullDetails: {
        overview: "Architected and implemented large-scale hedge accounting platform for corporate banking, enabling real-time processing of fair value hedges (interest rate risk), cash flow hedges (FX risk), and net investment hedges (foreign subsidiaries) with event-driven reactive microservices architecture.",
        challenge: "Legacy batch-processing systems couldn't handle real-time hedge accounting requirements for corporate clients, causing delays in hedge effectiveness testing and valuation. System needed to process 1M+ daily transactions with sub-20ms latency while maintaining data consistency across multiple hedge types and accounting standards (IFRS 9, FAS 133).",
        solution: "Built event-driven hedge accounting platform using Kafka and CloudEvents for real-time financial event streaming. Implemented reactive microservices with Project Reactor for non-blocking transaction handling. Designed distributed Redis caching for high-speed hedge valuation calculations and query performance across multiple hedge relationships.",
        keyResults: [
          { metric: "Transaction Volume", improvement: "1M+ daily transactions at 12K requests/second" },
          { metric: "Processing Speed", improvement: "Sub-20ms latency for hedge valuations" },
          { metric: "System Reliability", improvement: "99.9% uptime for critical banking operations" },
          { metric: "Operational Efficiency", improvement: "Real-time hedge effectiveness testing vs daily batch" }
        ],
        stakeholders: [
          "Corporate Clients: Real-time hedge accounting for interest rate, FX, and equity risks",
          "Treasury Teams: Immediate hedge effectiveness testing and rebalancing decisions",
          "Risk & Compliance: Reduced codebase issues by 30% through comprehensive testing standards"
        ],
        recognition: "Led technical architecture sessions elevating engineering standards across 15+ microservices"
      }
    },
    {
      id: "notification-platform",
      number: "02",
      title: "Dynamic Multi-Channel Notification Orchestration Platform",
      company: "DBS Bank Singapore",
      role: "Technical Lead",
      timeline: "June 2024 - Present",
      teamSize: "Platform engineering team",
      description: "Designed enterprise notification orchestration platform with dynamic channel integration (Email, Teams, Mobile, Webhooks), reducing cross-department coordination time from 48 hours to 4 hours (92%).",
      icon: <Network className="w-6 h-6" />,
      metrics: [
        { label: "Coordination Time", value: "92%", change: "Reduced" },
        { label: "Channels", value: "Multi", change: "Email/Teams/App" },
        { label: "Response Time", value: "50%", change: "Improved" }
      ],
      technologies: ["Java 21", "Spring Boot", "Apache Camel", "Kafka", "CloudEvents", "REST APIs", "Webhooks", "Kubernetes"],
      impact: "Reduced cross-department coordination time by 92% (48 hours to 4 hours) and improved operational responsiveness by 50% through dynamic multi-channel notification platform supporting Email, Teams, Mobile, and custom Webhooks.",
      fullDetails: {
        overview: "Built standalone enterprise notification orchestration platform enabling dynamic channel integration and configurable workflow-based alerts, supporting Email, Microsoft Teams, mobile app notifications, and custom webhooks for real-time business process automation.",
        challenge: "Disparate notification systems across departments created communication silos and coordination delays. Each team built custom notification implementations, making it difficult to implement timely workflow updates, approval alerts, and cross-functional collaboration. Manual coordination took 48 hours for critical business processes.",
        solution: "Designed centralized notification orchestration platform with dynamic channel plugins supporting Email, Teams, mobile push, and custom webhooks. Built configurable workflow triggers enabling business users to define notification rules without code changes. Implemented event-driven architecture using Kafka and CloudEvents for reliable message delivery across channels.",
        keyResults: [
          { metric: "Coordination Efficiency", improvement: "48 hours → 4 hours (92% reduction)" },
          { metric: "Channel Integration", improvement: "Multi-channel support (Email, Teams, App, Webhooks)" },
          { metric: "Operational Response", improvement: "50% faster response to workflow updates" },
          { metric: "Configuration", improvement: "Self-service workflow trigger configuration" }
        ],
        stakeholders: [
          "Platform Teams: Centralized notification infrastructure reducing maintenance overhead",
          "Business Users: Self-service configuration for workflow-based notifications",
          "Operations: 92% faster cross-department coordination through real-time alerts"
        ],
        recognition: "Standalone platform enabling real-time workflow automation across business units"
      }
    },
    {
      id: "globe",
      number: "03",
      title: "GloBE: Tax Compliance Engine for Global MNEs",
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
      impact: "Cut processing time from 5 days to 2 hours per jurisdiction (96% reduction) while achieving 100% OECD compliance 3 months ahead of mandatory deadline.",
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
      title: "Derivative Trading File Processing & Settlement System",
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
      impact: "Achieved 60% faster trade file processing and 20% infrastructure cost reduction while handling 50,000+ monthly files for 1,000+ daily trading users, supporting derivative trading operations and market data integration.",
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
      title: "High-Volume Food Order Management & Inventory System",
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
      impact: "Processed 500,000+ daily food orders with 40% reduced database load and 35% faster API response times, enabling instant order confirmation and real-time inventory synchronization across multiple restaurant brands.",
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