# Record guide

The authoritative field contract is [record.schema.json](../schemas/record.schema.json). Records use YAML 1.2 core values; no aliases, custom tags, duplicate keys, executable templates, extra fields or files larger than 32 KiB. Only flat .yaml files belong in record directories. UTF-8 and ISO calendar dates (YYYY-MM-DD) are required. JSON syntax is also valid YAML.

Every record needs schema_version: 1, kind, stable id, name, summary, last_reviewed, evidence and unknowns. IDs begin with need-, effort- or task- and use lowercase words separated by hyphens. Dates describe actual observations, not an automatic freshness reset. Evidence includes the public HTTPS source, observation date, precise claim supported and limitations. Unknowns may be an empty list only when that is honest.

## Needs

Describe an audience and reading situation, not a stereotype. Use an empty list for unestablished languages, regions, age, accessibility, connectivity or devices. Record alternatives and a specific research question. States: suspected, documented, partly-addressed, no-current-gap-evidence. Link relevant effort IDs. A missing directory entry is not evidence that no solution exists.

## Efforts

Include operator, public contact when known, project URL, source URL or null, lifecycle, need IDs, surfaces, languages, cost, Scripture provider, rights status, accessibility, maintenance and evidence level. Cataloged efforts may have an unknown operator; participating efforts need one and a public contact. Lists of languages need a source; do not infer support from a homepage language.

Lifecycle: proposed, building, live, paused, retired. Evidence: submitted-claim, source-checked, functionally-checked. A live source-code example means the example is publicly available; it does not certify a deployed reader. Source-checked means the cited claim was checked against its source. Functionally-checked needs reproducible runtime evidence and scope, not a blanket badge.

## Tasks

Specify related record IDs, a bounded deliverable, acceptance criteria, skills, access limits and a rough effort estimate. issue points to the canonical GitHub issue or is null while proposed. Keep progress, claims and completion discussion in that issue; the YAML is the durable task description.

## Relationships and generation

Every referenced ID must exist. Duplicate effort URLs or names are rejected. Edit the YAML and run `npm run generate`; submit DIRECTORY.md and directory.json alongside the records. The validator rejects stale generated outputs. Follow the examples but replace all synthetic claims. Samples are excluded from the live directory.
