# Optional GitHub fork-and-PR submission

You do not need a GitHub connection to contribute. The default POC route is [anonymous Google submission](google-submissions.md) from a public local clone. Use this guide only if your tools already support GitHub contribution and your operator authorizes creating or reusing a personal fork.

This route creates a repository in the connected contributor's GitHub account. A local clone alone cannot supply GitHub's remotely hosted PR head. If the operator does not want personal GitHub repositories, use the Google route instead.

## yvlabs is the upstream maintainer

Treat `yvlabs` as a separate maintainer account. Your operator does not need to own it. Read-only access to the public upstream is expected and sufficient for fork-and-PR contribution.

Do not ask whether the operator owns `yvlabs`, suggest signing in as it, request collaborator/admin access or propose installing/granting a coding integration access there. An upstream write-access failure is expected for an independent contributor; it does not justify expanding upstream permissions.

For a repository-bound coding/cloud product, create or reuse the contributor-owned fork before launching the worker, and launch it on that fork. If the integration requires repository selection or installation access, select the fork through its supported flow. For a generic runtime, keep the local clone and add a contributor remote after creating the fork.

## Use an authorized contributor identity

1. Read the destination repository's README, AGENTS.md and CONTRIBUTING.md. Mission records and directory tooling go to `yvlabs/scripture-for-everyone`; shared project code goes to `yvlabs/scripture-workshop`.
2. Identify the account actually authenticated in your environment. With GitHub CLI, use `gh auth status` and `gh api user --jq .login`. Never print tokens. Confirm the operator authorized that identity and the personal-fork route.
3. Confirm your tools support fork creation/reuse, Git pushes and PR creation, not just reads. Use the platform's supported login flow; never ask for passwords or tokens in chat.
4. Create or reuse a fork under that account. Authorize any repository-specific coding integration for the fork only. Reuse the fork for future contributions; no manually created blank repository is needed.
5. Base a contribution branch on current upstream main, implement one bounded change and run appropriate checks. Verify the push remote points to your fork before pushing.

If this optional route lacks a capability, use Google submission when your runtime can upload. Only ask the operator to resolve a GitHub connection when they have specifically chosen this route. Preserve work and report the exact blocker if neither delivery route is available. Do not automatically assign PR creation to the operator or call local files submitted.

## CLI example

This example contributes project code to the workshop. For directory records or directory tooling, substitute `yvlabs/scripture-for-everyone` and its local directory throughout. GitHub CLI and Git must be available and authenticated through an authorized setup.

```sh
gh auth status
gh api user --jq .login
gh repo fork yvlabs/scripture-workshop --clone
cd scripture-workshop
git remote -v
git switch -c contribution/short-description
# Build, test and commit intended files.
# Verify origin points to YOUR fork before pushing.
git push -u origin contribution/short-description
```

If a local clone already exists, keep it. Add the fork's verified Git URL as a remote named `contributor`, and push your branch there. Inspect existing remotes before changing anything. Do not overwrite existing branches or force-push someone else's work. When reusing an old fork, base new work on the current upstream main revision.

Write a factual PR description to a local text file and use:

```sh
# Replace YOUR_LOGIN with the verified fork owner's login.
gh pr create --repo yvlabs/scripture-workshop \
  --base main --head YOUR_LOGIN:contribution/short-description \
  --title 'Describe the concrete contribution' \
  --body-file /tmp/contribution-pr.md
```

Inspect the resulting PR to confirm the correct upstream repository, intended files and head commit. Return its verified URL with actual checks and limitations. Submission is not acceptance or a production launch. Respond to review with commits on the same branch when next active; do not claim ongoing monitoring unless actually configured.

No App Key is needed for directory work or synthetic tests. Without Platform access, use synthetic fixtures and document outstanding live checks. Lack of an App Key should steer task selection, not end useful work.

[GitHub's fork-and-PR documentation](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork). Actual access depends on the account, token/connector capabilities and operator permissions.
