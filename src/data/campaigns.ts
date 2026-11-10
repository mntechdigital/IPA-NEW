import { CampaignItem } from '@/types';

export const CAMPAIGNS: CampaignItem[] = [
  {
    id: "camp-01",
    slug: "think-before-you-share",
    title: "Think Before You Share",
    tagline: "Pause, Verify, Protect: Cultivating Digital Discretion in an Era of Viral Rumors",
    status: "Active Campaign",
    coverImage: "/images/campaign_media_literacy.jpg",
    introduction: "In rapid digital communication networks, an unverified rumor can trigger community panic within minutes. The 'Think Before You Share' campaign asks citizens to adopt a 30-second verification routine before forwarding sensationalist claims or emotive multimedia clips.",
    whyItMatters: "Misinformation is not merely an intellectual debate; it has direct human consequences, from public health disinformation during seasonal dengue outbreaks to manufactured communal tension sparked by doctored audio clips. By transforming each individual into a conscientious gatekeeper, we strengthen the collective defense of our civic spaces.",
    objectives: [
      "Distribute 50,000 physical and digital verification pocket guides across university campuses, community centers, and cybercafes.",
      "Achieve over 1.2 million direct views of bite-sized video explainers teaching citizens how to identify manipulated imagery.",
      "Engage 500 community influencers, teachers, and student leaders as certified digital verification ambassadors."
    ],
    coreActions: [
      "Check the Primary Source: Always search for corroborating reports on recognized journalistic mastheads before sharing.",
      "Inspect the Date & Context: Confirm that a dramatic event image isn't an out-of-context photograph from years prior.",
      "Beware Emotive Clickbait: If a post provokes intense immediate outrage or panic, pause and recognize the manipulation tactic.",
      "Request Verification from Senders: Politely reply with 'Where did you verify this?' whenever friends forward dubious claims."
    ],
    partnerNetworks: [
      "National University Journalists' Association (NUJA)",
      "Civic Fact-Checking Forum",
      "Dhaka Community Library Network",
      "Bangladesh Youth Environmental Coalition"
    ],
    resources: [
      { title: "Pocket Guide to Digital Verification (Bengali & English)", type: "PDF Guide", size: "1.4 MB" },
      { title: "Campus Verification Workshop Slide Deck", type: "Presentation", size: "8.2 MB" },
      { title: "Social Media Campaign Visual Asset Kit", type: "ZIP Archive", size: "14.5 MB" }
    ]
  },
  {
    id: "camp-02",
    slug: "voices-for-informed-communities",
    title: "Voices for Informed Communities",
    tagline: "Empowering Local Voices to Demand Transparency and Ethical Local Governance",
    status: "Active Campaign",
    coverImage: "/images/community_dialogue_civic.jpg",
    introduction: "True democracy begins at the grassroots. 'Voices for Informed Communities' supports citizen-led monitoring groups that track municipal public budgets, healthcare service quality, and local school infrastructure using Right to Information provisions.",
    whyItMatters: "National policy debates often neglect the immediate day-to-day realities of citizens living outside capital metropolises. When community members are armed with public records and investigative techniques, they hold local administrative bodies accountable with constructive evidence rather than partisan rhetoric.",
    objectives: [
      "Establish active Community Oversight Circles in 30 upazilas across four divisions.",
      "File and follow up on 500 public interest Right to Information (RTI) petitions on local water, sanitation, and health projects.",
      "Publish quarterly Citizen Accountability Bulletins distributed to local community newspapers and district administrators."
    ],
    coreActions: [
      "File Right to Information requests regarding stalled local municipal infrastructure projects.",
      "Form community listening circles to document local residents' experiences with public healthcare facilities.",
      "Participate actively in annual municipal budget consultations.",
      "Collaborate with regional investigative journalists to amplify findings of bureaucratic negligence."
    ],
    partnerNetworks: [
      "Grassroots Transparency Forum",
      "District Press Club Alliance",
      "Community Legal Aid Coalition",
      "Federation of Regional Civic Societies"
    ],
    resources: [
      { title: "Citizen RTI Toolkit: How to Request Municipal Documents", type: "PDF Manual", size: "2.1 MB" },
      { title: "Community Scorecard Template for Healthcare Facilities", type: "Spreadsheet & PDF", size: "950 KB" },
      { title: "Guide to Organizing Neighborhood Deliberative Assemblies", type: "PDF Guide", size: "1.8 MB" }
    ]
  },
  {
    id: "camp-03",
    slug: "media-literacy-next-generation",
    title: "Media Literacy for the Next Generation",
    tagline: "Equipping Young Minds with Critical Thinking to Navigate the Modern Media Jungle",
    status: "Active Campaign",
    coverImage: "/images/hero_public_dialogue.jpg",
    introduction: "Children and teenagers are growing up as digital natives, yet few receive formal instruction in recognizing algorithmic bias, deceptive advertising, and automated bot networks. This campaign advocates for comprehensive media literacy in school curriculums.",
    whyItMatters: "Young minds cannot develop democratic discernment if they lack the ability to distinguish authentic investigative journalism from commercial native advertorials and coordinated propaganda campaigns.",
    objectives: [
      "Train 1,000 secondary school educators across Bangladesh in media discernment pedagogical methods.",
      "Introduce 12-week extracurricular Media & Civic Discovery clubs in 100 secondary schools.",
      "Publish a comprehensive National Curriculum Recommendations White Paper submitted to the Ministry of Education."
    ],
    coreActions: [
      "Advocate with local school management committees to host media literacy workshops.",
      "Facilitate classroom newsroom simulations where students act as fact-checking editors.",
      "Encourage students to create analytical school newspapers covering local community issues.",
      "Engage parents in digital safety and balanced information consumption seminars."
    ],
    partnerNetworks: [
      "National Teachers' Association for Democratic Education",
      "Child & Youth Development Forum",
      "Association of University Media Educators",
      "Federation of Secondary Headmasters"
    ],
    resources: [
      { title: "Secondary School Media Literacy Syllabus: 12-Week Curriculum", type: "PDF Whitepaper", size: "3.4 MB" },
      { title: "Classroom Fact-Checking Game & Exercise Cards", type: "PDF Printable", size: "4.8 MB" },
      { title: "Parenting in the Digital Information Age Handbook", type: "PDF Guide", size: "1.2 MB" }
    ]
  }
];
