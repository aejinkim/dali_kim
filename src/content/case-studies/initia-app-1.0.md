# Initia App 1.0 — Designing Without Data

---

## Meta

| Field | Value |
|-------|-------|
| Role | Head of Product Design |
| Scope | UX Architecture · Information Design · Design System · Wallet UX |
| Context | 2023–2024 · Initia |

---

## Project Overview

### The Initia App

The Initia App is the primary entry point to Initia's multichain ecosystem — where users stake assets, swap tokens, participate in governance, and interact with independent chains connected through a shared infrastructure layer. V1 was built to launch the ecosystem: to give the first wave of users something coherent to land in.

### My Role

As Head of Design, I set the product design direction for V1 from the ground up. That meant defining the information architecture, establishing the V1 design system, designing the core flows — Stake, Swap, Vote, and wallet connection — and building the design foundations that the rest of the product would grow on.

---

## The Problem

Designing V1 meant designing in the dark. There was no existing user base, no behavioral data, no established pattern for what a multichain ecosystem app should feel like. We were building the product and the audience simultaneously.

The constraints were real:

1. No user behavior data — the ecosystem had not yet launched
2. Two radically different audiences: crypto newcomers and experienced on-chain users
3. A rapidly expanding feature set with no stable product surface to anchor to
4. Wallet connection requiring MetaMask, Keplr, or Leap — each with different installation flows

The risk wasn't building something users couldn't use. The risk was building something so complex that users never started — and walking away with the impression that Initia required expertise to enter.

---

## The Strategy

When you don't have data, you make bets. The V1 bet was simple: reduce the decision surface to the point where starting was obvious. This wasn't minimalism for aesthetic reasons — it was a direct response to the onboarding reality of Web3 in 2023.

> Design for the user who knows nothing. The expert will find their way.

This shaped three core design principles for V1:

**01 — One thing at a time**
Each primary action — Stake, Swap, Vote — lived in its own destination. No competing calls to action on a single screen.

**02 — Hide what isn't needed yet**
APRs, TVL, pool depths, and position details were accessible but not surfaced by default. The first screen showed what to do, not everything that existed.

**03 — Trust through clarity**
In DeFi, users are moving real money. Confirmation screens, clear transaction summaries, and explicit warnings were not optional — they were the product.

---

## Three Actions, Three Destinations

The V1 information architecture organized itself around three primary actions: Stake, Swap, and Vote. Each lived in its own destination. Nothing competed for visual real estate. The decision on the home screen was not "what can I do here?" but "which of these three do I want?"

This structure also served a secondary function: it mapped cleanly to Initia's ecosystem roles. Stakers secured the network. Swappers provided liquidity. Voters shaped governance. The architecture reflected the ecosystem, not just the interface.

---

## Wallet Connection

Wallet connection was the first real test. At launch, Initia supported Keplr, Leap, and EVM wallets via Privy — three different connection flows, each with different installation requirements, different UX patterns, and different failure modes.

The V1 solution was intentionally scoped: show only wallets the user has already installed. No prompts to install new software before connecting. No decision paralysis from a list of unfamiliar options. The connection modal surfaced what was available, explained the difference briefly, and got out of the way.

---

## Design System

V1 was always intended to grow. That meant the design system — components, tokens, spacing, interaction patterns — needed to be built for scale from day one, even if only three surfaces existed at launch.

The system was built around a dark-first aesthetic consistent with the Initia brand, a strict typographic scale, a minimal color palette that kept ecosystem chain colors from clashing with core UI, and a component library that product engineers could implement without needing a designer in the loop for every edge case.

Component adoption across V1 surfaces reached 95% within the first product cycle — meaning new screens could be assembled quickly from existing pieces, and visual consistency held without manual review on every decision.

---

## What Worked

After launch, the V1 architecture held up against real user behavior in several important ways:

1. Newcomers could start staking or swapping without understanding what a wallet address was
2. The three-action architecture gave the product a clear mental model that spread through the community
3. Design system foundations — tokens, components, spacing — scaled as new surfaces were added
4. Wallet connection with installed-wallets-only reduced support burden from failed connection attempts

---

## What Changed

V1 was a bet placed without data. It worked — the ecosystem launched, users onboarded, and the product held together under real conditions. But mainnet revealed something the pre-launch assumptions hadn't accounted for.

The users creating the most value inside the ecosystem — the ones staking consistently, providing liquidity, participating in governance, and driving chain activity — were not beginners. They were committed participants who had outgrown V1's simplicity. They wanted depth. Portfolio visibility. Reward tracking. Advanced liquidity management. The ability to move assets without learning three different product surfaces.

> V1 was built for the user who was just arriving. V2 had to be built for the user who decided to stay.

---

## Image Slots

| Slot | Path | Content |
|------|------|---------|
| Hero | `/assets/initia/initia_app_01.png` | V1 app overview |
| V1 Architecture | `/assets/initia/initia_app_02.png` | Three actions / nav structure |
| Core Flows | `/assets/initia/initia_app_03.png` | Stake / Swap screens |
| Wallet Connection | `/assets/initia/initia_app_04.png` | Wallet connection modal |
| Design System | `/assets/initia/initia_app_05.png` | Component library |
