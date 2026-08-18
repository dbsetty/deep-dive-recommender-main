export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type RecommendationCandidate = {
  id: string;
  title: string;
  category: string;
  topics: string[];
  difficulty: Difficulty;
  educationalValue: number;
  hypeScore: number;
};

export const recommendationCatalog: RecommendationCandidate[] = [
  { id: "netflix-hld", title: "How Netflix Handles Millions of Users", category: "HLD", topics: ["software-engineering", "system-design", "scalability", "distributed-systems"], difficulty: "Intermediate", educationalValue: 98, hypeScore: 7 },
  { id: "system-design-intro", title: "Introduction to System Design", category: "HLD", topics: ["software-engineering", "system-design", "backend"], difficulty: "Intermediate", educationalValue: 91, hypeScore: 10 },
  { id: "rest-apis", title: "Understanding REST APIs", category: "Backend", topics: ["software-engineering", "api", "backend"], difficulty: "Beginner", educationalValue: 88, hypeScore: 8 },
  { id: "binary-search", title: "Binary Search Explained", category: "DSA", topics: ["programming", "dsa", "algorithms"], difficulty: "Beginner", educationalValue: 90, hypeScore: 6 },
  { id: "docker", title: "How Docker Actually Works", category: "DevOps", topics: ["software-engineering", "containers", "cloud"], difficulty: "Intermediate", educationalValue: 94, hypeScore: 9 },
  { id: "url", title: "What Happens When You Type a URL?", category: "Web", topics: ["software-engineering", "networking", "web"], difficulty: "Beginner", educationalValue: 89, hypeScore: 8 },
  { id: "cloud-intro", title: "Introduction to Cloud Computing", category: "Cloud", topics: ["cloud", "software-engineering", "infrastructure"], difficulty: "Beginner", educationalValue: 86, hypeScore: 11 },
  { id: "sql-injection", title: "SQL Injection Explained", category: "Cybersecurity", topics: ["cybersecurity", "security", "databases"], difficulty: "Intermediate", educationalValue: 93, hypeScore: 7 },
  { id: "git", title: "How Git Actually Works", category: "Developer Tools", topics: ["software-engineering", "developer", "version-control"], difficulty: "Beginner", educationalValue: 87, hypeScore: 8 },
  { id: "api-communication", title: "How APIs Communicate", category: "Backend", topics: ["software-engineering", "api", "networking"], difficulty: "Beginner", educationalValue: 85, hypeScore: 9 },
  { id: "ml-intro", title: "Introduction to Machine Learning", category: "AI", topics: ["artificial-intelligence", "machine-learning", "technology"], difficulty: "Beginner", educationalValue: 90, hypeScore: 14 },
  { id: "cpu", title: "How CPUs Execute Code", category: "Hardware", topics: ["hardware", "programming", "computer-architecture"], difficulty: "Intermediate", educationalValue: 92, hypeScore: 7 },
  { id: "operating-systems", title: "Operating Systems Explained", category: "Computer Science", topics: ["software-engineering", "operating-systems", "hardware"], difficulty: "Intermediate", educationalValue: 94, hypeScore: 8 },
  { id: "databases", title: "How Databases Work", category: "Backend", topics: ["software-engineering", "databases", "backend"], difficulty: "Intermediate", educationalValue: 93, hypeScore: 8 },
  { id: "ai-tools-job", title: "10 AI Tools That Will Get You a Job", category: "Career", topics: ["ai-tools", "career", "hype"], difficulty: "Beginner", educationalValue: 32, hypeScore: 92 },
  { id: "engineer-30-days", title: "Become a Software Engineer in 30 Days", category: "Career", topics: ["career", "software-engineering", "hype"], difficulty: "Beginner", educationalValue: 25, hypeScore: 95 },
  { id: "ai-tools-must-use", title: "5 AI Tools You MUST Use", category: "AI", topics: ["ai-tools", "hype"], difficulty: "Beginner", educationalValue: 28, hypeScore: 94 },
  { id: "programmer-trick", title: "This One Trick Will Make You a Programmer", category: "Programming", topics: ["programming", "hype"], difficulty: "Beginner", educationalValue: 20, hypeScore: 97 },
];
