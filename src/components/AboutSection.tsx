interface AboutSectionProps {
  setActiveSection: (section: string) => void;
}

export default function AboutSection({ setActiveSection }: AboutSectionProps) {
  return (
    <section id="about" className="bg-white dark:bg-zinc-950 text-black dark:text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">

      {/* Subtle diagonal pattern background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.03) 10px,
            rgba(0,0,0,0.03) 11px
          )`
        }} />
      </div>

       <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight">
              <span className="text-black dark:text-white">STORY BEHIND THE CODE</span>
            </h2>
          </div>

          {/* About Me */}
          <div className="hover:border-[#007AFF] transition-colors duration-300 pl-6 sm:pl-8 mb-6 sm:mb-8">
            <div className="space-y-4 sm:space-y-5">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I'm an engineer based in Singapore but born in Sri Lanka. Programming found me by accident during a moment of curiosity and that curiosity became an obsession that shaped everything I build today.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                An anime fan who discovered that the best perspectives come from unexpected places. When I'm not
                coding, I'm learning life lessons from stories that somehow always find their way back into my work.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I am also a featured Baeldung Author. I turn late-night sessions and production incidents into
                lessons that help developers worldwide, because best knowledge is the knowledge shared.
              </p>
            </div>
          </div>

          {/* My Approach */}
          <div className="hover:border-[#007AFF] transition-colors duration-300 pl-6 sm:pl-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-6 sm:w-8 h-[2px] bg-[#007AFF]"></div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Here is My Approach</span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I ask WHY until we hit the real problem, not just the symptom, and I challenge "that's how we've always done it" with respect because the best ideas often hide behind assumptions. Also I make complex things simple, not for elegance, but because simplicity is kindness to the next engineer who has to maintain it.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I build systems, but I also build connections by mentoring without ego and listening more than I talk. Great work isn't just about what you build, it's about who you build it with.
              </p>
            </div>
          </div>

          {/* Why Hire Me */}
          <div className="hover:border-[#007AFF] transition-colors duration-300 pl-6 sm:pl-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-6 sm:w-8 h-[2px] bg-[#007AFF]"></div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Why Hire Me</span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I work on systems where reliability isn't optional and scale isn't theoretical, but what truly drives me isn't the tech, it's the impact on real people and the teams I work with.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I translate business needs into solutions people trust, mentor without making others feel small, and say "I don't know, but I'll find out" without shame because that's how real growth happens.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Over the years, I’ve realized that while code evolves and gets replaced, the real legacy lies in the people you work with and the culture you shape. That's why i put my energy in to solving problems that matter, helping teams grow stronger, and sharing what I’ve learned so others can build even better things.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}