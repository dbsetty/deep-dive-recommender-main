# Insight Engine

The Algorithm Knows You Too Well

Build a polished hackathon prototype called "The Algorithm Knows You Too Well".

The project demonstrates an AI-powered recommendation agent that analyzes a student's interactions with short-form Reels, infers their broader technology interests, and recommends useful technology-related content.

Main Demo

Create a dashboard with these sections:

Hero section

Title: "THE ALGORITHM KNOWS YOU TOO WELL"

Subtitle: "We don't recommend what you watched. We recommend what your watching reveals about you."

A prominent button: "Analyze My Interests"

Student Reel History
Display these four primary Reels:

Java Programming Meme — Liked

A Day in the Life of a Software Engineer — Rewatched

Coding Interview Joke — Liked

Best Laptop for Programmers — Watched

Also include four additional sample Reels:

Gaming Highlights — Watched

AI News — Liked

Cybersecurity Breach Explained — Skipped

"10 AI Tools That Will Get You a Job" — Watched

AI Interest Analysis
Initially hide this section.
When "Analyze My Interests" is clicked, reveal:

Primary interest: Software Engineering

Confidence: High

Programming: 81%

Software Engineering: 87%

Tech Career: 68%

Hardware: 48%

AI: 42%

Cybersecurity: 21%

Reasoning
Explain that the system did not simply match keywords. It recognized relationships between programming, coding interviews, developer lifestyle and developer hardware and inferred the broader interest of Software Engineering.

Recommendation
Show:

Title: "How Netflix Handles Millions of Users"

Category: HLD

Difficulty: Intermediate

Confidence: High

Explanation: "Your interactions suggest a broader interest in software engineering rather than Java specifically. System design is a natural extension of that interest."

Hype Filter
Show a rejected recommendation:

"10 AI Tools That Will Get You a Job"

Label it: "REJECTED"

Explain: "High hype, low educational value and weak connection to the inferred interest."

Basic vs AI Agent
Visually compare:

Basic recommendation: Java Meme → More Java Content

Our agent: Java + Coding + Developer Lifestyle + Hardware → Software Engineering → System Design

Design

Make it look like a premium AI hackathon product.

Use:

clean modern interface

strong typography

cards

subtle animations

clear visual hierarchy

responsive desktop and mobile layout

Do not make it look like a generic dashboard template.

For now, use fictional data and simulated AI results. Do not implement Instagram API integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a3ada44-3ccc-47e7-ac44-5f12c2f94a6a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
