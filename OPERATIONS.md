# Operating status

Public repository launched on **2026-10-05**. It contains three source-checked effort entries, three explicitly suspected needs, five linked starter issues, contribution standards, a YouVersion guide and generated Markdown/JSON directories.

## Verified

- Local directory validation, reproducible generation and **25 tests** pass. Tests cover malformed records, unsafe markup, encoded credentials, untrusted commands, changed revisions, exact-commit merge/rejection, expired claims and maintainer boundaries. Dependency audit reported no vulnerabilities at launch.
- [Hosted repository checks](https://github.com/yvlabs/scripture-for-everyone/actions/runs/37372378581) passed all 25 tests and directory validation at commit `2b4d982`. Earlier run 37371748799 passed the prior 21-test revision.
- [PR #6](https://github.com/yvlabs/scripture-for-everyone/pull/6) demonstrated a real GitHub data contribution: stale approval was ignored, fresh content review was recorded, and the controller merged exact reviewed head `d7183e2` as `abb3a7e`.
- [PR #7](https://github.com/yvlabs/scripture-for-everyone/pull/7) demonstrated invalid-data rejection and closure without a merge.
- Those PR rehearsals ran through the actual controller from a supervised local session using the independent operator. They do **not** prove hosted token permissions, external contributor adoption or unattended AI review.
- Main has strict current-base `directory/validate` status protection, linear history and conversation resolution, with force pushes and deletion disabled. The owner retains direct integration authority. The hosted merge path still requires exact central approval.

## Current operating boundaries

Semantic central-agent review runs in supervised sessions. The public queue is included in the operator’s existing portfolio-review loop. No hosted model login or unattended semantic-review service is configured.

The Actions intake is available on PR events and manual dispatch. **Six-hour scheduling is not enabled yet.** GitHub’s [Actions runner-assignment incident](https://www.githubstatus.com/) delayed launch verification. The [manual failure drill](https://github.com/yvlabs/scripture-for-everyone/actions/runs/37372579944) and its incident/recovery path must complete before scheduled activation. Do not interpret queued runs or a workflow file as operational proof.

Credentials are limited to the built-in repository GITHUB_TOKEN in Actions. There is no model account, Bible App Key, production credential, new paid service or cross-repository token. The local identity was used for supervised verification, not introduced as a hosted runtime dependency.

Limits: 20 PRs/pass, 30-minute intake cap, 50 changed data files, 1,000 records and 32 KiB/record. Larger contributions use maintainer review. The job reports fixed outcomes and commit IDs rather than copying untrusted content into comments.

## Complete hosted activation

1. Observe a successful manual **Central intake** run using the repository token.
2. Complete the failure drill, verify its operations issue, dispatch recovery and verify the recovery comment and issue closure.
3. Repeat a harmless, maintainer-reviewed contribution through hosted intake to prove its exact-head merge permission. Keep the rehearsal labeled as such.
4. Then add the six-hour cron `23 */6 * * *` to intake.yml and observe its first scheduled run. Record that evidence here. Do not enable a paid runner or resume model authentication as an implied remedy for queue delays.
5. In weekly supervised maintenance, run `npm run freshness` and `npm run claims` (the latter needs an authorized GitHub token), inspect task progress, and verify links safely. Monthly, assess outcomes and burden.

GitHub issue-based failure reporting is implemented but delivery/recovery proof is pending. Independent missed-run alerts are not configured. Same-platform alerts cannot establish coverage during a complete GitHub outage. Release and activation claims must keep these limits explicit.
