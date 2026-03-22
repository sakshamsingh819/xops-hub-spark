import { Link } from "react-router-dom";
import { Linkedin, Mail, Instagram } from "lucide-react";
import { defaultCmsContent } from "@/lib/cms";
import { useCmsContent } from "@/hooks/useCmsContent";

const defaultQuickLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "About", path: "/about" },
];

const defaultInvolvedLinks = [
  { name: "Join Us", path: "/signup" },
  { name: "Upcoming Events", path: "/events" },
  { name: "Contact", path: "/about" },
];

const defaultSocialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/xops-club-ju-fet/" },
  { label: "Instagram", href: "https://www.instagram.com/xops.club_ju/" },
  { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=xopsclub.cse.ju@gmail.com" },
];

const parseJsonArray = <T,>(value: string, fallback: T[]): T[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const Footer = () => {
  const content = useCmsContent();
  const quickLinks = parseJsonArray(content.footer_quick_links_json, defaultQuickLinks);
  const involvedLinks = parseJsonArray(content.footer_involved_links_json, defaultInvolvedLinks);
  const socialLinks = parseJsonArray(content.social_links_json, defaultSocialLinks);

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <div className="rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center" style={{ width: 48, height: 48 }}>
                <img src={content.logo_footer_url || defaultCmsContent.logo_footer_url} alt="X-Ops Club Logo" className="w-12 h-12 object-contain m-0" />
              </div>
              <span className="text-gradient">X-Ops</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              {content.footer_brand_text}
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  {social.label === "LinkedIn" && <Linkedin className="h-5 w-5" />}
                  {social.label === "Instagram" && <Instagram className="h-5 w-5" />}
                  {social.label === "Email" && <Mail className="h-5 w-5" />}
                </a>
              ))}
            </div>
            <div className="mt-4">
              <img src={content.logo_partner_url || defaultCmsContent.logo_partner_url} alt="Jain FET Logo" className="h-24 w-auto object-contain brightness-0 invert opacity-90" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Get Involved</h3>
            <ul className="space-y-3">
              {involvedLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} X-Ops Tech Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
