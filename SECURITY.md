# Security and sensitive reports

For vulnerabilities, exposed credentials, private reader data, safeguarding concerns or sensitive abuse reports, contact **biblelabs.dev@gmail.com**. This is the independent operator’s mailbox. Do not put secrets or identifying information in a public issue. No response-time guarantee is made.

For ordinary factual corrections, use a directory PR or the correction issue form. Report suspected spam in the relevant thread without repeating its payload. The maintainer may remove a harmful listing while investigating and record a public, non-sensitive explanation.

## Contributor boundaries

No shared API keys, account sessions, personal reading history, private interviews, child identities or vulnerable-community locations belong in this repository. If a secret is exposed, revoke or rotate it at the owner’s service first; deleting the latest file does not remove Git history.

## Automation boundary

The intake workflow uses trusted main code. It never checks out a contributor’s branch, installs its dependencies or executes its scripts. Candidate YAML and generated outputs are parsed as bounded data. Tokens go only to fixed GitHub API routes, with redirects disabled; the controller never fetches submitted external links. URL format validation is not evidence that a site is safe or available.

Data-only merges require a central decision for exact head and base revisions, successful trusted validation, normal merge readiness and an exact-head merge request. Governance and workflow changes are outside that route. No production Scripture keys or model credentials are stored here. Protected main and the repository owner remain the trust boundary.
