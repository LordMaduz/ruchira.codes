import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, nzTimeLabel, type ContactForm } from "@/lib/contact";

export default function ContactSection() {
  const [now, setNow] = useState(() => nzTimeLabel(new Date()));
  const [sent, setSent] = useState<{ first: string; email: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const sentRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, setFocus, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const t = setInterval(() => setNow(nzTimeLabel(new Date())), 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (sent) sentRef.current?.focus(); }, [sent]);

  const onSubmit = async (data: ContactForm) => {
    setFailed(false);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: data.name,
          email: data.email,
          subject: `New message from ${data.name}`,
          message: data.message,
          from_name: "Portfolio Contact Form",
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error("Form submission failed");
      setSent({ first: data.name.split(/\s+/)[0], email: data.email });
    } catch {
      setFailed(true); // keep what they typed so they can try again
    }
  };

  const again = () => { reset(); setSent(null); setTimeout(() => setFocus("name")); };

  const field = (name: keyof ContactForm) => ({
    ...register(name),
    id: `c-${name}`,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `c-${name}-err` : undefined,
  });
  const err = (name: keyof ContactForm) => errors[name] && <p className="err" id={`c-${name}-err`}>{errors[name]!.message}</p>;

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="sec-h"><h2>Get in touch</h2><p>Have a role in mind, or a question about my work? Book a time or send me a message.</p></div>
        <div className="bookline">
          <div><b>Book a 20-minute chat</b><span className="clock"><i />{now}</span></div>
          <a className="btn solid" href="https://cal.com/ruchira-rajapaksha" target="_blank" rel="noopener noreferrer">Open my calendar</a>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* the thank-you panel covers the fields, so take them out of the tab order */}
          <div className="fields" inert={!!sent}>
          <div className="row2">
            <div><label htmlFor="c-name">Name</label><input {...field("name")} autoComplete="name" placeholder="Jane Smith" />{err("name")}</div>
            <div><label htmlFor="c-email">Email</label><input {...field("email")} type="email" autoComplete="email" spellCheck={false} placeholder="jane@company.co.nz" />{err("email")}</div>
          </div>
          <div><label htmlFor="c-message">Message</label><textarea {...field("message")} rows={4} placeholder="Tell me about the role or the project" />{err("message")}</div>
          {failed && <p className="err" role="alert">That didn't send. Try again, or message me on LinkedIn.</p>}
          <button className="btn solid send" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</button>
          </div>
          {sent && (
            <div className="sent" tabIndex={-1} role="status" ref={sentRef}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m8 12.5 2.8 2.8L16.5 9" /></svg>
              <h3>Thanks, {sent.first}</h3>
              <p>Your message is with me. I'll reply to <b>{sent.email}</b>.</p>
              <button className="btn soft" type="button" onClick={again}>Send another</button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
