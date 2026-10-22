import { useEffect, useRef, useState } from "react";
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { useReducedMotion } from "framer-motion";
import { OVERVIEW, STOPS } from "@/data/stops";
import LAND from "@/data/land.json";
import { useThemeStore } from "@/store/themeStore";

type LngLat = [number, number];
const PLANE = "M12 0 L-2 -2.2 L-6 -10 L-9.5 -10 L-6.5 -2.2 L-11 -2.2 L-13.5 -6 L-15.5 -6 L-14 0 L-15.5 6 L-13.5 6 L-11 2.2 L-6.5 2.2 L-9.5 10 L-6 10 L-2 2.2 Z";
const COLORS = ["sea1", "sea2", "land", "land-edge", "grat", "accent", "glow", "fg", "bg", "muted"] as const;

function StoryPanel({ i, reduce }: { i: number; reduce: boolean }) {
  const st = STOPS[i];
  const [typed, setTyped] = useState(reduce ? st.cmd : "");
  useEffect(() => {
    if (reduce) { setTyped(st.cmd); return; }
    let n = 0;
    setTyped("");
    const t = setInterval(() => { setTyped(st.cmd.slice(0, ++n)); if (n >= st.cmd.length) clearInterval(t); }, 38);
    return () => clearInterval(t);
  }, [st.cmd, reduce]);
  return (
    <div key={i} className="journey-info swap" aria-hidden="true">
      <span className="chap">Chapter {i + 1} of {STOPS.length}</span>
      <code className="cmd"><span className="cmd-t">{typed}</span></code>
      <h3>{st.title}</h3>
      <p>{st.story}</p>
    </div>
  );
}

