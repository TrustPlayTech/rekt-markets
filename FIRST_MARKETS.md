# Designing High-Quality Prediction-Market Questions to Launch Now

## Executive summary

This report proposes a ranked portfolio of ten prediction-market questions that are “launchable now” (as of March 27, 2026, Europe/Stockholm) and optimized for **clean wording, objective resolution, and high tradability**. The set is deliberately diversified across **macro, finance, AI/tech, biotech, geopolitics, climate, and culture**, because cross-domain portfolios tend to attract broader participation and reduce single-theme liquidity cliffs.

The strongest candidates share three properties: (a) **scheduled or well-defined resolution windows** (e.g., monthly CPI releases, major tournaments, annual climate releases), (b) **primary/official resolution sources** (e.g., government statistical agencies, central bank implementation notes, regulator decisions, and official competition results), and (c) **clear edge-case handling** (revisions, timing, naming conventions, and fallback sources). For example, the **U.S. CPI** (published monthly by the statistical agency) and **federal funds target range decisions** (published after FOMC meetings) are exceptionally verifiable and tradable because the market can reprice frequently as new information arrives. citeturn0search14turn13search1turn1view0

Two cross-cutting constraints matter for “create right now” decisions:

* **Regulatory uncertainty and platform risk**: U.S. prediction-market platforms have faced escalating scrutiny, including state actions and proposed federal restrictions—especially around **sports** contracts. This does not forbid creation in general, but it materially affects **expected liquidity and legal risk** depending on jurisdiction and platform. citeturn8news41turn8news42turn8search17  
* **Insider-trading and manipulation concerns**: Recent controversy around trading on geopolitical outcomes has increased attention on market integrity controls (participant restrictions, surveillance, and explicit rules). This is most acute for **active conflicts** and **near-term regulatory or FDA decisions**. citeturn4news40turn8news41

## Evaluation framework

The candidates were evaluated on the dimensions you requested:

**Clarity** (binary wording that avoids hidden conditions), **time horizon** (expiry aligned to a resolution source’s publication), **tradability/liquidity potential** (frequency of informational updates + size of interested audience), **information value** (does the price meaningfully summarize a high-impact uncertainty), **measurability/verifiability** (primary sources; low dispute surface), **novelty vs. redundancy** (risk of being “yet another” market), **ethical/legal risks**, **manipulation vulnerability**, **expected participant base**, and **contract type + initial price range**.

Two design patterns strongly improve adjudication quality:

1. **Define the measurement and the document** that resolves the market (e.g., “12‑month percent change CPI‑U, all items, as published in the CPI news release”). citeturn13search21turn13search9  
2. **Use a resolution time buffer** after the event (e.g., close 7–14 days after the deadline) to allow for official publication, corrections, and dispute handling.

Finally, “novelty” is assessed relative to what is already heavily traded. For instance, major platforms already list large inventories of macro/geopolitics markets (e.g., hundreds of rate-related markets and sizeable volumes), which can be good for liquidity but increases redundancy on generic formulations. citeturn4search16turn4search24

## Ranked market candidates

1. **U.S. inflation anchor: December 2026 CPI above 3%**

   **Exact proposed market wording:**  
   “Will the CPI‑U (Consumer Price Index for All Urban Consumers), All Items, 12‑month percent change for **December 2026** be **greater than 3.0%**, as reported by the entity["organization","U.S. Bureau of Labor Statistics","us labor statistics agency"]?”

   **Expiry (market close):** 2027‑01‑31 23:59 UTC (gives time for the January 2027 CPI release and any immediate clarifications). citeturn0search14turn13search9

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if the 12‑month percent change (not seasonally adjusted) in the CPI news release for December 2026 is strictly > 3.0%. Resolve **NO** otherwise. Use (1) the CPI news release PDF/HTML for the December 2026 reference month, and (2) the CPI homepage as a cross-check. citeturn13search21turn13search9

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.25–0.45** (seed near the middle to invite two-sided liquidity; the market can quickly converge as monthly prints arrive).

   **Concise rationale:** CPI is a premier macro signal with broad stakeholder relevance (households, investors, policymakers). It is released on a known schedule and has a clean, official resolution criterion, which minimizes adjudication disputes. citeturn0search14turn13search9  
   Tradability is strong because the contract reprices after each monthly CPI print, not just at expiry, giving continuous informational flow. Ethical/legal risk is low compared with conflict or election markets, and manipulation is limited because the outcome is produced by a statistical agency under established methodology rather than discretionary announcement.

   **Risk notes:** Main disputes come from (a) “which CPI measure?” and (b) revisions. Pre-commit to CPI‑U All Items and to the first published 12‑month figure in the release for December 2026 (or explicitly allow same-day corrections, if any).

