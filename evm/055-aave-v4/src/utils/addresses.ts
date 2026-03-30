export const HUBS = {
  CORE: '0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9',
  PLUS: '0x06002e9c4412CB7814a791eA3666D905871E536A',
  PRIME: '0x9438827DCA022D0F354a8a8c332dA1e5Eb9F9F931',
} as const

export const SPOKES = {
  MAIN: '0x94e7A5dCbE816e498b89aB752661904E2F56c485',
  BLUECHIP: '0x973a023A77420ba610f06b3858aD991Df6d85A08',
  ETHENA_CORRELATED: '0x58131E79531caB1d52301228d1f7b842F26B9649',
  ETHENA_ECOSYSTEM: '0xba1B3D55D249692b669A164024A838309B7508AF',
  ETHERFI: '0xbF10BDfE177dE0336aFD7fcCF80A904E15386219',
  FOREX: '0xD8B93635b8C6d0fF98CbE90b5988E3F2d1Cd9da1',
  GOLD: '0x65407b940966954b23dfA3caA5C0702bB42984DC',
  KELP: '0x3131FE68C4722e726fe6B2819ED68e514395B9a4',
  LIDO: '0xe1900480ac69f0B296841Cd01cC37546d92F35Cd',
  LOMBARD_BTC: '0x7EC68b5695e803e98a21a9A05d744F28b0a7753D',
  TREASURY: '0xB9B0b8616f6Bf6841972a52058132BE08d723155',
} as const

export const ALL_HUB_ADDRESSES = Object.values(HUBS).map(a => a.toLowerCase())
export const ALL_SPOKE_ADDRESSES = Object.values(SPOKES).map(a => a.toLowerCase())

export const SPOKE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SPOKES).map(([name, addr]) => [addr.toLowerCase(), name.replace(/_/g, ' ')])
)
export const HUB_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(HUBS).map(([name, addr]) => [addr.toLowerCase(), name])
)

// Contracts deployed at 24720891, but protocol activated at ~24770600 (March 30, 2026)
export const DEPLOYMENT_BLOCK = 24770600
