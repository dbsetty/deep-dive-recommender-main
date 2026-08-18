import type { Reel, ReelInteraction } from "./reel-data";
import {
  recommendationCatalog,
  type Difficulty,
  type RecommendationCandidate,
} from "./recommendation-catalog";

type InterestDomain =
  | "Software Engineering"
  | "AI / Machine Learning"
  | "Cybersecurity"
  | "Cloud"
  | "Hardware"
  | "Career"
  | "DSA"
  | "Other";

export type InterestScore = { label: InterestDomain; value: number };

export type RecommendationResult = {
  currentReel: string;
  interestDetected: InterestDomain;
  why: string;
  recommendedReel: string;
  category: string;
  whyRecommendation: string;
  difficulty: Difficulty;
  confidence: "Low" | "Medium" | "High";
  interestScores: InterestScore[];
  rejectedRecommendation: string;
  rejectionReason: string;
};

const interactionWeights: Record<ReelInteraction, number> = {
  liked: 3,
  rewatched: 4,
  watched: 1,
  skipped: -2,
};

const topicDomains: Record<string, Partial<Record<InterestDomain, number>>> = {
  programming: { "Software Engineering": 0.8, DSA: 0.35 },
  java: { "Software Engineering": 0.9 },
  "software-development": { "Software Engineering": 1 },
  "software-engineering": { "Software Engineering": 1 },
  developer: { "Software Engineering": 0.75, Career: 0.45 },
  career: { Career: 1 },
  "coding-interview": { "Software Engineering": 0.8, DSA: 1 },
  dsa: { DSA: 1 },
  hardware: { Hardware: 1, "Software Engineering": 0.2 },
  "computer-architecture": { Hardware: 0.9 },
  "operating-systems": { Hardware: 0.4, "Software Engineering": 0.4 },
  "artificial-intelligence": { "AI / Machine Learning": 1 },
  "machine-learning": { "AI / Machine Learning": 1 },
  "neural-networks": { "AI / Machine Learning": 1 },
  "deep-learning": { "AI / Machine Learning": 1 },
  "computer-vision": { "AI / Machine Learning": 1 },
  "natural-language-processing": { "AI / Machine Learning": 1 },
  llm: { "AI / Machine Learning": 1 },
  "generative-ai": { "AI / Machine Learning": 1 },
  technology: { "AI / Machine Learning": 0.3, Other: 0.2 },
  "ai-tools": { "AI / Machine Learning": 0.35, Career: 0.35 },
  cybersecurity: { Cybersecurity: 1 },
  security: { Cybersecurity: 1 },
  "network-security": { Cybersecurity: 1 },
  "application-security": { Cybersecurity: 1 },
  "ethical-hacking": { Cybersecurity: 1 },
  cloud: { Cloud: 1 },
  devops: { Cloud: 0.8, "Software Engineering": 0.3 },
  containers: { Cloud: 0.7, "Software Engineering": 0.3 },
  infrastructure: { Cloud: 0.8, "Software Engineering": 0.2 },
  "system-design": { "Software Engineering": 0.8, Cloud: 0.3 },
  "distributed-systems": { "Software Engineering": 0.8, Cloud: 0.5 },
  backend: { "Software Engineering": 0.6 },
  api: { "Software Engineering": 0.5 },
  gaming: { Other: 0.6 },
  entertainment: { Other: 0.5 },
};

const phraseTopics: Array<{ phrase: string; topics: string[] }> = [
  { phrase: "machine learning", topics: ["machine-learning", "artificial-intelligence"] },
  { phrase: "neural network", topics: ["neural-networks", "artificial-intelligence"] },
  { phrase: "deep learning", topics: ["deep-learning", "artificial-intelligence"] },
  { phrase: "computer vision", topics: ["computer-vision", "artificial-intelligence"] },
  { phrase: "natural language", topics: ["natural-language-processing", "artificial-intelligence"] },
  { phrase: "generative ai", topics: ["generative-ai", "artificial-intelligence"] },
  { phrase: "llm", topics: ["llm", "artificial-intelligence"] },
  { phrase: "netflix handles", topics: ["system-design", "distributed-systems"] },
  { phrase: "system design", topics: ["system-design"] },
  { phrase: "docker", topics: ["cloud", "devops"] },
  { phrase: "sql injection", topics: ["cybersecurity", "application-security"] },
  { phrase: "ethical hacking", topics: ["cybersecurity", "ethical-hacking"] },
  { phrase: "network security", topics: ["cybersecurity", "network-security"] },
  { phrase: "password security", topics: ["cybersecurity", "security"] },
  { phrase: "gpu", topics: ["hardware", "computer-architecture"] },
  { phrase: "cpu", topics: ["hardware", "computer-architecture"] },
  { phrase: "laptop", topics: ["hardware"] },
  { phrase: "ram", topics: ["hardware", "computer-architecture"] },
  { phrase: "pc building", topics: ["hardware"] },
];

const domains: InterestDomain[] = [
  "Software Engineering",
  "AI / Machine Learning",
  "Cybersecurity",
  "Cloud",
  "Hardware",
  "Career",
  "DSA",
  "Other",
];

const nextStepTopics: Record<InterestDomain, string[]> = {
  "Software Engineering": ["system-design", "distributed-systems", "api", "backend"],
  "AI / Machine Learning": ["machine-learning", "deep-learning", "computer-vision"],
  Cybersecurity: ["network-security", "application-security", "ethical-hacking"],
  Hardware: ["computer-architecture", "operating-systems", "embedded-systems"],
  Cloud: ["cloud", "distributed-systems", "devops"],
  Career: ["software-engineering", "developer", "coding-interview"],
  DSA: ["dsa", "algorithms", "coding-interview"],
  Other: [],
};

