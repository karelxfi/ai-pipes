import { writeFileSync } from 'fs';

const EXCLUDED_CATEGORIES = [
  'CEX', 'Chain', 'Bridge', 'Canonical Bridge', 'RWA', 'Staking Pool',
];

const EXCLUDED_NAMES = [
  'Binance CEX', 'OKX', 'Bitfinex', 'Bybit', 'Bitget', 'HTX',
  'Gemini', 'Gate', 'Deribit', 'KuCoin', 'MEXC', 'Crypto.com',
  'Poloniex', 'Bitkub', 'HashKey Exchange', 'Robinhood',
  'Figure Markets Exchange',
];

const ALLOWED_CATEGORIES = new Set([
  'Dexes', 'Lending', 'CDP', 'Yield', 'Derivatives', 'Liquid Staking',
  'Yield Aggregator', 'Options', 'Perps', 'Perpetuals', 'Leveraged Farming',
  'Algo-Stables', 'Liquidity manager', 'Liquidity Manager',
  'Cross Chain', 'NFT Marketplace', 'Options Vault',
]);

interface Protocol {
  name: string;
  slug: string;
  category: string;
  tvl: number;
  chains: string[];
}

async function main() {
  const res = await fetch('https://api.llama.fi/protocols');
  const data: Protocol[] = await res.json();

  const sorted = data
    .filter(p => p.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl);

  const filtered = sorted.filter(p => {
    if (EXCLUDED_CATEGORIES.includes(p.category)) return false;
    if (EXCLUDED_NAMES.includes(p.name)) return false;
    // Only keep indexable DeFi categories
    if (!ALLOWED_CATEGORIES.has(p.category)) return false;
    return true;
  });

  const evmChains = new Set([
    'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base',
    'BSC', 'Avalanche', 'Fantom', 'Gnosis', 'zkSync Era',
    'Linea', 'Scroll', 'Blast', 'Manta', 'Mantle',
  ]);

  const counters = { evm: 0, solana: 0, hyperliquid: 0 };

  const protocols = filtered.map(p => {
    let vm = 'evm';
    const chains = p.chains || [];
    const hasEvm = chains.some(c => evmChains.has(c));
    const hasSolana = chains.includes('Solana');
    const hasHyperliquid = chains.includes('Hyperliquid');

    if (hasHyperliquid && !hasEvm && !hasSolana) {
      vm = 'hyperliquid';
    } else if (hasSolana && !hasEvm) {
      vm = 'solana';
    }

    counters[vm as keyof typeof counters]++;
    const num = String(counters[vm as keyof typeof counters]).padStart(3, '0');
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const directory = `${vm}/${num}-${slug}`;

    return {
      name: p.name,
      slug,
      category: p.category,
      tvl: Math.round(p.tvl),
      vm,
      chains,
      angle: null,
      directory,
      status: 'pending',
    };
  });

  const final = protocols.slice(0, 100);

  // Recount after slicing
  const breakdown = {
    evm: final.filter(p => p.vm === 'evm').length,
    solana: final.filter(p => p.vm === 'solana').length,
    hyperliquid: final.filter(p => p.vm === 'hyperliquid').length,
  };

  const output = {
    source: 'https://api.llama.fi/protocols',
    fetched: new Date().toISOString().split('T')[0],
    total: final.length,
    breakdown,
    protocols: final,
  };

  writeFileSync('protocols.json', JSON.stringify(output, null, 2));
  console.log(`Wrote ${final.length} protocols to protocols.json`);
  console.log(`EVM: ${breakdown.evm}, Solana: ${breakdown.solana}, Hyperliquid: ${breakdown.hyperliquid}`);

  // Sanity check: log any that look like CEXes
  const suspicious = final.filter(p =>
    p.name.toLowerCase().includes('cex') ||
    p.category === 'CEX' ||
    EXCLUDED_NAMES.includes(p.name)
  );
  if (suspicious.length > 0) {
    console.warn('WARNING: Suspicious entries found:', suspicious.map(p => p.name));
  }
}

main().catch(console.error);