2. **AI capability milestone: a generally available 1M‑token API context**

   **Exact proposed market wording:**  
   “Will entity["company","OpenAI","ai research company"] list **any** API model with a documented maximum context window of **at least 1,000,000 tokens** that is **generally available (not limited preview / experimental)** by **2026‑12‑31 23:59 UTC**?”

   **Expiry (market close):** 2027‑01‑07 23:59 UTC (buffer for documentation updates holiday week).

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if, by the deadline, OpenAI’s official model documentation or a first-party product announcement explicitly states a maximum context window ≥ 1,000,000 tokens for an API model, and the availability language indicates general access rather than experimental/limited access. Resolve **NO** otherwise. (The current frontier model announcement notes experimental 1M context support in Codex for GPT‑5.4, making this a concretely grounded milestone.) citeturn18view1turn18view2

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.40–0.60** (balanced seed; meaningful uncertainty around “experimental → generally available” transitions).

   **Concise rationale:** This market is unusually high-quality for AI/tech because it resolves on **first-party documentation**, not on subjective performance claims. It is also liquid-friendly: developers follow model release notes closely, and OpenAI’s recent cadence of frontier releases and feature expansions makes the question salient. citeturn18view1turn18view2  
   Novelty is higher than standard “will model X launch” questions because it targets a **specific product capability threshold** with strong business significance (agentic workflows, large-codebase ingestion, long-context retrieval).

   **Risk notes:** The key ambiguity is “generally available.” Mitigate by defining GA as: “available to all paid API accounts without application/whitelist and not labeled experimental/beta/limited preview in docs.”

3. **Macro pivot risk: at least one Fed rate hike before year-end**

   **Exact proposed market wording:**  
   “Will the target range for the federal funds rate be **raised at least once** (i.e., the **upper limit increases**) in an FOMC action dated **after 2026‑03‑27 and on or before 2026‑12‑31**?”

   **Expiry (market close):** 2027‑01‑07 23:59 UTC (buffer for year-end verification).

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if any entity["organization","Federal Open Market Committee","us monetary policy committee"] implementation note/press release specifies an upper-limit target range higher than the current 3.75% upper bound (as of the March 2026 implementation note), within the specified window. Resolve **NO** otherwise. Use the official implementation notes as primary; the New York Fed’s explanation of target range announcements supports interpretability. citeturn13search1turn13search8turn1view0

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.20–0.40** (two-sided seed; macro uncertainty is elevated amid geopolitical-energy shocks and inflation dynamics).

   **Concise rationale:** Rate decisions are among the most traded macro uncertainties and are cleanly resolvable from official statements. The underlying policy lever is mechanically defined (target range), and meeting dates are known in advance, improving tradability. citeturn1view0turn13search8  
   Liquidity potential is supported by the demonstrated market appetite for rate-related contracts (large inventories and high aggregate volumes on major platforms). citeturn4search16turn4search24

   **Risk notes:** Insider risk exists for market participants with privileged policy access; mitigate with restricted participant classes (mirroring industry moves to tighten insider-trading rules). citeturn8news41

