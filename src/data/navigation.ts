export interface NavLink {
  label: string;
  href: string;
  description?: string;
  children?: {
    label: string;
    href: string;
    description: string;
  }[];
}

export const MAIN_NAVIGATION: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About IPA", href: "/about" },
  {
    label: "Research & Publications",
    href: "/research",
    children: [
      { label: "All Research & Publications", href: "/research", description: "Searchable repository of reports, policy briefs, and working papers." },
      { label: "Media Research", href: "/research?category=Media+Research", description: "Studies on newsroom practices, trust, and media independence." },
      { label: "Digital Information Ecosystems", href: "/research?category=Digital+Media", description: "Algorithmic impact, verification, and digital platforms." },
      { label: "Governance & Accountability", href: "/research?category=Governance", description: "Right to Information, public records, and institutional integrity." },
      { label: "Public Affairs & Civic Action", href: "/research?category=Public+Affairs", description: "Citizen participation, youth mobilization, and policy dialogues." }
    ]
  },
  {
    label: "Programs & Initiatives",
    href: "/programs",
    children: [
      { label: "All Programs", href: "/programs", description: "Institutional initiatives bridging research and public action." },
      { label: "Media Literacy & Public Awareness", href: "/programs/media-literacy-public-awareness", description: "Nationwide training in digital verification and critical inquiry." },
      { label: "Community Dialogue Initiative", href: "/programs/community-dialogue-initiative", description: "Town halls bringing citizens and municipal administrators together." },
      { label: "Youth & Public Affairs Engagement", href: "/programs/youth-public-affairs-engagement", description: "Fellowships and mentorship for emerging investigative analysts." },
      { label: "Research & Policy Discussion Forum", href: "/programs/research-policy-discussion-forum", description: "National symposiums translating research into statutory reform." }
    ]
  },
  { label: "Campaigns", href: "/campaigns" },
  { label: "News & Media", href: "/news" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" }
];

export const FOOTER_LINKS = {
  about: [
    { label: "About the Institute", href: "/about" },
    { label: "Mission & Core Values", href: "/about#mission" },
    { label: "Leadership & Research Fellows", href: "/about#team" },
    { label: "Methodological Standards", href: "/about#approach" },
    { label: "Institutional Milestones", href: "/about#history" }
  ],
  research: [
    { label: "Research Reports", href: "/research?type=Research+Report" },
    { label: "Policy Briefs", href: "/research?type=Policy+Brief" },
    { label: "Discussion Papers", href: "/research?type=Discussion+Paper" },
    { label: "Working Papers", href: "/research?type=Working+Paper" },
    { label: "Open Datasets & Codebooks", href: "/resources" }
  ],
  programs: [
    { label: "Media Literacy Initiative", href: "/programs/media-literacy-public-awareness" },
    { label: "Community Dialogue Forums", href: "/programs/community-dialogue-initiative" },
    { label: "Youth Research Fellowships", href: "/programs/youth-public-affairs-engagement" },
    { label: "Policy Deliberation Forum", href: "/programs/research-policy-discussion-forum" },
    { label: "Active Advocacy Campaigns", href: "/campaigns" }
  ],
  public: [
    { label: "Newsroom & Press Releases", href: "/news" },
    { label: "Upcoming Events & Roundtables", href: "/news?category=Events" },
    { label: "Public Knowledge Repository", href: "/resources" },
    { label: "Get Involved & Participate", href: "/contact?intent=participate" },
    { label: "Institutional Inquiries", href: "/contact" }
  ]
};
