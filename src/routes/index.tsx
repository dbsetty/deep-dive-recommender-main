import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoProfiles, interactionLabels, type Reel } from "@/lib/reel-data";
import { analyzeReels, type RecommendationResult } from "@/lib/recommendation-agent";
import {
  Play,
  ThumbsUp,
  Repeat,
  Eye,
  SkipForward,
  Sparkles,
  Brain,
  TrendingUp,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Code2,
  Briefcase,
  Monitor,
  Lock,
  Bot,
  Layers,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Algorithm Knows You Too Well | AI Interest Discovery" },
      {
        name: "description",
        content:
          "An AI-powered recommendation agent that analyzes your Reel interactions, infers your real technology interests, and recommends genuinely useful content.",
      },
      { property: "og:title", content: "The Algorithm Knows You Too Well" },
      {
        property: "og:description",
        content:
          "We don't recommend what you watched. We recommend what your watching reveals about you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const reelVisuals = {
  "java-programming-meme": {
    icon: Code2,
    tint: "from-primary/25 to-primary/5",
    ink: "text-primary",
  },
  "software-engineer-day-in-life": {
    icon: Briefcase,
    tint: "from-coral/25 to-coral/5",
    ink: "text-coral",
  },
  "coding-interview-joke": {
    icon: Brain,
    tint: "from-primary/25 to-coral/10",
    ink: "text-primary",
  },
  "best-laptop-programmers": {
    icon: Monitor,
    tint: "from-muted to-secondary",
    ink: "text-muted-foreground",
  },
  "gaming-highlights": {
    icon: Play,
    tint: "from-muted to-secondary",
    ink: "text-muted-foreground",
  },
  "ai-news": {
    icon: Bot,
    tint: "from-primary/20 to-lime/10",
    ink: "text-primary",
  },
  "cybersecurity-breach": {
    icon: ShieldAlert,
    tint: "from-muted to-secondary",
    ink: "text-muted-foreground",
  },
  "ai-tools-job": {
    icon: TrendingUp,
    tint: "from-coral/20 to-coral/5",
    ink: "text-coral",
  },
};

const categoryVisuals = {
  AI: { icon: Bot, tint: "from-primary/20 to-lime/10", ink: "text-primary" },
  Programming: { icon: Code2, tint: "from-primary/25 to-primary/5", ink: "text-primary" },
  Gaming: { icon: Play, tint: "from-muted to-secondary", ink: "text-muted-foreground" },
  Career: { icon: Briefcase, tint: "from-coral/25 to-coral/5", ink: "text-coral" },
  Cybersecurity: { icon: ShieldAlert, tint: "from-muted to-secondary", ink: "text-muted-foreground" },
  Hardware: { icon: Monitor, tint: "from-muted to-secondary", ink: "text-muted-foreground" },
  Other: { icon: Play, tint: "from-muted to-secondary", ink: "text-muted-foreground" },
};

const interestIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Software Engineering": Layers,
  "AI / Machine Learning": Bot,
  Cybersecurity: Lock,
  Cloud: Cpu,
  Hardware: Monitor,
  Career: Briefcase,
  DSA: Brain,
  Other: Play,
};

const analysisSteps = [
  "Analyzing Reel content...",
  "Connecting behavioral signals...",
  "Inferring broader interests...",
  "Finding useful technology content...",
];

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Liked: ThumbsUp,
  Rewatched: Repeat,
  Watched: Eye,
  Skipped: SkipForward,
};

const signalsByInterest: Record<string, Array<{ topic: string; label: string }>> = {
  "Software Engineering": [
    { topic: "java", label: "Java" },
    { topic: "coding-interview", label: "Coding Interviews" },
    { topic: "software-engineering", label: "Developer Lifestyle" },
    { topic: "hardware", label: "Hardware" },
  ],
  "AI / Machine Learning": [
    { topic: "machine-learning", label: "Machine Learning" },
    { topic: "neural-networks", label: "Neural Networks" },
    { topic: "computer-vision", label: "Computer Vision" },
    { topic: "llm", label: "Language Models" },
  ],
  Cybersecurity: [
    { topic: "ethical-hacking", label: "Ethical Hacking" },
    { topic: "application-security", label: "Application Security" },
    { topic: "network-security", label: "Network Security" },
    { topic: "security", label: "Password Security" },
  ],
};