4. **Biotech catalyst: FDA approval of an oral obesity GLP‑1 (orforglipron)**

   **Exact proposed market wording:**  
   “Will the entity["organization","U.S. Food and Drug Administration","us drug regulator"] approve **orforglipron** for **chronic weight management** (overweight/obesity indication) **by 2026‑04‑30 23:59 UTC**?”

   **Expiry (market close):** 2026‑05‑07 23:59 UTC (buffer for publication lag).

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if FDA publishes an approval action (approval letter, press release, or Drugs@FDA entry) for orforglipron with an obesity/weight-management indication by the deadline. Resolve **NO** otherwise. The company describes orforglipron as investigational and submitted for obesity review, and reporting indicates an FDA decision expected in early Q2 2026. citeturn13search6turn7view0

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.55–0.80** (seed above 50% given public guidance about review progress, but keep room for downside risk).

   **Concise rationale:** This is a near-dated, widely followed biotech decision with meaningful real-world impact (treatment access, competitive dynamics in GLP‑1s). The outcome is objectively verifiable via FDA actions, producing low adjudication ambiguity compared with “trial success” markets. citeturn13search6turn7view0  
   Tradability is strong in a short window because new information arrives via regulatory newsflow, company statements, and healthcare-market analysis, and the contract resolves quickly.

   **Risk notes:** Elevated **insider-trading vulnerability** (company employees, contractors, regulators). Implement trading restrictions for employees/contractors and enhanced surveillance.

5. **Crypto benchmark: Bitcoin above $150k at year-end (BRR)**

   **Exact proposed market wording:**  
   “Will the CME CF Bitcoin Reference Rate (BRR) be **≥ $150,000** at **4:00 p.m. London time** on **2026‑12‑31**?”

   **Expiry (market close):** 2026‑12‑31 23:59 UTC (or close immediately after the BRR print is published that day).

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if the BRR published for the relevant date/time is ≥ 150,000; otherwise **NO**. BRR is defined as a daily USD reference rate for one bitcoin as of 4:00 p.m. London time; methodology and benchmark publication are documented by CME/CF Benchmarks. citeturn9search3turn9search0turn9search6

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.20–0.35** (large tail risk and high volatility; seed lower to reflect a high threshold while preserving two-sided participation).

   **Concise rationale:** This market is highly liquid-friendly because crypto has a massive participant base and continuous price discovery, with a clean benchmark for adjudication. Unlike “spot price on exchange X,” BRR is designed as a standardized reference rate used for settlement in existing derivatives, which improves verifiability and reduces exchange-specific disputes. citeturn9search0turn9search3  
   It is somewhat redundant (many platforms list BTC price markets), but still among the most reliably liquid formats.

   **Risk notes:** Market manipulation vulnerability is **moderate**: high-leverage venues can move prices, but BRR’s benchmark construction and institutional use lowers single-venue risk relative to an arbitrary exchange print. citeturn9search3turn9search6

6. **Culture/sports macro-outcome: a UEFA winner at the 2026 World Cup**

   **Exact proposed market wording:**  
   “Will the champion of the entity["sports_event","FIFA World Cup 2026","canada mexico usa 2026"] be a team whose national association is a member of entity["organization","UEFA","european football confed"]?”

   **Expiry (market close):** 2026‑07‑20 23:59 UTC (after the final on July 19, 2026). citeturn14search17turn14search8turn15search1

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if FIFA’s official competition page lists a UEFA member association as tournament winner; **NO** otherwise. Tournament dates and official fixtures/results are published by entity["organization","FIFA","world football governing body"]. citeturn14search17turn14search1turn14search8

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.55–0.70** (balanced but modestly >50% seed, reflecting historical European strength without requiring a single-team bet).

   **Concise rationale:** This is a “mass audience” contract that can attract non-technical participants and generate high liquidity around a globally salient event. Because it is defined at the confederation level, it avoids fragmentation across dozens of team-specific outrights while still capturing a meaningful macro uncertainty. citeturn14search8turn15search1  
   Verifiability is very strong because FIFA publishes the winner and match results on official channels.

   **Risk notes:** **Legal risk can be materially higher** on some U.S.-regulated platforms due to active policy efforts targeting sports-event contracts; evaluate jurisdiction/platform before listing. citeturn8news41turn8news42

