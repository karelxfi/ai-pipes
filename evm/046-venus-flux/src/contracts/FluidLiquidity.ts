import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const events = {
  LogOperate: event(
    '0x4d93b232a24e82b284ced7461bf4deacffe66759d5c24513e6f29e571ad78d15',
    'LogOperate(address,address,int256,int256,address,address,uint256,uint256)',
    {
      user: indexed(p.address),
      token: indexed(p.address),
      supplyAmount: p.int256,
      borrowAmount: p.int256,
      withdrawTo: p.address,
      borrowTo: p.address,
      totalAmounts: p.uint256,
      exchangePricesAndConfig: p.uint256,
    },
  ),
}
