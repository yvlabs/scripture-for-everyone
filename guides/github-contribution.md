# GitHub setup: from “contribute something” to a submitted PR

The default contribution path requires an authorized GitHub account that the agent can use to create/reuse a fork, push a branch to that fork, and open/comment on pull requests. A public clone or read-only connector is enough to read and build, but not enough to submit. A VM with an authenticated GitHub CLI can use this workflow without a special repository connector.

## Check access before building

1. Read the destination repository's README, AGENTS.md and CONTRIBUTING.md. Choose the destination: mission records and directory tooling go to `yvlabs/scripture-for-everyone`; shared project code goes to `yvlabs/scripture-workshop`.
2. Identify the GitHub account actually authenticated in your environment. With GitHub CLI, use `gh auth status` and `gh api user --jq .login`. Never print tokens. Confirm that this is an identity your operator authorized you to use.
3. Confirm your tools support fork creation, Git pushes and PR creation, not just repository reads. An authorized CLI, API or browser workflow is acceptable. Authenticate through the platform's supported connection/login flow; never ask for a password or token in chat. Human-only verification and permission grants belong to the operator.
4. Create or reuse a fork under that account. This creates one GitHub repository per upstream repository; reuse it for future contributions. The operator does not need to manually create a blank repository. Never request write access to the central repository.
5. Create a contribution branch in your local clone, verify the push remote points to your fork, and push that branch. A successful push proves branch-write access. Confirm your submission tool supports opening an upstream PR; final PR creation will be verified after there is a real diff. Do not create an empty test PR.

If these capabilities are missing, say so **before substantial implementation**:

> I can read this repository, but cannot yet submit a contribution. Please connect an authorized GitHub account with permission to create/reuse a fork, push a branch to it, and open a pull request to the upstream repository. I will resume once that access is available.

Do not silently switch to a downloadable package and call the contribution submitted. If the operator explicitly chooses a manual relay, preserve the work and use the documented package/patch fallback. That route requires an operator handoff.

## CLI example

This example contributes project code to the workshop. For directory records or directory tooling, substitute `yvlabs/scripture-for-everyone` and its local directory throughout. Commands assume GitHub CLI and Git are available and authenticated through an authorized setup.

```sh
gh auth status
gh api user --jq .login
gh repo fork yvlabs/scripture-workshop --clone
cd scripture-workshop
git remote -v
git switch -c contribution/short-description
# Verify origin points to YOUR fork before pushing.
git push -u origin contribution/short-description
```

If a local clone already exists, keep it. Create/reuse the fork, add its verified Git URL as a remote named `contributor`, and push your branch there. Inspect existing remotes before changing anything. Do not overwrite existing branches or force-push someone else's work. When reusing an old fork, base new work on the current upstream main revision.

Build the bounded contribution and run the repository/project checks. Stage only intended files, then commit and push. Write a factual PR description to a local text file and use:

```sh
# Replace YOUR_LOGIN with the verified fork owner's login.
gh pr create --repo yvlabs/scripture-workshop   --base main --head YOUR_LOGIN:contribution/short-description   --title 'Describe the concrete contribution' --body-file /tmp/contribution-pr.md
```

Inspect the resulting PR to confirm it targets the correct upstream repository and includes the expected files and head commit. Use the returned PR URL for subsequent comments and review checks. If PR creation fails, preserve the branch and report the exact blocker; do not claim submission succeeded.

## What “contribute something” means

Choose one useful, bounded task that fits your access. Check existing work and claims. Implement it, run appropriate checks, open the upstream PR, and return its URL with a brief account of the change, checks and limitations. A plan or local files alone do not complete the default task. Submission is not acceptance or a production launch. Respond to review with commits on the same branch when the agent is next active; do not claim ongoing monitoring unless actually configured.

No App Key is needed for directory work or synthetic tests. For a first code contribution without Platform access, use synthetic fixtures and document any live checks that remain. Lack of an App Key should steer task selection, not end all useful work.

[GitHub's fork-and-PR documentation](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork). Actual access depends on the account, token/connector capabilities and operator permissions.
