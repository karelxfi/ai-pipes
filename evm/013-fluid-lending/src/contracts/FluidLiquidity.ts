import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

// Fluid Liquidity Layer — LogOperate event
// The Liquidity contract is a proxy, so typegen only returns admin events.
// LogOperate is defined in the userModule/events.sol implementation.
// topic0 verified against on-chain data via SQD Portal.

export const events = {
  LogOperate: event(
    '0x4d93b232a24e82b284ced7461bf4deacffe66759d5c24513e6f29e571ad78d15',
    'LogOperate(address,address,int256,int256,address,address,uint256,uint256)',
    {
      user_: indexed(p.address),
      token_: indexed(p.address),
      supplyAmount_: p.int256,
      borrowAmount_: p.int256,
      withdrawTo_: p.address,
      borrowTo_: p.address,
      totalAmounts_: p.uint256,
      exchangePricesAndConfig_: p.uint256,
    },
  ),
}
