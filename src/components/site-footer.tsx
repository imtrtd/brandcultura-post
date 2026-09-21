import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-yellow/20 bg-ink/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
        <div>
          <SiteLogo className="items-start px-0" />
          <p className="mt-3 text-sm text-muted">
            Tattoo artist
            <br />
            Nuremberg · Kyiv
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-display text-xs uppercase tracking-[0.18em] text-yellow">
            {t("footer.explore")}
          </span>
          <Link to="/" className="text-fg/80 no-underline hover:text-yellow">
            {t("nav.site")}
          </Link>
          <Link to="/designs" className="text-fg/80 no-underline hover:text-yellow">
            {t("nav.designs")}
          </Link>
          <Link to="/lettering" className="text-fg/80 no-underline hover:text-yellow">
            {t("labs.lettering")}
          </Link>
          <Link to="/event" className="text-fg/80 no-underline hover:text-yellow">
            Blackout Yard
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-display text-xs uppercase tracking-[0.18em] text-yellow">
            {t("footer.connect")}
          </span>
          <Link to="/book" className="text-fg/80 no-underline hover:text-yellow">
            {t("nav.book")}
          </Link>
          <a
            href={SITE.tg}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg/80 no-underline hover:text-yellow"
          >
            Telegram {SITE.tgHandle}
          </a>
          <a
            href={SITE.ig}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg/80 no-underline hover:text-yellow"
          >
            Instagram {SITE.igHandle}
          </a>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <Link to="/terms" className="no-underline hover:text-yellow">
              {t("footer.terms")}
            </Link>
            <Link to="/privacy" className="no-underline hover:text-yellow">
              {t("footer.privacy")}
            </Link>
            <Link to="/aftercare" className="no-underline hover:text-yellow">
              {t("footer.aftercare")}
            </Link>
            <Link to="/hygiene" className="no-underline hover:text-yellow">
              {t("footer.hygiene")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-yellow/15 px-5 py-4 text-center text-[0.68rem] uppercase tracking-[0.18em] text-muted">
        © 2026 NAMENLOS TATTOO · VIKTORIIA
      </div>
    </footer>
  );
}
