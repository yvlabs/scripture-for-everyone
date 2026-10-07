# Contributing

You can contribute an existing effort, a proposed effort, a research question, a task or a correction. You do not need to create a new app or connect a GitHub account.

## Starting from a one-line request

“Contribute something to https://github.com/yvlabs/scripture-for-everyone” means choose and deliver one useful contribution. Follow [the agent procedure](AGENTS.md#when-the-operator-says-contribute-something) without requiring a longer operator prompt. The default route below handles delivery without a personal repository or account connection.

## Choose a delivery route

The default POC route uses [anonymous Google submissions](guides/google-submissions.md). Build in a local public clone, upload a bounded git diff package, and let our collector create the branch and PR. You need Git, Node.js 22+ and outbound HTTPS; the contributor needs no GitHub or Google account and no personal repository.

If your tools already support GitHub contribution and your operator authorizes a personal fork, follow the optional [fork-and-PR guide](guides/github-contribution.md). `yvlabs` is the separate upstream maintainer. Do not ask the operator to own it, grant integration access there or obtain collaborator permissions.

## Submit a directory change

1. Read the [agent instructions](AGENTS.md), [record fields](guides/records.md) and relevant existing entries. Check public task issues and existing claims; link the task in your summary if you cannot comment.
2. Clone publicly and create a local branch from current main. Record the full main commit SHA before changing files. Copy a matching synthetic example from examples/; replace all example facts and IDs.
3. Put a single YAML record in needs/, efforts/ or tasks/. A record's filename must equal its ID. Add source URLs, observation dates and explicit limitations.
4. Keep claims proportionate: “official page offers audio” is not “verified accessible to blind children.” Cataloged entries do not imply partnership. Participating efforts must have an accountable operator and public contact.
5. Run `npm ci --ignore-scripts`, `npm run generate`, `npm run validate` and `npm test`.
6. Include changed records and both generated outputs. Explain evidence, uncertainty and any linked issue. Do not attach Scripture payloads, tokens, private screenshots or participant records.
7. Follow [Google submissions](guides/google-submissions.md) to create and upload the diff package. Return the upload result, ID and receipt URL. When processed, the receipt reports rejection or a created PR. A local diff or successful pack operation alone is not delivery.

The schema permits a proposed task's issue field to be null. A maintainer creates/links an issue when accepting the task. Existing live tasks use the issue as the current progress/claim record; do not add parallel status fields to YAML.

## What happens next

The Google collector validates the upload mechanically and creates a PR; it does not execute submitted code or merge it. The existing directory intake validates directory-only PRs using trusted code from main. The central maintainer reviews the content and posts a decision tied to the exact head and base revisions. Conforming contributions can be merged without a client approval step. A new commit or main revision requires renewed approval. Code, schema and governance changes receive separate review and isolated testing.

Google upload collection and its POC limits are documented in guides/google-submissions.md. The separate directory-review cadence and gaps are listed in OPERATIONS.md. Content review is currently supervised, so no two-day response promise or 24/7 AI review is made. Corrections should be actionable. You can respond in the same thread and request reconsideration with new evidence.

## Contribution rights

Submit only material you are entitled to contribute. By submitting original software, you offer it under the MIT license; original directory descriptions and documentation are offered under CC BY 4.0. Third-party text, Scripture, logos, fonts and images are not relicensed by submitting a PR. Summarize factual findings in your own words and link to original sources. Clearly identify any separately licensed material before submission.

## Small, respectful contributions

One useful purpose per PR. Read prior work before claiming a task. A seven-day issue claim can be renewed with a progress update, released, or treated as expired without deleting attribution. Avoid mass-generated listings without verification. No theology test is applied to contributors; deception, exploitation, malicious code and fabricated evidence are rejected.

## Shared code and manual relay

Use [Scripture Workshop](https://github.com/yvlabs/scripture-workshop) for shared project code. Its anonymous Google route accepts a diff against a public local clone, with the same receipt-to-PR process. Code gets separate inspection and isolated testing, never directory auto-merge.

If an agent cannot run Git or upload and its operator explicitly chooses manual relay, the workshop's [portable snapshot format](https://github.com/yvlabs/scripture-workshop/blob/main/docs/contribution-packages.md) can carry files through that operator. For records only, return proposed YAML and sources to an operator who can relay them, crediting the contributor and reporting actual checks. Operators may email biblelabs.dev@gmail.com; email receipt and review are supervised. Do not substitute a relay silently or claim it was sent before delivery.
