import { api } from "@/lib/api";

export type CmsContent = {
  home_badge_text: string;
  home_title: string;
  home_subtitle: string;
  home_primary_cta_text: string;
  home_primary_cta_link: string;
  home_secondary_cta_text: string;
  home_secondary_cta_link: string;
  home_stat_members: string;
  home_stat_events: string;
  home_stat_partners: string;

  about_hero_title: string;
  about_hero_description: string;
  about_mission_heading: string;
  about_mission_body: string;

  announcement_enabled: boolean;
  announcement_title: string;
  announcement_body: string;
  announcement_speaker: string;
  announcement_join_link: string;
  announcement_date: string;
  announcement_time: string;
  announcement_mode: string;

  navbar_links_json: string;
  footer_quick_links_json: string;
  footer_involved_links_json: string;
  social_links_json: string;

  logo_nav_url: string;
  logo_footer_url: string;
  logo_partner_url: string;
  footer_brand_text: string;

  events_json: string;
};

export const defaultCmsContent: CmsContent = {
  home_badge_text: "Welcome to the Future of Tech",
  home_title: "The X-Ops Club",
  home_subtitle:
    "Empowering the next generation of tech innovators through workshops, hackathons, and a vibrant community of passionate developers.",
  home_primary_cta_text: "Join X-Ops Today",
  home_primary_cta_link: "/signup",
  home_secondary_cta_text: "Explore Events",
  home_secondary_cta_link: "/events",
  home_stat_members: "30+",
  home_stat_events: "1+",
  home_stat_partners: "3+",
  about_hero_title: "About X-Ops",
  about_hero_description:
    "X-Ops Club is a student-led community dedicated to advancing DevOps, AI, and automation through hands-on learning.",
  about_mission_heading: "Our Mission",
  about_mission_body:
    "We empower the next generation of tech innovators through workshops, hackathons, mentorship, and community collaboration.",
  announcement_enabled: true,
  announcement_title: "GET FREE ORACLE & MICROSOFT CERTIFICATIONS!",
  announcement_body: "A FREE E-Certificate of Participation will be provided to all attendees.",
  announcement_speaker: "Dr. Rajesh Bingu Ph.D.",
  announcement_join_link: "https://meet.google.com/bvp-cytn-iwj",
  announcement_date: "17-10-2025 (Friday)",
  announcement_time: "07.00 PM",
  announcement_mode: "Online (Google Meet)",
  navbar_links_json: JSON.stringify([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
  ]),
  footer_quick_links_json: JSON.stringify([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
  ]),
  footer_involved_links_json: JSON.stringify([
    { name: "Join Us", path: "/signup" },
    { name: "Upcoming Events", path: "/events" },
    { name: "Contact", path: "/about" },
  ]),
  social_links_json: JSON.stringify([
    { label: "LinkedIn", href: "https://www.linkedin.com/in/xops-club-ju-fet/" },
    { label: "Instagram", href: "https://www.instagram.com/xops.club_ju/" },
    { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=xopsclub.cse.ju@gmail.com" },
  ]),
  logo_nav_url: "/favicon.ico",
  logo_footer_url: "/X-Ops Club logo design.png",
  logo_partner_url: "/jain logo main.png",
  footer_brand_text:
    "Empowering the next generation of tech innovators through workshops, hackathons, and a vibrant community of passionate developers.",
  events_json: JSON.stringify([
    {
      id: "event-1",
      title: "AI/ML Workshop",
      description: "Hands-on workshop on practical AI workflows.",
      date: "Feb 15, 2026",
      time: "10:00 AM",
      location: "Virtual",
      type: "workshop",
      attendees: 40,
      maxAttendees: 120,
      image: "🤖",
      featured: true,
      joinLink: "",
      registrationClosed: false,
    },
    {
      id: "event-2",
      title: "Spring Hackathon",
      description: "Build and demo projects with your team.",
      date: "Mar 1-2, 2026",
      time: "09:00 AM",
      location: "Campus",
      type: "hackathon",
      attendees: 90,
      maxAttendees: 120,
      image: "🏆",
      featured: true,
      joinLink: "",
      registrationClosed: false,
    },
  ]),
};

type CmsResponse = {
  content: CmsContent;
};

type CmsSaveResponse = CmsResponse & {
  message: string;
};

export const fetchPublicCmsContent = async () => {
  const response = await api.get<CmsResponse>("/api/content/public");
  return response.content;
};

export const fetchAdminCmsContent = async () => {
  const response = await api.get<CmsResponse>("/api/admin/content");
  return response.content;
};

export const updateAdminCmsContent = async (content: CmsContent) => {
  const response = await api.put<CmsSaveResponse>("/api/admin/content", { content });
  return response;
};
