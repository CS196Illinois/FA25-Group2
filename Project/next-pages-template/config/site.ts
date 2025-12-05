export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Jeaks",
  description: "The UIUC Marketplace",
  navItems: [
    {
      label: "Marketplace",
      href: "/marketplace",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    docs: "https://heroui.com",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
