import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { trackContact } from "@/lib/tiktok";

export function BookingCTA() {
  const { t } = useI18n();
  return (
    <section id="book" className="relative py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-gold)] opacity-[0.06]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <span className="text-[10px] uppercase tracking-[0.42em] text-primary">{t("book_eyebrow")}</span>
        <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
          {t("book_title_1")} <span className="italic text-gold-gradient">{t("book_title_2")}</span>.
        </h2>
        <p className="mt-8 text-muted-foreground font-light max-w-xl mx-auto">
          {t("book_desc")}
        </p>

        <div id="contact" className="mt-12 flex flex-wrap justify-center gap-5">
          <a
            href="https://wa.me/12059831715?text=Hello%2C%20I%20came%20from%20the%20website%20and%20I%20want%20more%20information."
            target="_blank"
            rel="noreferrer"
            onClick={() => trackContact("WhatsApp")}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[image:var(--gradient-gold)] text-primary-foreground text-[11px] uppercase tracking-[0.32em] glow-on-hover font-medium"
          >
            {t("book_whatsapp")}
          </a>
          <a
            href="tel:+12059831715"
            onClick={() => trackContact("Phone")}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full border border-primary/50 text-primary hover:bg-primary/10 text-[11px] uppercase tracking-[0.32em] transition-colors"
          >
            +1 (205) 983-1715
          </a>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-8 text-left max-w-3xl mx-auto pt-12 border-t border-border">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-primary mb-2">{t("book_studio")}</div>
            <div className="text-sm text-foreground/85">Randolph,<br />Alabama</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-primary mb-2">{t("book_hours")}</div>
            <div className="text-sm text-foreground/85 whitespace-pre-line">{t("book_hours_val")}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-primary mb-2">{t("book_email")}</div>
            <div className="text-sm text-foreground/85">alabamabraziliankeratinexpert@gmail.com</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
