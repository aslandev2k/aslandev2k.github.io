#!/usr/bin/env bash
# Builds the site and publishes dist/ as a new commit on the gh-pages branch.
# History on gh-pages is only ever appended to.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit first so the deploy maps to a commit." >&2
  exit 1
fi

pnpm build
source_sha="$(git rev-parse --short HEAD)"
worktree="$(mktemp -d)"
cleanup() { git worktree remove --force "$worktree"; }

if git ls-remote --exit-code --heads origin gh-pages >/dev/null; then
  git fetch origin gh-pages
  git worktree add --detach "$worktree" FETCH_HEAD
  trap cleanup EXIT
else
  git worktree add --detach "$worktree"
  trap cleanup EXIT
  git -C "$worktree" switch --orphan gh-pages
fi

find "$worktree" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$worktree"/
touch "$worktree"/.nojekyll

git -C "$worktree" add -A
if git -C "$worktree" diff --cached --quiet; then
  echo "Nothing changed, skipping deploy."
  exit 0
fi

git -C "$worktree" commit -m "Deploy ${source_sha}"
git -C "$worktree" push origin HEAD:refs/heads/gh-pages
echo "Deployed ${source_sha}."
