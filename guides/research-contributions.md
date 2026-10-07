# Research and ideation contributions

General chatbots and coding agents can both help this mission. A useful contribution can be a researched idea, documented barrier, existing solution, correction or bounded implementation task. You do not have to build software. Prefer a finding that changes what someone should do next over a list of speculative apps.

## Produce one complete brief

Use this outline in Markdown or plain text. Replace prompts with findings; no Git or YAML knowledge is required to prepare it.

- **Title and contribution type:** research, proposal, catalog entry or correction.
- **Problem or reading situation:** who might benefit and in what circumstance. Label audience assumptions as hypotheses; demographic labels alone are not evidence of need.
- **Existing work and alternatives:** directory/task links checked, relevant products, what they already address and counterevidence. A missing directory entry does not prove a gap.
- **Evidence:** public source URLs, actual observation dates, precise supported claims and limitations. Separate official claims from checks you performed and your inferences. State sources you could not access.
- **Finding or proposed solution:** explain the concrete benefit and why this adds value. A finding that no new project is needed is welcome.
- **Feasibility and unknowns:** Scripture/version access, attribution and rights, accessibility, connectivity, privacy, distribution and maintenance where relevant. Do not invent an operator, community endorsement or tested accessibility.
- **Bounded next step:** a practical deliverable and acceptance criteria, or the smallest experiment that would resolve the key uncertainty. A proposal does not authorize a launch, spending or outreach.
- **Verification:** what you actually researched or tested, failures and checks not run. For research, source checks are verification; do not invent software tests.
- **Public credit and rights:** only identity/contact you are entitled to publish, material permissions and third-party licensing limitations. Do not attach private conversations, credentials, reader data or Scripture payloads.

No generated Scripture, Bible explanations, spiritual counsel or personalized verse recommendations. See [AGENTS.md](../AGENTS.md) for mission standards.

## Deliver with the tools you actually have

**Runtime with Git, Node.js 22+ and permitted outbound HTTPS:** convert the finding into appropriate needs/, efforts/ or tasks/ records using [the record guide](records.md) and examples. Proposed tasks can have a null issue; proposed efforts must remain honestly proposed. Run generation and validation and include the generated outputs. Follow [Google submissions](google-submissions.md) to upload the git-diff package. The current endpoint accepts that package format, not arbitrary plain text or this brief by itself.

**Browsing-only chatbot or runtime unable to upload:** prepare the complete brief, proposed YAML or patch as an attachment or copyable text. Label it **Prepared; not submitted**. State the specific missing capability. If your operator chooses manual relay, they can email it to biblelabs.dev@gmail.com, or post it through their authorized GitHub issue/PR tools. A maintainer reviews relayed material and can convert accepted findings into records/tasks, preserving attribution. Email handling and content review are supervised; no automatic ingestion or response-time promise is made. Never claim the maintainer has received it merely because it is downloadable in chat.

A browser, connector and code container can have different access. A read-only connector cannot submit, and browsing a URL does not demonstrate outbound writes from a container. Report observed errors precisely: DNS failure is not an HTTP rejection, and one environment's failure does not establish a vendor-wide restriction. Respect company allowlists and product permissions. Do not bypass them or request upstream ownership. If no permitted external write path exists, transfer requires an operator; README instructions cannot supply it.

## Review and acceptance

A prepared brief, received submission, created PR and accepted contribution are separate states. Maintainers check sources, alternatives, scope, privacy, rights and mission fit. They may accept a documented uncertainty, ask for corrections or reject unsupported claims. Content review currently happens in supervised sessions; an autonomous reviewer is not configured. Acceptance of a proposal does not mean its hypothesis is validated or its software has been built.
