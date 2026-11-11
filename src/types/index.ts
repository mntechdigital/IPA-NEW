export type Category = 
  | 'Media Research'
  | 'Public Affairs'
  | 'Digital Media'
  | 'Social Development'
  | 'Governance'
  | 'Public Awareness';

export type PublicationType = 
  | 'Research Report'
  | 'Policy Brief'
  | 'Discussion Paper'
  | 'Working Paper'
  | 'Article';

export interface Author {
  name: string;
  role: string;
  affiliation?: string;
  avatar?: string;
}

export interface ResearchItem {
  id: string;
  slug: string;
  title: string;
  category: Category;
  type: PublicationType;
  date: string;
  year: number;
  authors: Author[];
  abstract: string;
  keyFindings: string[];
  coverImage: string;
  pages: number;
  fileSize: string;
  doi?: string;
  downloadUrl?: string;
  featured?: boolean;
  content: {
    executiveSummary: string;
    methodology: string;
    discussion: string;
    recommendations: string[];
  };
}

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  category: string;
  description: string;
  coverImage: string;
  overview: string;
  objectives: string[];
  activities: string[];
  targetAudience: string;
  expectedOutcomes: string[];
  leadFellow: string;
}

export interface CampaignItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  status: 'Active Campaign' | 'Archived' | 'Upcoming';
  coverImage: string;
  introduction: string;
  whyItMatters: string;
  objectives: string[];
  coreActions: string[];
  partnerNetworks: string[];
  resources: {
    title: string;
    type: string;
    size: string;
    url?: string;
  }[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: 'News' | 'Events' | 'Press Releases' | 'Announcements';
  date: string;
  coverImage: string;
  summary: string;
  location?: string;
  readTime: string;
  content: string[];
  relatedTopics: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Policy Brief' | 'Research Report' | 'Media Resource' | 'Discussion Paper' | 'Dataset & Guide';
  category: Category;
  date: string;
  year: number;
  size: string;
  description: string;
  fileFormat: 'PDF' | 'DOCX' | 'ZIP' | 'XLSX';
  downloadCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  bio: string;
  focusAreas: string[];
  publicationsCount: number;
}
