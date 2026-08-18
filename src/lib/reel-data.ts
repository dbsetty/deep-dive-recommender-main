export type ReelInteraction = "liked" | "rewatched" | "watched" | "skipped";

export type Reel = {
  id: string;
  title: string;
  category: string;
  interaction: ReelInteraction;
  topics: string[];
};

export type DemoProfile = {
  id: "profile-a" | "profile-b" | "profile-c";
  label: "PROFILE A" | "PROFILE B" | "PROFILE C";
  reels: Reel[];
};

export const reelData: Reel[] = [
  {
    id: "java-programming-meme",
    title: "Java Programming Meme",
    category: "Java",
    interaction: "liked",
    topics: ["programming", "java", "software-development"],
  },
  {
    id: "software-engineer-day-in-life",
    title: "A Day in the Life of a Software Engineer",
    category: "Career",
    interaction: "rewatched",
    topics: ["software-engineering", "developer", "career"],
  },
  {
    id: "coding-interview-joke",
    title: "Coding Interview Joke",
    category: "DSA",
    interaction: "liked",
    topics: ["programming", "coding-interview", "dsa"],
  },
  {
    id: "best-laptop-programmers",
    title: "Best Laptop for Programmers",
    category: "Hardware",
    interaction: "watched",
    topics: ["hardware", "programming", "developer"],
  },
  {
    id: "gaming-highlights",
    title: "Gaming Highlights",
    category: "Gaming",
    interaction: "watched",
    topics: ["gaming", "entertainment"],
  },
  {
    id: "ai-news",
    title: "AI News",
    category: "AI",
    interaction: "liked",
    topics: ["artificial-intelligence", "technology"],
  },
  {
    id: "cybersecurity-breach",
    title: "Cybersecurity Breach Explained",
    category: "Cybersecurity",
    interaction: "skipped",
    topics: ["cybersecurity", "security"],
  },
  {
    id: "ai-tools-job",
    title: "10 AI Tools That Will Get You a Job",
    category: "Career",
    interaction: "watched",
    topics: ["ai-tools", "career", "hype"],
  },
];

export const demoProfiles: DemoProfile[] = [
  { id: "profile-a", label: "PROFILE A", reels: reelData },
  {
    id: "profile-b",
    label: "PROFILE B",
    reels: [
      { id: "machine-learning-explained", title: "Machine Learning Explained", category: "AI", interaction: "liked", topics: ["machine-learning", "artificial-intelligence"] },
      { id: "neural-networks-scratch", title: "Neural Networks from Scratch", category: "AI", interaction: "rewatched", topics: ["neural-networks", "artificial-intelligence"] },
      { id: "computer-vision-demo", title: "Computer Vision Demo", category: "AI", interaction: "liked", topics: ["computer-vision", "artificial-intelligence"] },
      { id: "ai-research-news", title: "AI Research News", category: "AI", interaction: "liked", topics: ["artificial-intelligence", "technology"] },
      { id: "large-language-models", title: "Large Language Models Explained", category: "AI", interaction: "watched", topics: ["llm", "artificial-intelligence"] },
      { id: "python-ml-meme", title: "Python ML Meme", category: "Programming", interaction: "liked", topics: ["programming", "machine-learning"] },
      { id: "gaming-highlights-b", title: "Gaming Highlights", category: "Gaming", interaction: "watched", topics: ["gaming", "entertainment"] },
      { id: "ai-tools-job-b", title: "10 AI Tools That Will Get You a Job", category: "Career", interaction: "skipped", topics: ["ai-tools", "career", "hype"] },
    ],
  },
  {
    id: "profile-c",
    label: "PROFILE C",
    reels: [
      { id: "ethical-hacking-basics", title: "Ethical Hacking Basics", category: "Cybersecurity", interaction: "liked", topics: ["cybersecurity", "ethical-hacking"] },
      { id: "cybersecurity-news", title: "Cybersecurity News", category: "Cybersecurity", interaction: "rewatched", topics: ["cybersecurity", "security"] },
      { id: "sql-injection-explained", title: "SQL Injection Explained", category: "Cybersecurity", interaction: "liked", topics: ["cybersecurity", "application-security"] },
      { id: "network-security", title: "Network Security", category: "Cybersecurity", interaction: "liked", topics: ["cybersecurity", "network-security"] },
      { id: "password-security", title: "Password Security", category: "Cybersecurity", interaction: "watched", topics: ["cybersecurity", "security"] },
      { id: "web-security-explained", title: "Web Security Explained", category: "Cybersecurity", interaction: "liked", topics: ["cybersecurity", "application-security"] },
      { id: "ai-news-c", title: "AI News", category: "AI", interaction: "watched", topics: ["artificial-intelligence", "technology"] },
      { id: "ai-tools-job-c", title: "10 AI Tools That Will Get You a Job", category: "Career", interaction: "skipped", topics: ["ai-tools", "career", "hype"] },
    ],
  },
];

export const interactionLabels: Record<ReelInteraction, string> = {
  liked: "Liked",
  rewatched: "Rewatched",
  watched: "Watched",
  skipped: "Skipped",
};
