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
          <div className="mb-4 sm:mb-5 pl-6 sm:pl-8">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-[1.05] tracking-tight">
              <span className="text-black dark:text-white">Story Behind the Code</span>
            </h2>
          </div>

          {/* Story */}
          <div className="hover:border-[#007AFF] transition-colors duration-300 pl-6 sm:pl-8">
            <div className="space-y-4 sm:space-y-5">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I grew up completely obsessed with video games. Not playing them, 
                well yes that too, but mostly staring at the screen wondering how 
                something like this even exists. I was just a kid in Sri Lanka with 
                a lot of questions and zero answers.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                That curiosity never went away. It just found a new home.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                The other thing that made me who I am is anime. I know how that sounds.
                But anime taught me things I didn't find anywhere else. How to be selfless.
                How to respect the people who came before you. How to keep going when you
                have every reason to stop.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                You don't just watch those stories, you live inside them,
                and the memories stay with you the same way real ones do.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Between a kid who wanted to understand how things are built, and years of living
                with characters who refused to give up, I think that's actually where I come from.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}