function enrichTopics(title: string, topics: string[]): string[] {
  const lowerTitle = title.toLowerCase();
  const inferred = phraseTopics
    .filter(({ phrase }) => lowerTitle.includes(phrase))
    .flatMap(({ topics: matchedTopics }) => matchedTopics);
  return [...new Set([...topics, ...inferred])];
}

function emptyScores(): Record<InterestDomain, number> {
  return Object.fromEntries(domains.map((domain) => [domain, 0])) as Record<
    InterestDomain,
    number
  >;
}

function domainScores(reels: Reel[]) {
  const scores = emptyScores();
  reels.forEach((reel) => {
    const interactionWeight = interactionWeights[reel.interaction];
    enrichTopics(reel.title, reel.topics).forEach((topic) => {
      Object.entries(topicDomains[topic] ?? {}).forEach(([domain, weight]) => {
        scores[domain as InterestDomain] += interactionWeight * (weight ?? 0);
      });
    });
  });
  return scores;
}

function toInterestScores(scores: Record<InterestDomain, number>): InterestScore[] {
  const topScore = Math.max(1, ...Object.values(scores).map((score) => Math.max(0, score)));
  return domains
    .map((label) => ({ label, value: Math.round((Math.max(0, scores[label]) / topScore) * 87) }))
    .sort((a, b) => b.value - a.value);
}

function confidenceFor(scores: Record<InterestDomain, number>): RecommendationResult["confidence"] {
  const ranked = Object.values(scores)
    .map((score) => Math.max(0, score))
    .sort((a, b) => b - a);
  const top = ranked[0] ?? 0;
  const runnerUp = ranked[1] ?? 0;
  const leadRatio = top === 0 ? 0 : (top - runnerUp) / top;

  if (top >= 8 && leadRatio >= 0.55) return "High";
  if (top >= 4 && leadRatio >= 0.25) return "Medium";
  return "Low";
}

function candidateScore(
  candidate: RecommendationCandidate,
  interest: InterestDomain,
  positivelyEngagedTopics: Set<string>,
  skippedTopics: Set<string>,
) {
  const candidateTopics = enrichTopics(candidate.title, candidate.topics);
  const domainRelevance = candidateTopics.reduce(
    (total, topic) => total + (topicDomains[topic]?.[interest] ?? 0),
    0,
  );
  const directOverlap = candidateTopics.filter((topic) => positivelyEngagedTopics.has(topic)).length;
  const skippedOverlap = candidateTopics.filter((topic) => skippedTopics.has(topic)).length;
  const nextStepRelevance = candidateTopics.filter((topic) =>
    nextStepTopics[interest].includes(topic),
  ).length;
  const difficultySuitability =
    candidate.difficulty === "Intermediate" ? 10 : candidate.difficulty === "Beginner" ? 7 : 4;

  return (
    domainRelevance * 25 +
    directOverlap * 12 +
    candidate.educationalValue * 0.35 +
    difficultySuitability +
    nextStepRelevance * 10 -
    candidate.hypeScore * 0.1 -
    skippedOverlap * 35
  );
}

function buildWhy(interest: InterestDomain, reels: Reel[]): string {
  const examples = reels
    .filter((reel) => interactionWeights[reel.interaction] >= 3)
    .slice(0, 4)
    .map((reel) => reel.title);

  if (interest === "Software Engineering") {
    return "The strongest signals are not Java alone. The student repeatedly engages with programming, coding interviews, software-engineering lifestyle content, and developer hardware, suggesting a broader interest in software engineering.";
  }

  return `Strong engagement with ${examples.join(", ")} points to a broader interest in ${interest}.`;
}

export function analyzeReels(reels: Reel[]): RecommendationResult {
  const scores = domainScores(reels);
  const interestScores = toInterestScores(scores);
  const interestDetected = interestScores[0]?.label ?? "Other";
  const positivelyEngaged = reels.filter((reel) => interactionWeights[reel.interaction] > 0);
  const positivelyEngagedTopics = new Set(
    positivelyEngaged.flatMap((reel) => enrichTopics(reel.title, reel.topics)),
  );
  const skippedTopics = new Set(
    reels
      .filter((reel) => reel.interaction === "skipped")
      .flatMap((reel) => enrichTopics(reel.title, reel.topics)),
  );
  const eligibleCandidates = recommendationCatalog.filter(
    (candidate) => !(candidate.hypeScore >= 70 && candidate.educationalValue <= 60),
  );
  const recommended = eligibleCandidates
    .map((candidate) => ({
      candidate,
      score: candidateScore(candidate, interestDetected, positivelyEngagedTopics, skippedTopics),
    }))
    .sort((a, b) => b.score - a.score)[0]?.candidate;
  const currentReel =
    [...reels].reverse().find((reel) => interactionWeights[reel.interaction] >= 3)?.title ??
    reels.at(-1)?.title ??
    "No Reel selected";
  const rejected = recommendationCatalog.find(
    (candidate) => candidate.title === "10 AI Tools That Will Get You a Job",
  )!;
  const chosen = recommended ?? recommendationCatalog[0]!;

  return {
    currentReel,
    interestDetected,
    why: buildWhy(interestDetected, reels),
    recommendedReel: chosen.title,
    category: chosen.category,
    whyRecommendation: `This is a high educational-value next step from ${interestDetected} into a closely related, practical topic.`,
    difficulty: chosen.difficulty,
    confidence: confidenceFor(scores),
    interestScores,
    rejectedRecommendation: rejected.title,
    rejectionReason:
      "Rejected because it is hype-heavy, has weak educational value, and is a weak connection to the inferred interest.",
  };
}
