# Initia App 2.0 — Redesigning for the Users Who Stayed

---

## Meta

| Field | Value |
|-------|-------|
| Role | Head of Product Design |
| Scope | Product Strategy · UX Architecture · Design System · Wallet UX |
| Context | 2024–2026 · Initia |

---

## Project Overview

### After Mainnet

V1 launched the ecosystem. It was designed for the user who had never touched a blockchain — a deliberate simplicity that reduced the decision surface to three actions: Stake, Swap, Vote. It worked. But mainnet changed the question.

The users creating the most value inside the ecosystem were not beginners. They were committed participants who had outgrown V1's simplicity — staking consistently, providing liquidity, participating in governance. They needed a different product.

### My Role

As Head of Design, I led the V2 redesign from the product strategy down — redefining the information architecture, overhauling the wallet experience, designing the portfolio and liquidity surfaces, and rebuilding the incentive system UX. V2 was a different kind of design problem than V1: not launching something new, but evolving something live.

---

## The Challenge

As Initia grew, the product grew with it — but not coherently. Each new chain, protocol, and financial primitive added another surface. What began as three clean destinations became a fragmented constellation of tools that required users to hold the entire ecosystem map in their heads.

The complexity users had to navigate:

1. Different chains, each with its own liquidity and asset state
2. Multiple wallet connections, each with different signing flows
3. Liquidity positions spread across pools with no unified view
4. Governance participation disconnected from staking and liquidity
5. Cross-chain transfers requiring users to know which bridge to use

The challenge was no longer designing individual screens. The challenge was designing coherence — a product that felt like one thing, even as the ecosystem underneath it grew into many.

---

## The Insight

Internally, Initia organized its products by technical function: Swap. Bridge. Wallet. Governance. Liquidity. But users rarely think in product categories. They think in goals — move my assets, see my portfolio, earn yield, participate.

The mismatch between how the product was organized and how users actually thought created friction at every step. Users were learning the system before accomplishing their task. Instead of helping users understand more concepts, we needed to reduce the amount of concepts they needed to understand.

> Users who stay eventually become power users.

This reframing shifted the focus from onboarding to retention — supporting users who had made a commitment to the ecosystem and needed the product to match their growing sophistication.

---

## Key Decisions

**01 — Portfolio as the product hub**
Portfolio became the central destination for understanding assets, positions, rewards, and on-chain activity. Users no longer needed to navigate three separate surfaces to answer one question: "Where do I stand?"

**02 — Information density by intent**
Rather than hiding complexity behind progressive disclosure, V2 surfaced relevant depth at the moment users were ready for it. APRs, pool depths, reward accrual, and position health appeared contextually — not buried.

**03 — Advanced liquidity management**
Pool-level data, APR breakdowns, reward tracking, and position management became first-class experiences. Power users running liquidity strategies had the information they needed without leaving the app.

**04 — Incentive systems made legible**
The Vested Interest Program (VIP) and Gauge Vote went through multiple redesigns to translate complex tokenomics into navigable UX. Stage, Cycle, Challenge Period, Allocation, and Claim were visualized as a coherent system — not a sequence of disconnected screens.

---

## Portfolio Hub

The portfolio surface unified what had been scattered across multiple destinations: asset balances, staking positions, liquidity contributions, reward accrual, and transaction history. For the first time, a user could answer "what am I doing in this ecosystem?" in one place.

This wasn't a dashboard bolted onto the existing architecture — it required rethinking how data flowed through the product. Positions, rewards, and asset states from multiple chains needed to be surfaced through a single coherent view, even when the underlying infrastructure was heterogeneous.

---

## Ghost Wallet

Wallet creation had been Web3's most consistent dropout point. The original Initia App required MetaMask, Rabby, Keplr, or Leap — each demanding installation, a seed phrase ceremony, and a mental model that most users didn't have.

V2 introduced Ghost Wallet: a native embedded wallet built on Privy's social login infrastructure. Users could create a wallet with a Google or Apple account — no extension, no seed phrase on day one, no prior crypto knowledge required.

> Web2 onboarding. Web3 ownership.

The design challenge wasn't technical — it was trust. Auto-sign, the feature that eliminated signature prompts for low-risk transactions, required users to grant meaningful permissions. The UX had to make that permission grant feel safe, transparent, and reversible: settings-controlled, clearly scoped, and easy to revoke.

---

## Incentive UX — VIP & Gauge Vote

The Vested Interest Program (VIP) and Gauge Vote system were among the most complex UX problems in the product — not because the flows were technically difficult, but because the underlying tokenomics were genuinely hard to understand.

VIP ran on Stages and Cycles. Each cycle had a Challenge Period. Allocations were calculated from historical participation. Claims had their own timing window. Each concept was meaningful, but together they created a system that even engaged users struggled to navigate.

The V2 approach was to visualize the system as a whole — not just the current state, but where a user was in the cycle, what actions were available, and what they were working toward. Stage and cycle context appeared on every relevant screen. Reward accrual was shown in real time. Allocation and claim timelines were displayed together so users could understand the relationship between participation and payout.

The goal was not simplification. The goal was legibility — translating a real reward system into UX that matched its actual complexity without hiding it.

---

## Outcome

V2 transformed the Initia App from an onboarding-focused product into a platform capable of supporting long-term ecosystem participants. Ghost Wallet removed the largest barrier to entry. The portfolio surface gave committed users a place to manage their ecosystem presence. The liquidity and incentive redesigns made advanced participation accessible without requiring users to hold context outside the product.

Together, V1 and V2 created a progression path that matched how users actually evolved inside the ecosystem — arriving simply, staying deeply.

### Impact

| Metric | Value | Context |
|--------|-------|---------|
| Testnet wallets | 190,000+ | The Build-a-Jennie campaign turned participation into a shareable loop — every interaction generated an artifact worth sharing, compounding reach without paid distribution |
| TVL in first month | $40M+ | Within the first month of mainnet, the ecosystem held over $40M in TVL. The product had to be ready for users arriving with that level of market attention |
| TGE listing | Binance Launchpool | INIT launched on Binance Launchpool at TGE — establishing Initia's position in the market from day one and bringing a new wave of users into the product |
| Design system adoption | 95% | Component coverage across V1 surfaces within the first product cycle — new screens assembled from existing pieces, consistency held without manual review |

> V1 reduced the decision surface. V2 expanded what users could do with it.

---

## Image Slots

| Slot | Path | Content |
|------|------|---------|
| Hero | `/assets/initia/initia_app2_01.png` | V2 redesigned overview |
| Portfolio Hub | `/assets/initia/initia_app2_02.png` | Portfolio surface |
| Ghost Wallet | `/assets/initia/initia_app2_03.png` | Social login / auto-sign UX |
| VIP / Gauge Vote | `/assets/initia/initia_app2_04.png` | Incentive UX |
