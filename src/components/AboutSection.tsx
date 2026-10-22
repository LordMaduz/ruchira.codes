import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Globe = lazy(() => import("./Globe"));

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  // load the globe (and d3-geo) only when About is about to scroll into view
  useEffect(() => {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <section className="about" id="about">
      <div className="wrap" ref={ref}>
        <div className="sec-h"><h2>Story behind the code</h2><p className="about-lede">Three places, and one question I've asked since I was a kid. Watch the flight, or drag the globe to look around.</p></div>
        {near ? <Suspense fallback={<div className="journey journey-ph" />}><Globe /></Suspense> : <div className="journey journey-ph" />}
      </div>
    </section>
  );
}
