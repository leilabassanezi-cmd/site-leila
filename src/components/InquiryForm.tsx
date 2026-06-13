import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { trackLead } from "@/lib/tiktok";

const SERVICES = [
  { en: "Women’s Haircuts", es: "Cortes de Dama" },
  { en: "Brazilian Keratin Treatments", es: "Tratamientos de Queratina Brasileña" },
  { en: "Hair Botox Treatments", es: "Tratamientos de Botox Capilar" },
  { en: "Customized Hair Treatments", es: "Tratamientos Capilares Personalizados" },
  { en: "Deep Hydration & Repair", es: "Hidratación Profunda y Reparación" },
  { en: "Balayage & Highlights", es: "Balayage y Mechas" },
  { en: "Brunette Dimension (“Morena Iluminada”)", es: "Dimensión para Morenas (“Morena Iluminada”)" },
  { en: "Hair Coloring & Toners", es: "Coloración y Matizadores" },
  { en: "Blowouts & Styling", es: "Secado y Peinado" },
];

const WEB3FORMS_KEY = "f573a3b5-ab62-4fc9-af06-342056d7d765";

export function InquiryForm() {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitBlocked, setSubmitBlocked] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const lastSubmit = useRef<number>(0);

  const toggle = (s: string) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setErrors((e) => ({ ...e, services: "" }));
  };

  const blur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    validate(field);
  };

  const validate = (field?: string) => {
    const newErrors: Record<string, string> = { ...errors };
    const nameVal = name.trim();
    
    if (!field || field === "name") {
      if (!nameVal) newErrors.name = t("form_error_name");
      else if (nameVal.split(/\s+/).filter(Boolean).length < 2) newErrors.name = t("form_error_full_name");
      else newErrors.name = "";
    }
    
    if (!field || field === "phone") {
      const digits = phone.replace(/\D/g, "");
      if (!phone.trim() || digits.length < 7) newErrors.phone = t("form_error_phone");
      else newErrors.phone = "";
    }
    
    if (!field || field === "email") {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) newErrors.email = t("form_error_email");
      else newErrors.email = "";
    }
    
    if (!field || field === "services") {
      newErrors.services = selected.length === 0 ? t("form_error_services") : "";
    }
    
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const now = Date.now();
    if (now - lastSubmit.current < 30_000) {
      setSubmitBlocked(true);
      setTimeout(() => setSubmitBlocked(false), 3000);
      return;
    }

    setTouched({ name: true, phone: true, email: true, services: true });
    const valid = validate();
    if (!valid) return;

    lastSubmit.current = now;
    setSubmitStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New Inquiry — Alabama Brazilian Keratin",
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          services: selected.join(", ") || "—",
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        trackLead(email.trim(), phone.trim(), name.trim(), selected.join(", "));
        setName(""); setPhone(""); setEmail(""); setSelected([]);
        setTouched({});
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  const fieldClass = (field: string) =>
    `w-full bg-transparent border-b outline-none py-2 text-foreground placeholder:text-muted-foreground/50 transition-colors ${
      touched[field] && errors[field] ? "border-red-400 focus:border-red-400" : "border-border focus:border-primary"
    }`;

  return (
    <section id="inquiry" className="relative py-20 md:py-28 bg-onyx grain">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] uppercase tracking-[0.42em] text-primary">{t("form_eyebrow")}</span>
          <h2 className="mt-5 font-display text-4xl md:text-6xl leading-[0.95] tracking-tight">
            {t("form_title_1")} <span className="italic text-gold-gradient">{t("form_title_2")}</span>
          </h2>
          <p className="mt-5 text-muted-foreground font-light">
            {t("form_desc")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-primary/20 bg-background/40 backdrop-blur-sm p-8 md:p-10 space-y-6"
        >
          <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
            <input type="text" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-primary mb-2">
                {t("form_name")} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); if (touched.name) validate("name"); }}
                onBlur={() => blur("name")}
                className={fieldClass("name")}
                placeholder={t("form_placeholder_name")}
              />
              <AnimatePresence>
                {touched.name && errors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-[11px] text-red-400">
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-primary mb-2">
                {t("form_phone")} <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (touched.phone) validate("phone"); }}
                onBlur={() => blur("phone")}
                className={fieldClass("phone")}
                placeholder="+1 (___) ___-____"
              />
              <AnimatePresence>
                {touched.phone && errors.phone && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-[11px] text-red-400">
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-primary mb-2">
              {t("form_email")} <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (touched.email) validate("email"); }}
              onBlur={() => blur("email")}
              className={fieldClass("email")}
              placeholder="you@email.com"
            />
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-[11px] text-red-400">
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-primary mb-4">
              {t("form_services")} <span className="text-red-400">*</span>
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => {
                const label = s[lang];
                const active = selected.includes(label);
                return (
                  <label
                    key={label}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(label)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                );
              })}
            </div>
            <AnimatePresence>
              {touched.services && errors.services && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 text-[11px] text-red-400">
                  {errors.services}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {submitBlocked && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-[11px] text-amber-400">
                {t("form_wait")}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitStatus === "success" && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center text-[12px] text-emerald-400">
                ✓ Message sent! We'll be in touch soon.
              </motion.p>
            )}
            {submitStatus === "error" && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center text-[12px] text-red-400">
                Something went wrong. Please try again or contact us directly.
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitStatus === "sending"}
            className="w-full inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[image:var(--gradient-gold)] text-primary-foreground text-[11px] uppercase tracking-[0.32em] glow-on-hover font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitStatus === "sending" ? "Sending…" : <>{t("form_submit")} <span aria-hidden>→</span></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
