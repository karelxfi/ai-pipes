import { readFileSync, writeFileSync } from 'fs';

interface Protocol {
  name: string;
  category: string;
  vm: string;
  angle: string | null;
  status: string;
}

const STATUS_EMOJI: Record<string, string> = {
  pending: '⏳',
  done: '✅',
  failed: '❌',
  skipped: '⏭️',
};

function main() {
  const data = JSON.parse(readFileSync('protocols.json', 'utf-8'));
  const protocols: Protocol[] = data.protocols;

  const rows = protocols.map((p, i) =>
    `| ${i + 1} | ${p.name} | ${p.category} | ${p.vm} | ${STATUS_EMOJI[p.status] || p.status} |`
  );

  const table = [
    '<!-- Auto-generated from protocols.json — run `npm run update-readme` to refresh -->',
    '| # | Protocol | Category | VM | Status |',
    '|---|----------|----------|----|--------|',
    ...rows,
  ].join('\n');

  const readme = readFileSync('README.md', 'utf-8');
  const START = '<!-- PROTOCOLS:START -->';
  const END = '<!-- PROTOCOLS:END -->';

  const startIdx = readme.indexOf(START);
  const endIdx = readme.indexOf(END);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Missing PROTOCOLS markers in README.md');
    process.exit(1);
  }

  const updated = readme.slice(0, startIdx + START.length) + '\n' + table + '\n' + readme.slice(endIdx);
  writeFileSync('README.md', updated);
  console.log(`Updated README.md with ${protocols.length} protocols`);
}

main();
