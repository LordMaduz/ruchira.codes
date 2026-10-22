import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Add your name to send."),
  email: z.string().trim().email("Add a valid email so I can reply."),
  message: z.string().trim().min(1, "Add your message to send."),
});
export type ContactForm = z.infer<typeof contactSchema>;

const nzFmt = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", weekday: "long", hour: "numeric", minute: "2-digit" });

// Auckland time, so people in other time zones know when I'm around
export function nzTimeLabel(d: Date) {
  const x = Object.fromEntries(nzFmt.formatToParts(d).map((p) => [p.type, p.value]));
  return `It's ${x.hour}:${x.minute} ${x.dayPeriod} on ${x.weekday} in Auckland`;
}
