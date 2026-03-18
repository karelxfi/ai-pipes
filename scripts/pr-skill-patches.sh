#!/bin/bash
set -e

# Creates a PR to subsquid-labs/agent-skills with local skill patches.
# Usage: ./scripts/pr-skill-patches.sh "brief description of changes"
#
# How it works:
# 1. Clones karelxfi/agent-skills fork to a temp dir
# 2. Copies patched skill files from .agents/skills/ into the clone
# 3. Creates a branch, commits, pushes, and opens a PR to subsquid-labs/agent-skills

DESCRIPTION="${1:-Auto-patch from ai-pipes indexer generation}"
SKILLS_DIR="$(cd "$(dirname "$0")/.." && pwd)/.agents/skills"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRANCH="ai-pipes-patch-${TIMESTAMP}"

if [ ! -d "$SKILLS_DIR" ]; then
  echo "No local skills found at $SKILLS_DIR"
  exit 1
fi

# Clone the fork
TMPDIR=$(mktemp -d)
echo "Cloning karelxfi/agent-skills to $TMPDIR..."
gh repo clone karelxfi/agent-skills "$TMPDIR" -- --depth=1 -q

cd "$TMPDIR"
git checkout -b "$BRANCH"

# Map local skill dirs to upstream paths
# Local: .agents/skills/pipes-new-indexer/ → Upstream: pipes-sdk/pipes-new-indexer/
# Local: .agents/skills/portal-query-*/ → Upstream: portal/portal-query-*/
for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name=$(basename "$skill_dir")

  # Determine upstream path
  if [[ "$skill_name" == pipes-* ]]; then
    upstream_dir="pipes-sdk/$skill_name"
  elif [[ "$skill_name" == portal-* ]]; then
    upstream_dir="portal/$skill_name"
  else
    echo "Unknown skill category: $skill_name, skipping"
    continue
  fi

  if [ ! -d "$upstream_dir" ]; then
    echo "Upstream dir $upstream_dir not found, skipping $skill_name"
    continue
  fi

  # Copy patched files over
  cp -R "$skill_dir"/* "$upstream_dir/"
  echo "Patched: $upstream_dir"
done

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
  echo "No changes to submit — skills match upstream."
  rm -rf "$TMPDIR"
  exit 0
fi

# Commit and push
git add -A
git commit -m "fix: patches from ai-pipes indexer generation

$DESCRIPTION

These patches were automatically generated during indexer creation
in https://github.com/karelxfi/ai-pipes. Each patch addresses an
issue encountered while using the skills to build real DeFi indexers."

git push origin "$BRANCH"

# Create PR to upstream
PR_URL=$(gh pr create \
  --repo subsquid-labs/agent-skills \
  --head "karelxfi:$BRANCH" \
  --title "fix: skill patches from ai-pipes indexer generation" \
  --body "$(cat <<EOF
## Summary

Patches from building DeFi indexers in [ai-pipes](https://github.com/karelxfi/ai-pipes).

$DESCRIPTION

## Context

These changes were discovered while using the agent skills to generate real, working indexers. Each patch addresses a concrete issue encountered during generation — not theoretical improvements.

## Changes

$(git diff HEAD~1 --stat)

---

Generated automatically by [ai-pipes](https://github.com/karelxfi/ai-pipes)
EOF
)")

echo ""
echo "PR created: $PR_URL"

# Cleanup
rm -rf "$TMPDIR"
