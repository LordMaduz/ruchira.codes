import type { Stop } from "./types";

export const STOPS: Stop[] = [
  { at: [79.86, 6.93], name: "Sri Lanka", short: "growing up", side: "below", cmd: "git init",
    title: "The question",
    story: "I spent my childhood in front of video games, half playing and half wondering how anyone could make something like that. Anime filled in the rest. It taught me to keep going when every reason says stop, which turned out to be most of programming." },
  { at: [103.82, 1.35], name: "Singapore", short: "2022 to 2026", cmd: "git checkout -b new-zealand",
    title: "The night of too many tabs",
    story: "My wife got into university in Auckland. We started planning the move and were soon drowning in browser tabs that all said different things. I got frustrated enough to build the fix myself. LandedNZ came out of that night." },
  { at: [174.76, -36.85], name: "Auckland", short: "2026 to now", side: "left", cmd: "git merge new-zealand",
    title: "Landed",
    story: "We made it to Auckland in 2026. I'm still the kid asking how things are made. These days I get to answer that question for a living." }
];
export const OVERVIEW: [number, number] = [128, -12]; // a view that shows the whole route at once
