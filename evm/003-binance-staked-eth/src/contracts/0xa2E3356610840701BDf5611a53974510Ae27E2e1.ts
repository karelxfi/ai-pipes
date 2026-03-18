import type { EventParams as EParams } from '@subsquid/evm-abi'
import { ContractBase, event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

// wBETH proxy at 0xa2E3356610840701BDf5611a53974510Ae27E2e1
// Implementation (WrapTokenV3ETH) at 0x9e021c9607bd3adb7424d3b25a2d35763ff180bb
// The proxy uses AdminUpgradeabilityProxy which isn't auto-resolved by typegen.
// ExchangeRateUpdated event added manually from the implementation ABI.
// Signature: ExchangeRateUpdated(address,uint256)
// topic0 verified via 4byte.directory lookup

export const events = {
  ExchangeRateUpdated: event(
    '0x0b4e9390054347e2a16d95fd8376311b0d2deedecba526e9742bcaa40b059f0b',
    'ExchangeRateUpdated(address,uint256)',
    {
      caller: indexed(p.address),
      newExchangeRate: p.uint256,
    },
  ),
}

export class Contract extends ContractBase {}

/// Event types
export type ExchangeRateUpdatedEventArgs = EParams<typeof events.ExchangeRateUpdated>