7. **Geopolitics: Russia–Ukraine ceasefire agreement signed and effective by year-end**

   **Exact proposed market wording:**  
   “Will entity["country","Russia","country"] and entity["country","Ukraine","country"] sign **and publicly confirm** a bilateral ceasefire agreement that **enters into force** by **2026‑12‑31 23:59 UTC**?”

   **Expiry (market close):** 2027‑01‑15 23:59 UTC (buffer for document publication).

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if (a) a signed ceasefire agreement is publicly released by either government (or filed with an official international body), and (b) both governments publicly confirm the agreement has entered into force by the deadline. Resolve **NO** otherwise. Context: reporting indicates peace talks have been attempted and stalled amid continued military operations. citeturn11search0turn11search20turn11search4

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.25–0.40** (aligns with the “real but uncertain” character of negotiations; seed mid-low).

   **Concise rationale:** This is extremely high information value: the existence of a signed, effective ceasefire is a discontinuous geopolitical regime change with significant economic and humanitarian implications. It is also demonstrably liquid on existing markets (numerous ceasefire markets with sizable activity), indicating a large participant base. citeturn4search22turn4search6  
   The “signed + effective + publicly confirmed” structure improves clarity compared with “ceasefire happens,” which can become mired in ceasefire-violation semantics.

   **Risk notes:** Ethical sensitivity and insider-trading vulnerability are **high**. Consider listing only if your platform has strong integrity controls (KYC, surveillance, and restricted classes) and avoids perverse incentives. citeturn8news41turn4news40

8. **Breaking-news geopolitics: mutual U.S.–Iran ceasefire confirmation**

   **Exact proposed market wording:**  
   “Will entity["country","United States","country"] and entity["country","Iran","country"] each issue an official public statement confirming a ceasefire / cessation of hostilities between them that is **in effect** by **2026‑05‑31 23:59 UTC**?”

   **Expiry (market close):** 2026‑06‑07 23:59 UTC.

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if both governments (or official spokespersons) publicly confirm a ceasefire/cessation of hostilities is in effect by the deadline. Resolve **NO** otherwise. Reporting indicates ongoing fighting and negotiations/pauses, but with conflicting claims about talks and ceasefire terms. citeturn11search12turn11search1turn11search33

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.25–0.45** (high uncertainty and rapid newsflow; seed near the middle).

   **Concise rationale:** This is a high-tradability “fast market” because the outcome can shift quickly with diplomacy and military events, and it directly affects macro variables like energy prices. The two-sided confirmation requirement reduces disputes versus “Trump pauses strikes” style partial measures. citeturn11search12turn11search34  
   It is also a real-world stress test for market integrity: credible accounts of suspicious trading behavior around conflict outcomes suggest heightened scrutiny and the need for stronger controls. citeturn4news40turn4news42

   **Risk notes:** Ethical/legal risk is **very high**, as are insider-trading and manipulation concerns. Industry has recently tightened insider-trading rules amid legislative pressure; incorporate similar bans for officials and military-linked participants. citeturn8news41

