import { ResearchItem } from '@/types';

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: "res-01",
    slug: "media-landscape-public-trust-bangladesh",
    title: "Media Landscape and Public Trust in Bangladesh: An Empirical Investigation",
    category: "Media Research",
    type: "Research Report",
    date: "October 24, 2026",
    year: 2026,
    featured: true,
    pages: 68,
    fileSize: "4.2 MB",
    doi: "10.5281/ipa.res.2026.014",
    coverImage: "/images/research_media_analysis.jpg",
    authors: [
      { name: "Dr. Nazmul Huq", role: "Senior Fellow in Media Studies", affiliation: "IPA Research Directorate" },
      { name: "Syeda Tahmina Akhter", role: "Principal Researcher", affiliation: "IPA Governance Unit" }
    ],
    abstract: "This landmark investigation evaluates shifting patterns of public trust in national broadcast, print, and digital journalism across urban and semi-urban populations in Bangladesh. Drawing upon a stratified national sample of 2,400 respondents and 32 in-depth key informant interviews with veteran journalists, the report maps editorial independence, perceived partisan bias, and audience migration toward decentralised digital news portals.",
    keyFindings: [
      "Over 64% of surveyed citizens cite independent digital investigative outlets as their primary source of non-censored public interest reporting.",
      "Television remains the dominant medium for immediate news breaking, yet scored lowest on institutional trust due to perceived commercial pressures.",
      "78% of young readers aged 18–29 express high concern regarding unverified viral social media aggregators mimicking traditional mastheads.",
      "Newsroom editorial autonomy is severely challenged by concentrated media ownership and non-transparent advertiser revenue models."
    ],
    content: {
      executiveSummary: "The media landscape in Bangladesh is experiencing rapid structural transformation characterized by shrinking print circulations, growing digital news consumption, and escalating regulatory pressures. This research paper evaluates how these market forces alter civic trust and public perception of journalistic credibility.",
      methodology: "A mixed-methods empirical design was executed between February and August 2026. A randomized stratified survey across seven administrative divisions sampled 2,400 adult citizens. Qualitative focus group discussions were conducted in Dhaka, Chattogram, Rajshahi, and Khulna, triangulated with content analysis of 12,000 news articles.",
      discussion: "Findings reveal an acute credibility paradox: while access to digital information has expanded exponentially, citizen confidence in mainstream editorial gatekeeping has stagnated. Audiences demonstrate sophisticated media literacy yet express frustration with sanitized coverage of municipal governance and public expenditure.",
      recommendations: [
        "Institutionalize independent news ombudsman bodies across national press houses.",
        "Implement mandatory algorithmic transparency for domestic social aggregator platforms.",
        "Establish community-subsidized public interest journalism trusts funded by civic foundations.",
        "Expand digital verification curriculum in secondary and higher educational curricula."
      ]
    }
  },
  {
    id: "res-02",
    slug: "digital-information-ecosystems-social-awareness",
    title: "Digital Information Ecosystems and Social Awareness: Algorithmic Amplification of Civic Issues",
    category: "Digital Media",
    type: "Policy Brief",
    date: "September 12, 2026",
    year: 2026,
    featured: true,
    pages: 32,
    fileSize: "2.1 MB",
    doi: "10.5281/ipa.res.2026.012",
    coverImage: "/images/campaign_media_literacy.jpg",
    authors: [
      { name: "Farhan Masud", role: "Lead Policy Analyst", affiliation: "IPA Digital Rights Initiative" }
    ],
    abstract: "A comprehensive policy brief exploring how algorithmic curation on consumer messaging apps and video platforms shapes civic literacy, civic organizing, and viral falsehoods. The brief outlines actionable policy recommendations for digital platform governance and community verification frameworks.",
    keyFindings: [
      "Short-form algorithmic video feeds account for 58% of first-contact news exposure among suburban youths.",
      "Sensationalist framing produces 3.4 times higher engagement velocity compared to verified analytical fact-checks.",
      "Civil society organizations lack standardized protocols for countering coordinated digital astroturfing campaigns."
    ],
    content: {
      executiveSummary: "Algorithmic distribution mechanisms prioritize emotive polarization over nuanced civic dialogue. This brief assesses the consequences for citizen awareness and presents structural interventions for civic actors and regulatory bodies.",
      methodology: "Computational tracking of 180 trending public affairs topics over a 90-day cycle, cross-referenced with ethnographic observations in 6 university digital media clubs.",
      discussion: "The study highlights that without algorithmic transparency and localized verification networks, civic discourse is disproportionately dictated by opaque engagement metrics rather than public urgency.",
      recommendations: [
        "Enact clear legislative definitions for digital political advertising disclosures.",
        "Support local fact-checking consortia with independent technological infrastructure.",
        "Require platform providers to provide vetted researcher access to viral dissemination telemetry."
      ]
    }
  },
  {
    id: "res-03",
    slug: "public-perception-media-accountability",
    title: "Public Perception of Media Accountability: Governance Standards and Editorial Independence",
    category: "Governance",
    type: "Discussion Paper",
    date: "August 18, 2026",
    year: 2026,
    featured: true,
    pages: 44,
    fileSize: "2.8 MB",
    doi: "10.5281/ipa.res.2026.009",
    coverImage: "/images/hero_public_dialogue.jpg",
    authors: [
      { name: "Dr. Ananya Sen", role: "Visiting Fellow", affiliation: "Centre for Democratic Governance" },
      { name: "Rafiqul Islam", role: "Research Associate", affiliation: "IPA Public Affairs Cell" }
    ],
    abstract: "Examines citizen attitudes toward self-regulatory journalistic mechanisms versus statutory oversight bodies. Based on nationwide citizen focus groups, this paper provides a roadmap for rebuilding public confidence through transparent correction protocols and ethical guidelines.",
    keyFindings: [
      "82% of respondents believe newsrooms must publicly archive and annotate retractations and factual corrections.",
      "Over two-thirds of readers favor independent press councils over direct administrative government regulation.",
      "Anonymous sourcing in coverage of judicial matters was singled out by civic groups as a key driver of public cynicism."
    ],
    content: {
      executiveSummary: "Accountability is the bedrock of free expression. When news organizations fail to answer for inaccuracies or conflicts of interest, public cynicism fosters demand for authoritarian censorship mechanisms.",
      methodology: "Deliberative polling sessions with 400 civic participants, combined with comparative legal review of media council charters across South Asia and Europe.",
      discussion: "Citizens demonstrate an urgent appetite for ethical accountability, prioritizing voluntary disclosures of ownership interests and published editorial charters.",
      recommendations: [
        "Mandate open publication of media ownership registries and annual conflict-of-interest declarations.",
        "Standardize prominent correction notices across print and digital news sites.",
        "Establish an annual public hearing on press freedom and journalistic accountability."
      ]
    }
  },
  {
    id: "res-04",
    slug: "youth-engagement-in-public-affairs",
    title: "Youth Engagement in Public Affairs: Participatory Channels, Civic Identity & Digital Mobilization",
    category: "Public Affairs",
    type: "Research Report",
    date: "July 04, 2026",
    year: 2026,
    featured: true,
    pages: 56,
    fileSize: "3.5 MB",
    doi: "10.5281/ipa.res.2026.007",
    coverImage: "/images/community_dialogue_civic.jpg",
    authors: [
      { name: "Tahsin Rahman", role: "Coordinator, Youth Public Affairs Forum", affiliation: "IPA Engagement Desk" },
      { name: "Dr. Nazmul Huq", role: "Senior Fellow in Media Studies", affiliation: "IPA Research Directorate" }
    ],
    abstract: "Investigating how university students, youth volunteers, and young professionals perceive traditional civic participation channels versus informal digital advocacy coalitions. The report emphasizes the emergence of hyper-local civic watchdogs.",
    keyFindings: [
      "Young citizens are 2.5x more likely to organize civic dialogues on neighborhood environmental and transportation issues than national party politics.",
      "Social media remains the primary organizing tool, yet in-person civic roundtables are viewed as far more effective for sustained policy dialogue.",
      "A significant gap remains between youth-led civic recommendations and formal parliamentary consultation procedures."
    ],
    content: {
      executiveSummary: "Youth in South Asia are reshaping what public engagement looks like. Rejecting tokenistic consultative bodies, youth groups are spearheading grassroots civic accountability campaigns.",
      methodology: "Survey of 1,800 youth aged 18–28 across 14 public and private universities, supplemented by 18 participatory youth action workshops.",
      discussion: "The study articulates how digital platforms serve as catalysts for civic awareness, but emphasize that policy impact requires institutionalized channels into municipal and national decision-making bodies.",
      recommendations: [
        "Introduce youth consultative councils within municipal city corporations.",
        "Fund civic research incubators that assist youth advocates with data analysis and evidence synthesis.",
        "Ensure open access to municipal budget and procurement records."
      ]
    }
  },
  {
    id: "res-05",
    slug: "local-governance-information-accessibility",
    title: "Local Governance and Information Accessibility: Citizens' Right to Public Records",
    category: "Governance",
    type: "Working Paper",
    date: "May 29, 2026",
    year: 2026,
    pages: 40,
    fileSize: "2.3 MB",
    doi: "10.5281/ipa.res.2026.005",
    coverImage: "/images/about_institute_symposium.jpg",
    authors: [
      { name: "Syeda Tahmina Akhter", role: "Principal Researcher", affiliation: "IPA Governance Unit" }
    ],
    abstract: "Audits the implementation of Right to Information (RTI) mechanisms across 45 municipal and district administrations. Evaluates response compliance rates, bureaucratic bottlenecks, and citizen literacy regarding RTI procedures.",
    keyFindings: [
      "Only 38% of submitted information requests received formal written responses within statutory timelines.",
      "Lack of digitized archival records constitutes the primary obstacle cited by designated public information officers.",
      "Proactive disclosure on municipal websites remains below 25% of mandated public transparency guidelines."
    ],
    content: {
      executiveSummary: "Transparency in local governance directly dictates whether public funds translate into effective community development. This working paper measures compliance rates and identifies practical capacity constraints.",
      methodology: "Field audits of 120 RTI applications filed across 45 local administrative offices, alongside structured interviews with 50 designated public information officers.",
      discussion: "Significant legal protections exist on paper, but administrative inertia and fear of administrative exposure impede proactive disclosure. Modernizing digital record-keeping is an indispensable prerequisite.",
      recommendations: [
        "Implement unified municipal RTI digital portals with automated tracking and public logbooks.",
        "Conduct mandatory annual training for designated local information officers.",
        "Publish monthly RTI fulfillment scorecards for all regional government directories."
      ]
    }
  },
  {
    id: "res-06",
    slug: "climate-reporting-public-awareness-coastal-districts",
    title: "Climate Reporting and Public Awareness: Media Narrative Deficits in Vulnerable Coastal Districts",
    category: "Social Development",
    type: "Research Report",
    date: "April 14, 2026",
    year: 2026,
    pages: 52,
    fileSize: "3.8 MB",
    doi: "10.5281/ipa.res.2026.004",
    coverImage: "/images/community_dialogue_civic.jpg",
    authors: [
      { name: "Dr. Ananya Sen", role: "Visiting Fellow", affiliation: "Centre for Democratic Governance" },
      { name: "Farhan Masud", role: "Lead Policy Analyst", affiliation: "IPA Digital Rights Initiative" }
    ],
    abstract: "An exhaustive content analysis of climate crisis reporting across national print, television, and regional radio. Evaluates whether media coverage captures community resilience, disaster preparedness, and adaptation governance rather than solely focusing on post-calamity victimhood.",
    keyFindings: [
      "Less than 7% of environmental news stories explore adaptive policy solutions and local governance resilience initiatives.",
      "Over 85% of environmental reporting surges strictly during acute cyclone and flood occurrences, disappearing within 10 days post-calamity.",
      "Grassroots community knowledge is rarely cited by national correspondents, who lean heavily on centralized Dhaka-based spokespersons."
    ],
    content: {
      executiveSummary: "Bangladesh is on the frontlines of global climate vulnerability. However, the domestic media narrative remains reactive, sensationalized, and severed from long-term social adaptation strategies.",
      methodology: "Analysis of 4,500 news reports across 16 major daily publications and 8 broadcast channels over a 12-month period, supplemented by 40 coastal community listening circles.",
      discussion: "Reporting must shift from catastrophic event spectacle to sustained investigative tracking of climate adaptation budgets, embankment infrastructure resilience, and community migration rights.",
      recommendations: [
        "Fund continuous coastal journalistic fellowships embedded within vulnerable union parishads.",
        "Establish an open environmental data repository connecting meteorologists, scientists, and newsrooms.",
        "Encourage localized radio syndication for community disaster preparedness protocols."
      ]
    }
  },
  {
    id: "res-07",
    slug: "civic-misinformation-verification-protocols",
    title: "Civic Misinformation and Fact-Checking Efficacy: Measuring Public Correction Acceptance",
    category: "Public Awareness",
    type: "Policy Brief",
    date: "March 02, 2026",
    year: 2026,
    pages: 28,
    fileSize: "1.9 MB",
    doi: "10.5281/ipa.res.2026.002",
    coverImage: "/images/campaign_media_literacy.jpg",
    authors: [
      { name: "Tahsin Rahman", role: "Coordinator, Youth Public Affairs Forum", affiliation: "IPA Engagement Desk" }
    ],
    abstract: "Tests behavioral responses to varied fact-checking formats—infographics, short explanatory videos, and text debunking notices—across demographic groups to identify the most effective corrective interventions against viral rumors.",
    keyFindings: [
      "Visual debunking infographics demonstrate 42% higher retention and corrective acceptance compared to traditional text statements.",
      "Corrections shared through trusted community elders and teachers achieve double the credibility score of national media broadcasts.",
      "Confirmation bias remains acute when rumors touch upon communal identity or municipal service delivery disputes."
    ],
    content: {
      executiveSummary: "Countering misinformation requires more than simply publishing factual rebuttals; it demands an understanding of human psychology, social trust dynamics, and cultural channels of communication.",
      methodology: "A randomized controlled trial with 1,200 participants exposed to synthetic viral claims followed by three distinct corrective communication formats.",
      discussion: "The study demonstrates that empathy-first verification framing neutralizes defensive psychological reactions, transforming debunking into a constructive public awareness opportunity.",
      recommendations: [
        "Design fact-checking materials as bite-sized, shareable messaging graphics.",
        "Train community civil leaders as trusted local verification champions.",
        "Foster cross-newsroom verification networks to counter viral hoaxes swiftly."
      ]
    }
  },
  {
    id: "res-08",
    slug: "media-literacy-secondary-education-curriculum",
    title: "Integrating Media Literacy in Secondary Education: A Framework for Democratic Citizenship",
    category: "Media Research",
    type: "Discussion Paper",
    date: "January 19, 2026",
    year: 2026,
    pages: 48,
    fileSize: "3.1 MB",
    doi: "10.5281/ipa.res.2026.001",
    coverImage: "/images/research_media_analysis.jpg",
    authors: [
      { name: "Dr. Nazmul Huq", role: "Senior Fellow in Media Studies", affiliation: "IPA Research Directorate" },
      { name: "Syeda Tahmina Akhter", role: "Principal Researcher", affiliation: "IPA Governance Unit" }
    ],
    abstract: "Proposes an pedagogical model for integrating critical media literacy, digital verification techniques, and civic discussion protocols into secondary educational curricula. Outlines a prototype 12-week course syllabus.",
    keyFindings: [
      "91% of surveyed educators believe students lack the training required to differentiate sponsored native content from journalistic reporting.",
      "Students exposed to basic source verification protocols showed a 68% improvement in identifying manipulated visual media.",
      "Institutional constraints in school computer laboratories present the largest barrier to practical digital verification training."
    ],
    content: {
      executiveSummary: "Democratic citizenship in the digital era is inextricably tied to information discernment. This paper provides curriculum developers and civil society educators with a modular framework for teaching critical media analysis.",
      methodology: "Curriculum pilot conducted across 8 secondary schools (4 urban, 4 semi-urban) reaching 650 students and 32 humanities teachers.",
      discussion: "Equipping young people with investigative inquiry tools empowers them to resist manipulative online propaganda while fostering an appreciation for verified public affairs reporting.",
      recommendations: [
        "Incorporate source analysis exercises into standard national language and civics curricula.",
        "Publish open-source media literacy teacher guides adapted for regional school classrooms.",
        "Establish inter-school investigative journalism and fact-checking student clubs."
      ]
    }
  }
];
