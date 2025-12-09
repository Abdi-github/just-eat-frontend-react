import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-secondary text-white"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">{t("footer.about")}</h3>
            <p className="text-sm text-gray-300">{t("footer.aboutText")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/restaurants" className="hover:text-primary">
                  {t("nav.restaurants")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/terms" className="hover:text-primary">
                  {t("nav.terms")}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  {t("nav.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t("footer.followUs")}
            </h3>
            <div className="flex gap-4 text-gray-300">
              <span className="cursor-pointer hover:text-primary">
                Facebook
              </span>
              <span className="cursor-pointer hover:text-primary">
                Instagram
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          {t("footer.copyright", { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