9. **Tech regulation: first monetary fine under the EU AI Act**

   **Exact proposed market wording:**  
   “Will any EU authority publish a **final decision imposing a monetary fine** under the EU’s AI Act (Regulation (EU) 2024/1689) by **2026‑12‑31 23:59 UTC**?”

   **Expiry (market close):** 2027‑01‑31 23:59 UTC (buffer for publication timelines).

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if a regulator (EU-level or Member State competent authority) publishes a final decision explicitly grounded in the AI Act that imposes a monetary fine by the deadline. Resolve **NO** otherwise. Enforcement is scheduled to begin for the majority of rules on 2 August 2026, per the Commission’s AI Act timeline. citeturn20view0turn19view1

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.10–0.25** (enforcement starts in August 2026, leaving a narrower window for a first published fine).

   **Concise rationale:** This market has high information value for compliance and enterprise risk because “first fine” is a focal event that shapes expectations about enforcement aggressiveness. It is also relatively novel compared to saturated “model launch” markets, and the timeline is documented by an official EU portal. citeturn20view0turn19view1  
   Tradability is moderate: there may be fewer “priced updates” than CPI or rates, but significant repricing can occur around authority designations, investigative announcements, and high-profile cases.

   **Risk notes:** Watch for timeline changes driven by EU “simplification” discussions; the same official policy page notes proposals affecting implementation timing for high-risk rules. citeturn19view1turn20view0

10. **Climate signal: NASA declares 2026 the warmest year on record**

   **Exact proposed market wording:**  
   “Will entity["organization","NASA","us space agency"] rank **2026** as the **warmest year on record** in its annual global temperature analysis, released by **2027‑01‑31 23:59 UTC**?”

   **Expiry (market close):** 2027‑01‑31 23:59 UTC.

   **Resolution criteria and sources (primary first):**  
   Resolve **YES** if NASA’s annual global temperature release for 2026 states that 2026 is the warmest year in the record; resolve **NO** otherwise. NASA’s temperature releases and GISTEMP news log provide an official basis for annual rankings (e.g., NASA’s January 2026 release describing 2025 relative to 2024). citeturn17search1turn17search0turn5search3

   **Suggested contract type:** Binary (Yes/No).

   **Suggested initial price range:** **0.15–0.30** (records are plausible but still a high bar; seed low-mid).

   **Concise rationale:** Climate “record year” markets are highly verifiable and ethically cleaner than conflict markets, with a large public audience and clear scientific reporting. They also provide real information value: the market probability becomes a compact signal of how traders interpret evolving drivers (ENSO state, ocean heat, aerosol changes). NASA’s annual method and repeated annual releases make resolution comparatively dispute-resistant. citeturn17search1turn5search3  
   Tradability is moderate rather than maximal because the contract’s key resolution is annual, but it can still reprice with monthly anomalies and climate bulletins.

   **Risk notes:** Define the source tightly (NASA annual global temperature analysis) to avoid cross-dataset disagreements (NASA vs. Copernicus vs. others). citeturn17search5turn16view1

## Comparative table and portfolio view

The table below compares the ten markets on the requested dimensions using a **1–5** scale (higher is better) for *clarity, liquidity potential, information value, verifiability, and novelty*. Ethical/legal risk and manipulation vulnerability are qualitative (L/M/H), because risk is context-dependent and platform-dependent.

