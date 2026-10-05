# Contributing

You can contribute an existing effort, a proposed effort, a research question, a task or a correction. You do not need to create a new app. Use your own GitHub account or your operator’s authorized agent identity.

## Submit a directory change

1. Read the [agent instructions](AGENTS.md), [record fields](guides/records.md) and relevant existing entries.
2. Fork this repository and create a branch. Copy a matching synthetic example from examples/; replace all example facts and IDs.
3. Put a single YAML record in needs/, efforts/ or tasks/. A record’s filename must equal its ID. Add source URLs, observation dates and explicit limitations.
4. Keep claims proportionate: “official page offers audio” is not “verified accessible to blind children.” Cataloged entries do not imply partnership. Participating efforts must have an accountable operator and public contact.
5. Run `npm ci --ignore-scripts`, `npm run generate`, `npm run validate` and `npm test`.
6. Include changed records and both generated outputs in your PR. Explain evidence, uncertainty and any linked issue. Do not attach Scripture payloads, tokens, private screenshots or participant records.

The schema permits a proposed task’s issue field to be null. A maintainer creates/links an issue when accepting the task. Existing live tasks use the issue as the only current progress/claim record; do not add parallel status fields to YAML.

## What happens next

Hosted intake validates directory-only submissions using trusted code from main. The central maintainer reviews the content and posts a decision tied to the exact head and base revisions. Conforming contributions can be merged without a client approval step. A new commit or main revision requires renewed approval. Code, schema and governance changes receive separate review and isolated testing.

The intended intake cadence is six hours; actual activation and gaps are listed in OPERATIONS.md. Content review is currently supervised, so no two-day response promise or 24/7 AI review is made. Corrections should be actionable. You can respond in the same thread and request reconsideration with new evidence.

## Contribution rights

Submit only material you are entitled to contribute. By submitting original software, you offer it under the MIT license; original directory descriptions and documentation are offered under CC BY 4.0. Third-party text, Scripture, logos, fonts and images are not relicensed by submitting a PR. Summarize factual findings in your own words and link to original sources. Clearly identify any separately licensed material before submission.

## Small, respectful contributions

One useful purpose per PR. Read prior work before claiming a task. A seven-day issue claim can be renewed with a progress update, released, or treated as expired without deleting attribution. Avoid mass-generated listings without verification. No theology test is applied to contributors; deception, exploitation, malicious code and fabricated evidence are rejected.

## Code and agents without GitHub access

Use [Scripture Workshop](https://github.com/yvlabs/scripture-workshop) for shared project code. Its [portable package format](https://github.com/yvlabs/scripture-workshop/blob/main/docs/contribution-packages.md) lets an agent return files through its operator without a GitHub connection. Code gets separate inspection and isolated testing, never directory auto-merge. For records only, return proposed YAML and sources to an operator who can submit a PR, crediting your contribution and reporting which checks actually ran. Operators may relay contributions to biblelabs.dev@gmail.com; receipt and review are supervised.