// Port of the mockup's globe journey: Sri Lanka, Singapore, Auckland, drawn on a canvas with d3-geo.
export default function Globe() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const api = useRef<{ fly: () => void; pick: (i: number) => void } | null>(null);
  const [shown, setShown] = useState(0);
  const [pressed, setPressed] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current!, wrap = wrapRef.current!, g = canvas.getContext("2d")!;
    const proj = geoOrthographic().clipAngle(90).precision(0.4), path = geoPath(proj, g), graticule = geoGraticule10();
    const plane = new Path2D(PLANE);
    const legs = [0, 1].map((i) => ({ a: STOPS[i].at, b: STOPS[i + 1].at, gi: geoInterpolate(STOPS[i].at, STOPS[i + 1].at), done: 0 }));
    const GL = { center: OVERVIEW.slice() as LngLat, plane: STOPS[0].at as LngLat, planeAhead: null as LngLat | null, lift: 1, current: 0, landed: [true, false, false], size: 0, R: 0 };
    let c: Record<string, string> = {};
    let userPicked = false, flying = false, flight = 0, alive = true, started = false;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      c = Object.fromEntries(COLORS.map((n) => [n, cs.getPropertyValue(`--r-${n}`).trim()]));
    };
    const sizeGlobe = () => {
      const s = wrap.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
      GL.size = s; GL.R = s * 0.42;
      canvas.width = s * dpr; canvas.height = s * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      proj.scale(GL.R).translate([s / 2, s / 2]);
    };
    const visible = (p: LngLat) => geoDistance(p, GL.center) < Math.PI / 2 - 0.02;
    const line = (a: LngLat, b: LngLat) => ({ type: "LineString", coordinates: [a, b] }) as GeoPermissibleObjects;

    const draw = (t: number) => {
      const s = GL.size, R = GL.R, cx = s / 2;
      proj.rotate([-GL.center[0], -GL.center[1]]);
      g.clearRect(0, 0, s, s);
      // atmosphere
      const atm = g.createRadialGradient(cx, cx, R * 0.96, cx, cx, R * 1.16);
      atm.addColorStop(0, c.glow); atm.addColorStop(1, "transparent");
      g.fillStyle = atm; g.beginPath(); g.arc(cx, cx, R * 1.16, 0, 6.283); g.fill();
      // sea with a soft light from the top left
      const sea = g.createRadialGradient(cx - R * 0.35, cx - R * 0.4, R * 0.1, cx, cx, R);
      sea.addColorStop(0, c.sea1); sea.addColorStop(1, c.sea2);
      g.beginPath(); path({ type: "Sphere" }); g.fillStyle = sea; g.fill();
      g.beginPath(); path(graticule); g.strokeStyle = c.grat; g.lineWidth = 1; g.stroke();
      g.beginPath(); path(LAND as GeoPermissibleObjects); g.fillStyle = c.land; g.fill(); g.strokeStyle = c["land-edge"]; g.lineWidth = 0.8; g.stroke();
      // routes: dashed ahead, solid where the plane has been
      for (const l of legs) {
        g.beginPath(); path(line(l.a, l.b));
        g.setLineDash([2, 5]); g.strokeStyle = c.muted; g.globalAlpha = 0.55; g.lineWidth = 1.4; g.stroke();
        g.setLineDash([]); g.globalAlpha = 1;
        if (l.done > 0.001) { g.beginPath(); path(line(l.a, l.gi(l.done))); g.strokeStyle = c.accent; g.lineWidth = 2.4; g.stroke(); }
      }
      // stops
      STOPS.forEach((st, i) => {
        if (!visible(st.at)) return;
        const [x, y] = proj(st.at)!;
        if (i === GL.current && !reduce) {
          const k = (t / 1600) % 1;
          g.beginPath(); g.arc(x, y, 5 + k * 14, 0, 6.283); g.strokeStyle = c.accent; g.globalAlpha = 1 - k; g.lineWidth = 2; g.stroke(); g.globalAlpha = 1;
        }
        g.beginPath(); g.arc(x, y, 5, 0, 6.283);
        g.fillStyle = GL.landed[i] ? c.accent : c.bg; g.fill();
        g.strokeStyle = GL.landed[i] ? c.accent : c.muted; g.lineWidth = 2; g.stroke();
      });
      // plane, pointed along its route
      if (visible(GL.plane)) {
        const [x, y] = proj(GL.plane)!, ahead = GL.planeAhead && visible(GL.planeAhead) ? proj(GL.planeAhead) : null;
        const ang = ahead ? Math.atan2(ahead[1] - y, ahead[0] - x) : -0.35;
        g.save(); g.translate(x, y + 3 * (GL.lift - 1) * 4); g.rotate(ang); g.scale(GL.lift * 0.9, GL.lift * 0.9);
        g.fillStyle = "rgba(0,0,0,.18)"; g.fill(plane); g.restore();
        g.save(); g.translate(x, y); g.rotate(ang); g.scale(GL.lift, GL.lift);
        g.fillStyle = c.fg; g.fill(plane); g.restore();
      }
      // rim
      g.beginPath(); path({ type: "Sphere" }); g.strokeStyle = c.accent; g.globalAlpha = 0.45; g.lineWidth = 1.2; g.stroke(); g.globalAlpha = 1;
      // labels follow the globe and hide on its far side; while flying only the stop it just left keeps its label
      STOPS.forEach((st, i) => {
        const pin = pinRefs.current[i];
        if (!pin) return;
        const on = visible(st.at) && (!flying || i === GL.current);
        pin.hidden = !on;
        if (on) { const [x, y] = proj(st.at)!; pin.style.left = (x / s) * 100 + "%"; pin.style.top = (y / s) * 100 + "%"; }
      });
    };

    const showStop = (i: number) => { setShown(i); setPressed(i); };
    const land = (i: number) => { GL.landed[i] = true; GL.current = i; if (!userPicked) showStop(i); };

    const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    // every tween belongs to the current flight; starting a new flight (or a pin turn) stops the old ones
    const tween = (ms: number, fn: (e: number) => void) => new Promise<void>((done) => {
      const id = flight, t0 = performance.now();
      const step = (t: number) => {
        if (!alive || id !== flight) return done();
        const k = Math.min(1, (t - t0) / ms); fn(ease(k));
        if (k < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    });
    const turnTo = (target: LngLat, ms: number) => {
      const gi = geoInterpolate(GL.center.slice() as LngLat, target);
      return tween(ms, (e) => { GL.center = gi(e); });
    };
    const flyLeg = (l: (typeof legs)[number], ms: number) => tween(ms, (e) => {
      l.done = e;
      GL.plane = l.gi(e); GL.planeAhead = l.gi(Math.min(1, e + 0.02));
      GL.center = GL.plane; // the globe turns under the plane
      GL.lift = 1 + Math.sin(e * Math.PI) * 0.5;
    });
    const fly = async () => {
      const id = ++flight, live = () => alive && id === flight;
      flying = true; userPicked = false;
      legs.forEach((l) => (l.done = 0));
      GL.landed = [false, false, false]; GL.plane = STOPS[0].at; GL.planeAhead = legs[0].gi(0.02); GL.lift = 1;
      await turnTo(STOPS[0].at, 1000); if (!live()) return;
      land(0);
      for (let i = 0; i < legs.length; i++) {
        await wait(1500); if (!live()) return;
        await flyLeg(legs[i], i === 0 ? 1800 : 3200); if (!live()) return;
        land(i + 1);
      }
      await wait(1200); if (!live()) return;
      await turnTo(OVERVIEW, 1600); if (!live()) return;
      flying = false;
    };
    const finalState = () => {
      flight++; flying = false;
      legs.forEach((l) => (l.done = 1));
      GL.landed = [true, true, true]; GL.plane = STOPS[2].at; GL.planeAhead = null; GL.lift = 1; GL.center = OVERVIEW.slice() as LngLat;
      land(2);
    };
    api.current = {
      fly: () => { started = true; return reduce ? finalState() : fly(); },
      pick: (i) => {
        userPicked = true; showStop(i);
        if (flying) return;
        flight++; // a new turn replaces any turn still running
        if (reduce) { GL.center = STOPS[i].at; draw(performance.now()); } else turnTo(STOPS[i].at, 900);
      },
    };

    // drag to spin when the plane is not flying
    let drag: { x: number; y: number; c: LngLat } | null = null;
    const down = (e: PointerEvent) => { if (flying) return; drag = { x: e.clientX, y: e.clientY, c: GL.center.slice() as LngLat }; canvas.setPointerCapture(e.pointerId); canvas.classList.add("grabbing"); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const k = 180 / Math.PI / GL.R;
      GL.center = [drag.c[0] - (e.clientX - drag.x) * k, Math.max(-70, Math.min(70, drag.c[1] + (e.clientY - drag.y) * k))];
    };
    const endDrag = () => { drag = null; canvas.classList.remove("grabbing"); };
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", endDrag); canvas.addEventListener("pointercancel", endDrag);

    // draw only while the globe is on screen
    let raf = 0, on = false;
    const loop = (t: number) => { draw(t); raf = on ? requestAnimationFrame(loop) : 0; };
    readColors(); sizeGlobe(); land(0);
    if (reduce) finalState();
    const io = new IntersectionObserver((es) => {
      on = es[0].isIntersecting;
      if (on && !raf) raf = requestAnimationFrame(loop);
      if (on && !started && es[0].intersectionRatio > 0.4) { started = true; if (!reduce) fly(); }
    }, { threshold: [0, 0.45] });
    io.observe(wrap);
    draw(0);
    const resize = () => { sizeGlobe(); draw(performance.now()); };
    addEventListener("resize", resize);
    // the store updates before it toggles the .dark class, so read colours a frame later
    const unsub = useThemeStore.subscribe(() => requestAnimationFrame(() => { readColors(); draw(performance.now()); }));

    return () => {
      alive = false;
      cancelAnimationFrame(raf); io.disconnect(); unsub();
      removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", endDrag); canvas.removeEventListener("pointercancel", endDrag);
    };
  }, [reduce]);

  return (
    <div className="journey">
      <div className="globe-wrap" ref={wrapRef}>
        <canvas id="globe" ref={canvasRef} role="img" aria-label="A globe showing a flight from Sri Lanka to Singapore, then on to Auckland" />
        <div className="pins">
          {STOPS.map((st, i) => (
            <button key={st.name} ref={(el) => { pinRefs.current[i] = el; }} type="button" className={"pin" + (st.side ? " " + st.side : "")} aria-pressed={pressed === i} onClick={() => api.current?.pick(i)}>
              <b>{st.name}</b><span>{st.short}</span>
            </button>
          ))}
        </div>
      </div>
      <StoryPanel key={shown} i={shown} reduce={reduce} />
      <p className="sr-only" aria-live="polite">{`Chapter ${shown + 1}, ${STOPS[shown].name}: ${STOPS[shown].title}. ${STOPS[shown].story}`}</p>
      <button className="btn soft" type="button" id="fly" onClick={() => api.current?.fly()}>Fly it again</button>
    </div>
  );
}
