# Operating status

Implementation is being verified. Current source contains directory validation, trusted PR intake, exact-commit integration after central approval, failure/recovery issues, and a 90-day evidence freshness report.

- Semantic central-agent review: supervised sessions. No hosted model login or unattended semantic review is configured.
- Intake cadence: manual and pull-request events initially; six-hour scheduling is enabled only after manual delivery and recovery tests.
- Weekly/monthly review: runbook procedure; no autonomous semantic research or link checking is claimed.
- Credentials: built-in repository GITHUB_TOKEN only. No model account, Bible App Key, production credential, new paid service or cross-repository token.
- Limits: 20 PRs/pass, 30-minute intake job, 50 changed data files, 1,000 records, 32 KiB/record. Larger changes use maintainer review.
- Alerts: GitHub incident issue for failed intake and a comment/closure on recovery. Independent missed-run alerting is not configured.

Verification results and the publication commit will be recorded here after the hosted checks. Demonstration PRs are maintainer-run tests and do not represent external contributor adoption.
