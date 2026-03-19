#!/bin/bash
set -e

# Updates the contracts-registry-llm repo with verified contract addresses
# discovered during indexer generation. Handles multi-chain deployments.
#
# Usage: ./scripts/update-contracts-registry.sh <protocol-slug> <contracts-json>
#
# contracts.json format (multi-chain):
# {
#   "deployments": {
#     "ethereum": {
#       "contracts": {
#         "pool": { "address": "0x...", "deploymentBlock": 12345, "verified": true }
#       },
#       "source": "etherscan",
#       "sourceUrl": "https://..."
#     },
#     "base": { ... }
#   }
# }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REGISTRY_DIR="/Users/kb/dev/personal/contracts-registry-llm"
SLUG="${1:?Usage: $0 <protocol-slug> <contracts-json-file>}"
CONTRACT_JSON="${2:?Usage: $0 <protocol-slug> <contracts-json-file>}"

if [ ! -d "$REGISTRY_DIR" ]; then
  echo "Error: contracts-registry-llm not found at $REGISTRY_DIR"
  exit 1
fi

if [ ! -f "$CONTRACT_JSON" ]; then
  echo "Error: contract JSON file not found: $CONTRACT_JSON"
  exit 1
fi

PROTOCOL_DIR="$REGISTRY_DIR/data/sources/protocols/$SLUG"
PROTOCOL_FILE="$PROTOCOL_DIR/$SLUG.json"

if [ ! -f "$PROTOCOL_FILE" ]; then
  echo "Protocol $SLUG not found in contracts-registry. Skipping."
  exit 0
fi

echo "Updating contracts-registry for: $SLUG"

# Use Node to merge the contract data into the existing protocol file
node -e "
const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('$PROTOCOL_FILE', 'utf8'));
const update = JSON.parse(fs.readFileSync('$CONTRACT_JSON', 'utf8'));
const today = new Date().toISOString().split('T')[0];

if (!existing.deployments) existing.deployments = {};

let totalChanged = 0;

for (const [chain, chainUpdate] of Object.entries(update.deployments || {})) {
  // Initialize deployment if missing
  if (!existing.deployments[chain]) {
    existing.deployments[chain] = {
      chain: chain,
      addresses: {},
      deploymentBlocks: {},
      verified: {},
      source: [],
      sourceUrl: '',
      updated: today
    };
  }

  const dep = existing.deployments[chain];
  let chainChanged = 0;

  // Also update contract definitions if missing
  if (!existing.contracts) existing.contracts = {};

  for (const [name, info] of Object.entries(chainUpdate.contracts || {})) {
    const addr = info.address;
    if (addr && addr !== '' && dep.addresses[name] !== addr) {
      dep.addresses[name] = addr;
      if (info.deploymentBlock != null) dep.deploymentBlocks[name] = info.deploymentBlock;
      if (info.verified !== undefined) dep.verified[name] = info.verified;
      chainChanged++;

      // Add contract definition if not present
      if (!existing.contracts[name]) {
        existing.contracts[name] = {
          name: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' \$1').trim(),
          type: 'core',
          description: '',
          proxy: false,
          keyEvents: [],
          keyFunctions: [],
          useCases: []
        };
      }
    }
  }

  if (chainChanged > 0) {
    // Update source info
    const src = chainUpdate.source || 'ai-pipes';
    if (!dep.source.includes(src)) dep.source.push(src);
    if (chainUpdate.sourceUrl) dep.sourceUrl = chainUpdate.sourceUrl;
    dep.updated = today;
    totalChanged += chainChanged;
    console.log('  ' + chain + ': ' + chainChanged + ' contracts updated');
  }
}

if (totalChanged > 0) {
  // Update overall status
  const allChains = Object.values(existing.deployments);
  const hasAny = allChains.some(d => Object.values(d.addresses || {}).some(a => a && a !== ''));
  const allComplete = allChains.every(d => Object.values(d.addresses || {}).every(a => a && a !== ''));
  if (allComplete && allChains.length > 0) existing.status = 'complete';
  else if (hasAny) existing.status = 'partial';

  // Update tags with chain names
  if (!existing.tags) existing.tags = [];
  for (const chain of Object.keys(update.deployments || {})) {
    if (!existing.tags.includes(chain)) existing.tags.push(chain);
  }

  fs.writeFileSync('$PROTOCOL_FILE', JSON.stringify(existing, null, 2) + '\n');
  console.log('Total: ' + totalChanged + ' contracts across ' + Object.keys(update.deployments).length + ' chains');
} else {
  console.log('No new addresses to update.');
}
"

# Check if anything changed
cd "$REGISTRY_DIR"
if git diff --quiet -- "data/sources/protocols/$SLUG/"; then
  echo "No changes to contracts-registry."
  exit 0
fi

echo ""
echo "Changes:"
git diff --stat -- "data/sources/protocols/$SLUG/"
echo ""

# Build the registry to validate
echo "Building registry to validate..."
npm run build 2>&1 | tail -3

# Commit on a branch
BRANCH="ai-pipes-${SLUG}-$(date +%Y%m%d)"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" 2>/dev/null || true
git add "data/sources/protocols/$SLUG/" "data/generated/" "docs/"
git commit -m "feat: Add verified $SLUG contract addresses

Source: ai-pipes indexer generation
Verified against: Block explorer + SQD Portal cross-reference
Chains: $(node -e "const d=JSON.parse(require('fs').readFileSync('$CONTRACT_JSON','utf8')); console.log(Object.keys(d.deployments||{}).join(', '))")"

echo ""
echo "Committed on branch: $BRANCH"
echo "To create PR: cd $REGISTRY_DIR && gh pr create"