function profileSignals(reels: Reel[], interest: string): string[] {
  const topics = new Set(reels.flatMap((reel) => reel.topics));
  const configuredSignals = signalsByInterest[interest] ?? [];
  const labels = configuredSignals
    .filter((signal) => topics.has(signal.topic))
    .map((signal) => signal.label);

  return labels.length > 0
    ? labels
    : reels.filter((reel) => reel.interaction !== "skipped").slice(0, 4).map((reel) => reel.category);
}

function cloneReels(reels: Reel[]): Reel[] {
  return reels.map((reel) => ({ ...reel, topics: [...reel.topics] }));
}

function createNewReel(): Reel {
  const id = `custom-reel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    title: "New Reel",
    category: "General",
    interaction: "watched",
    topics: ["general"],
  };
}

function Index() {
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [step, setStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<RecommendationResult | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState(demoProfiles[0]!.id);
  const [editableReels, setEditableReels] = useState<Reel[]>(() =>
    cloneReels(demoProfiles[0]!.reels),
  );
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const selectedProfile =
    demoProfiles.find((profile) => profile.id === selectedProfileId) ?? demoProfiles[0]!;

  useEffect(() => {
    setEditableReels(cloneReels(selectedProfile.reels));
  }, [selectedProfile.id]);

  const reels = editableReels.map((reel) => ({
    ...reel,
    action: interactionLabels[reel.interaction],
    ...(reelVisuals[reel.id as keyof typeof reelVisuals] ??
      categoryVisuals[reel.category as keyof typeof categoryVisuals] ??
      categoryVisuals.Other),
  }));
  const agentSignals = analysisResult
    ? profileSignals(editableReels, analysisResult.interestDetected)
    : [];
  const basicTopic = agentSignals[0] ?? editableReels[0]?.category ?? "Topic";
  const agentNextStep = analysisResult
    ? analysisResult.category === "HLD"
      ? "System Design / HLD"
      : `${analysisResult.recommendedReel} / ${analysisResult.category}`
    : "";

  const updateReel = (reelId: string, updates: Partial<Reel>) => {
    setEditableReels((currentReels) =>
      currentReels.map((reel) => {
        if (reel.id !== reelId) return reel;
        return { ...reel, ...updates, topics: updates.topics ?? reel.topics };
      }),
    );
  };

  const removeReel = (reelId: string) => {
    setEditableReels((currentReels) => currentReels.filter((reel) => reel.id !== reelId));
  };

  const addReel = () => {
    setEditableReels((currentReels) => [...currentReels, createNewReel()]);
  };

  const resetReels = () => {
    setEditableReels(cloneReels(selectedProfile.reels));
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const selectProfile = (profileId: typeof selectedProfileId) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSelectedProfileId(profileId);
    setPhase("idle");
    setStep(0);
    setAnalysisResult(null);
  };

  const runAnalysis = () => {
    if (phase === "analyzing") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("analyzing");
    setStep(0);

    analysisSteps.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(setTimeout(() => setStep(i), i * 450));
    });

    timers.current.push(
      setTimeout(() => {
        try {
          const analysisInput = editableReels;
          setAnalysisResult(analyzeReels(analysisInput));
        } catch {
          setAnalysisResult(analyzeReels([]));
        }
        setPhase("done");
        timers.current.push(
          setTimeout(
            () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            120,
          ),
        );
      }, 1900),
    );
  };

  const analyzed = phase === "done";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero */}
        <section className="animate-in flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="mb-7 rounded-full border-primary/25 bg-primary/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI-Powered Interest Discovery
          </Badge>

          <h1 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            THE ALGORITHM{" "}
            <span className="text-gradient">KNOWS YOU TOO WELL</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            We don't recommend what you watched.
            <br className="hidden sm:block" /> We recommend what your watching reveals
            about you.
          </p>

          <Button
            size="lg"
            onClick={runAnalysis}
            disabled={phase === "analyzing"}
            className="group mt-10 h-13 gap-2 rounded-full bg-gradient-to-r from-primary to-coral px-8 py-3.5 text-base font-bold text-primary-foreground shadow-[0_16px_40px_-18px_var(--color-glow)] transition-all hover:shadow-[0_20px_50px_-16px_var(--color-glow)] hover:brightness-105 disabled:opacity-100"
          >
            {phase === "analyzing" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Brain className="h-5 w-5" />
            )}
            {phase === "analyzing"
              ? "Analyzing..."
              : analyzed
                ? "Re-run Analysis"
                : "Analyze My Interests"}
            {phase !== "analyzing" && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </Button>
        </section>

        {/* Reel feed */}
        <section className="mt-16 sm:mt-20">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Student Reel History</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Recent short-form interactions used as signal input.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {editableReels.length} interactions analyzed
              </Badge>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={resetReels}
                className="h-9 rounded-full px-3 text-xs font-semibold tracking-wide bg-card text-muted-foreground hover:bg-muted"
              >
                Reset
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={addReel}
                className="h-9 rounded-full px-3 text-xs font-semibold tracking-wide bg-primary text-primary-foreground hover:brightness-105"
              >
                Add Reel
              </Button>
            </div>
          </div>

          <div className="mb-7 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Fictional Demo Profile
              </p>
              <h3 className="mt-1 text-sm font-bold tracking-wide">Try Another Profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                See how the same algorithm interprets different behavior.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {demoProfiles.map((profile) => (
                <Button
                  key={profile.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={profile.id === selectedProfile.id}
                  onClick={() => selectProfile(profile.id)}
                  className={`h-9 rounded-full px-3 text-xs font-semibold tracking-wide transition-colors ${
                    profile.id === selectedProfile.id
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {profile.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reels.map((reel, idx) => (
              <Card
                key={reel.title}
                className="card-glass animate-in group gap-0 overflow-hidden rounded-3xl p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_color-mix(in_oklab,var(--color-ink)_45%,transparent)]"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${reel.tint}`}
                >
                  <reel.icon className={`h-10 w-10 ${reel.ink}`} />
                  <span className="absolute left-3 top-3 rounded-full bg-card/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                    {reel.category}
                  </span>
                  <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-card/85 text-foreground backdrop-blur">
                    <Play className="h-3.5 w-3.5" />
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                    {reel.title}
                  </h3>
                  <div className="mt-3">
                    <ActionBadge action={reel.action} />
                  </div>

                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Title
                      </label>
                      <input
                        type="text"
                        value={reel.title}
                        onChange={(event) =>
                          updateReel(reel.id, { title: event.target.value || "Untitled Reel" })
                        }
                        className="h-8 w-full rounded-md border border-border bg-background/60 px-2 text-xs text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-primary/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Category
                      </label>
                      <input
                        type="text"
                        value={reel.category}
                        onChange={(event) =>
                          updateReel(reel.id, { category: event.target.value || "General" })
                        }
                        className="h-8 w-full rounded-md border border-border bg-background/60 px-2 text-xs text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-primary/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Topics
                      </label>
                      <input
                        type="text"
                        value={reel.topics.join(", ")}
                        onChange={(event) =>
                          updateReel(reel.id, {
                            topics: event.target.value
                              .split(",")
                              .map((topic) => topic.trim())
                              .filter(Boolean),
                          })
                        }
                        className="h-8 w-full rounded-md border border-border bg-background/60 px-2 text-xs text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-primary/40"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Interaction
                        </label>
                        <select
                          value={reel.interaction}
                          onChange={(event) =>
                            updateReel(reel.id, {
                              interaction: event.target.value as Reel["interaction"],
                            })
                          }
                          className="h-8 w-full rounded-md border border-border bg-background/60 px-2 text-xs text-foreground outline-none ring-0 focus:border-primary/40"
                        >
                          <option value="watched">Watched</option>
                          <option value="liked">Liked</option>
                          <option value="rewatched">Rewatched</option>
                          <option value="skipped">Skipped</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeReel(reel.id)}
                        className="mt-5 h-8 rounded-md border border-destructive/20 bg-destructive/10 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive transition-colors hover:bg-destructive/15"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Analyzing state */}
        {phase === "analyzing" && (
          <section className="animate-in mt-16">
            <Card className="card-ai overflow-hidden rounded-3xl">
              <CardContent className="p-7 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Agent running
                    </p>
                    <p className="text-lg font-bold">{analysisSteps[step]}</p>
                  </div>
                </div>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="shimmer-bar h-full w-full" />
                </div>
                <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                  {analysisSteps.map((s, i) => (
                    <li
                      key={s}
                      className={`flex items-center gap-2 transition-opacity duration-300 ${
                        i <= step ? "opacity-100" : "opacity-35"
                      }`}
                    >
                      {i < step ? (
                        <CheckCircle2 className="h-4 w-4 text-lime" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-border" />
                      )}
                      <span
                        className={
                          i <= step ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        <div ref={resultRef} className="scroll-mt-8" />

        {/* AI Interest Analysis */}
        {analyzed && analysisResult && (
          <section className="animate-in mt-16 sm:mt-20">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Hidden profile revealed
                </p>
                <h2 className="mt-1.5 text-2xl font-bold sm:text-3xl">
                  AI Interest Analysis
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Inferred from behavioral signals, not keyword matching.
                </p>
              </div>
              <Badge className="w-fit gap-1.5 rounded-full border border-lime/30 bg-lime-soft px-3 py-1.5 text-xs font-semibold text-lime">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Analysis Complete
              </Badge>
            </div>

            <Card className="card-ai overflow-hidden rounded-[1.75rem]">
              <CardContent className="p-7 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Detected primary interest
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Current Reel <span className="ml-2 text-foreground">{analysisResult.currentReel}</span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <h3 className="text-3xl font-extrabold leading-none sm:text-5xl">
                    <span className="text-gradient">{analysisResult.interestDetected.toUpperCase()}</span>
                  </h3>
                  <Badge className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {analysisResult.confidence} Confidence
                  </Badge>
                </div>

                <div className="mt-9 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {analysisResult.interestScores.slice(0, 6).map((item, i) => {
                    const Icon = interestIcons[item.label] ?? Layers;
                    return (
                      <div key={item.label} className="border-b border-border pb-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </div>
                          <span className="font-heading text-xl font-extrabold tabular-nums">
                            {item.value}
                            <span className="text-xs text-muted-foreground">%</span>
                          </span>
                        </div>
                        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              i === 0
                                ? "bg-gradient-to-r from-primary to-coral"
                                : "bg-primary/55"
                            }`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Reasoning */}
        {analyzed && analysisResult && (
          <section className="animate-in animate-in-delay-1 mt-8">
            <Card className="card-glass overflow-hidden rounded-3xl border-l-[5px] border-l-primary">
              <CardContent className="p-7 sm:p-9">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Why {analysisResult.interestDetected}?</h3>
                    <p className="mt-2.5 leading-relaxed text-muted-foreground">
                      {analysisResult.why}
                      {/*
                      The system did not simply match keywords. It recognized the
                      relationship between programming, coding interviews, developer
                      lifestyle, and developer hardware — then inferred the broader
                      latent interest of{" "}
                      <span className="font-semibold text-foreground">
                        Software Engineering
                      </span>
                      .
                      */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Recommendation */}
        {analyzed && analysisResult && (
          <section className="animate-in animate-in-delay-2 mt-16">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Recommended For You</h2>
            <Card className="relative overflow-hidden rounded-[1.75rem] border border-lime/30 bg-card shadow-[0_28px_60px_-32px_color-mix(in_oklab,var(--color-lime)_60%,transparent)]">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-lime via-primary to-coral" />
              <CardContent className="p-7 sm:p-10">
                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {analysisResult.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {analysisResult.difficulty}
                      </Badge>
                      <Badge className="rounded-full border border-lime/30 bg-lime-soft px-3 py-1 text-xs font-semibold text-lime">
                        {analysisResult.confidence} Confidence
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">
                      {analysisResult.recommendedReel}
                    </h3>
                    <p className="mt-3.5 max-w-2xl leading-relaxed text-muted-foreground">
                      {analysisResult.whyRecommendation}
                      {/*
                      Your interactions suggest a broader interest in software
                      engineering rather than Java specifically. System design is a
                      natural extension of that interest.
                      */}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime-soft px-3.5 py-1.5 text-xs font-semibold text-lime">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Useful recommendation
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-lime/20 via-primary/15 to-coral/15 text-primary lg:h-36 lg:w-36">
                      <Layers className="h-14 w-14 lg:h-16 lg:w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Hype Filter */}
        {analyzed && analysisResult && (
          <section className="animate-in animate-in-delay-3 mt-14">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Hype Filter</h2>
            <Card className="overflow-hidden rounded-3xl border border-coral/30 bg-coral/5">
              <CardContent className="p-7 sm:p-9">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-coral/12 text-coral">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-muted-foreground line-through decoration-coral/60 decoration-2">
                        {analysisResult.rejectedRecommendation}
                      </h3>
                      <Badge className="rounded-full bg-coral px-3 py-1 text-[11px] font-bold tracking-wider text-coral-foreground">
                        REJECTED
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {analysisResult.rejectionReason}
                      {/*
                      High hype, low educational value and weak connection to the
                      inferred interest.
                      */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {analyzed && analysisResult && (
          <section className="animate-in mt-14">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Behavioral reasoning
              </p>
              <h2 className="mt-1.5 text-2xl font-bold sm:text-3xl">
                Why This Isn't Just Keyword Matching
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="card-glass rounded-3xl border-dashed">
                <CardContent className="p-7">
                  <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    ❌ Basic Algorithm
                  </p>
                  <div className="mt-5 space-y-3">
                    <Chip muted>{basicTopic}</Chip>
                    <div className="flex text-muted-foreground">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                    <Chip muted>{basicTopic} Recommendation</Chip>
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Matches the most obvious topic.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ai rounded-3xl">
                <CardContent className="p-7">
                  <p className="hidden flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    🧠 Our Agent
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {agentSignals.map((signal) => (
                      <Chip key={signal}>{signal}</Chip>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <ArrowRight className="h-4 w-4 rotate-90 text-primary" />
                    <span className="rounded-full bg-gradient-to-r from-primary to-coral px-4 py-1.5 text-sm font-bold text-primary-foreground">
                      {analysisResult.interestDetected}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <ArrowRight className="h-4 w-4 rotate-90 text-lime" />
                    <span className="rounded-full border border-lime/30 bg-lime-soft px-4 py-1.5 text-sm font-bold text-lime">
                      {agentNextStep}
                    </span>
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Combines behavioral signals and related topics to infer the broader interest.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        <div className="glow-line mx-auto mt-20 max-w-4xl" />
        <footer className="mt-7 text-center text-sm text-muted-foreground">
          <p>Hackathon prototype · Fictional data · No Instagram API integration</p>
        </footer>
      </div>
    </main>
  );
}

function Chip({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3.5 py-1.5 text-sm font-semibold ${
        muted
          ? "bg-muted text-muted-foreground"
          : "border border-primary/20 bg-primary/8 text-primary"
      }`}
    >
      {children}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  const Icon = actionIcons[action] || Eye;
  const variants: Record<string, string> = {
    Liked: "bg-primary/10 text-primary border-primary/20",
    Rewatched: "bg-coral/12 text-coral border-coral/25",
    Watched: "bg-muted text-muted-foreground border-transparent",
    Skipped: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        variants[action] || variants["Watched"]
      }`}
    >
      <Icon className="h-3 w-3" />
      {action}
    </Badge>
  );
}