| Rank | Short name | Category | Contract type | Expiry (UTC) | Clarity (1–5) | Liquidity potential (1–5) | Info value (1–5) | Verifiability (1–5) | Novelty (1–5) | Ethical/legal risk | Manipulation vulnerability | Expected participant base | Suggested initial price |
|---:|---|---|---|---|---:|---:|---:|---:|---:|---|---|---|---|
| 1 | Dec 2026 CPI > 3.0% | Macroeconomics | Binary | 2027‑01‑31 | 5 | 5 | 5 | 5 | 2 | L | L | Broad | 0.25–0.45 |
| 2 | OpenAI 1M‑token GA API model | Tech / AI | Binary | 2027‑01‑07 | 4 | 4 | 4 | 4 | 4 | L | L | Broad | 0.40–0.60 |
| 3 | Fed hikes at least once (after Mar 27) | Macroeconomics | Binary | 2027‑01‑07 | 5 | 5 | 5 | 5 | 1 | M | M/H | Broad | 0.20–0.40 |
| 4 | FDA approves orforglipron by Apr 30 | Biotech | Binary | 2026‑05‑07 | 5 | 4 | 4 | 5 | 3 | M | H | Broad–Specialized | 0.55–0.80 |
| 5 | BTC BRR ≥ $150k on 2026‑12‑31 | Finance / Crypto | Binary | 2026‑12‑31 | 5 | 5 | 4 | 4 | 2 | L | M | Mass | 0.20–0.35 |
| 6 | UEFA wins World Cup 2026 | Culture / Sports | Binary | 2026‑07‑20 | 5 | 5 | 3 | 5 | 2 | M/H (platform) | M | Mass | 0.55–0.70 |
| 7 | Russia–Ukraine ceasefire signed+effective | Geopolitics | Binary | 2027‑01‑15 | 4 | 5 | 5 | 3–4 | 2 | H | H | Mass | 0.25–0.40 |
| 8 | U.S.–Iran mutual ceasefire confirmed | News / Geopolitics | Binary | 2026‑06‑07 | 4 | 5 | 5 | 3–4 | 3 | H | H | Mass | 0.25–0.45 |
| 9 | First EU AI Act fine by end‑2026 | Tech / Regulation | Binary | 2027‑01‑31 | 4 | 3 | 4 | 4 | 4 | L/M | L/M | Specialized–Broad | 0.10–0.25 |
| 10 | NASA: 2026 warmest year on record | Climate | Binary | 2027‑01‑31 | 5 | 3 | 4 | 5 | 3 | L | L | Broad | 0.15–0.30 |

Portfolio implications:

* If you anticipate **U.S. regulatory constraints**, the biggest portfolio fragility is the sports market, and possibly some entertainment markets, depending on jurisdiction. Explicitly evaluate the platform’s permitted contract classes. citeturn8news41turn8news42  
* If you anticipate **integrity scrutiny**, the biggest fragility is **active-conflict markets**; they likely require the strictest participant restrictions and surveillance. citeturn4news40turn8news41

## Adjudication and integrity design

A robust adjudication spec should read like a checklist: *exact data series*, *exact endpoint*, *timezone*, *primary source*, *fallback sources*, and *revisions policy*. Several of the proposed markets intentionally rely on “single-source” truth (BLS CPI release, FOMC implementation note, NASA annual release, FIFA results) because this reduces discretionary judgment and dispute escalation. citeturn13search21turn13search1turn17search1turn14search1

Below is a reusable adjudication flow that can be attached (with minor edits) to most of the markets above:

```mermaid
flowchart TD
  A[Market created with exact wording + deadline + timezone] --> B[Primary source specified]
  B --> C{Is primary source published by deadline?}

  C -- Yes --> D[Extract metric / decision exactly as defined]
  D --> E{Edge cases? revisions, naming, time cutoff}
  E -- No --> F[Resolve outcome + publish evidence]
  E -- Yes --> G[Apply precommitted edge-case rules]
  G --> F

  C -- No --> H[Use fallback sources (precommitted list)]
  H --> I{Fallback sufficient and consistent?}
  I -- Yes --> F
  I -- No --> J[Delay resolution window OR resolve as No if rule says so]
  J --> F

  F --> K[Dispute window + audit trail]
  K --> L[Final settlement + archived sources]
```

Integrity controls (especially relevant for Markets 4, 7, and 8):

* **Restricted participant classes** for those directly involved (regulators, company employees/contractors, athletes/officials) and explicit bans on trading on confidential information. Recent industry actions and legislative pressure underscore why these are no longer optional for credibility. citeturn8news41turn8news44  
* **Surveillance and anomaly disclosure**: requiring public trade transparency and adding a “flag suspicious activity” mechanism can reduce manipulation and increase user trust (some platforms have moved in this direction). citeturn8news44turn4news42  
* **Jurisdictional gating**: because U.S. state actions and proposed federal restrictions create platform-dependent legality risk, you may need geo-fencing, contract-class filtering, or alternative non-U.S. venues for certain categories (especially sports). citeturn8news42turn8search17turn8news41