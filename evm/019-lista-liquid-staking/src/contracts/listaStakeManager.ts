import * as p from '@subsquid/evm-codec'
import { event, indexed } from '@subsquid/evm-abi'

export const events = {
  // Deposit(address dst, uint256 wad) — user stakes BNB
  Deposit: event(
    '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
    'Deposit(address,uint256)',
    { dst: p.address, wad: p.uint256 }
  ),
  // RequestWithdraw(address indexed user, uint256 amount) — user requests unstake
  RequestWithdraw: event(
    '0x0afd74a2a0a78f6c15e41029f44995ee023fe49276f44a4b2b2cf674829362e6',
    'RequestWithdraw(address,uint256)',
    { user: indexed(p.address), amount: p.uint256 }
  ),
  // ClaimWithdrawal(address indexed user, uint256 idx, uint256 amount) — user claims BNB
  ClaimWithdrawal: event(
    '0x63bfb3a58e0713d68e49dda62c223fab04fb534eeef8ac6356cec78e691c092a',
    'ClaimWithdrawal(address,uint256,uint256)',
    { user: indexed(p.address), idx: p.uint256, amount: p.uint256 }
  ),
}
