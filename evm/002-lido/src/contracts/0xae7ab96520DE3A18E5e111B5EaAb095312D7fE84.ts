import type { EventParams as EParams } from '@subsquid/evm-abi'
import { ContractBase, event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

// Lido stETH implementation ABI (proxy at 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
// The proxy uses Aragon's AppProxyUpgradeable which isn't auto-resolved by typegen.
// TokenRebased event added manually from the implementation ABI.

export const events = {
  TokenRebased: event(
    '0xff08c3ef606d198e316ef5b822193c489965899eb4e3c248cea1a4626c3eda50',
    'TokenRebased(uint256,uint256,uint256,uint256,uint256,uint256,uint256)',
    {
      reportTimestamp: indexed(p.uint256),
      timeElapsed: p.uint256,
      preTotalShares: p.uint256,
      preTotalEther: p.uint256,
      postTotalShares: p.uint256,
      postTotalEther: p.uint256,
      sharesMintedAsFees: p.uint256,
    },
  ),
}

export class Contract extends ContractBase {}

/// Event types
export type TokenRebasedEventArgs = EParams<typeof events.TokenRebased>
