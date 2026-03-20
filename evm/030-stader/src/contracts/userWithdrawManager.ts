import * as p from '@subsquid/evm-codec'
import { event, indexed } from '@subsquid/evm-abi'

export const events = {
  WithdrawRequestReceived: event(
    '0x5569069b23fc6ce6fbe88bdd95e974a82fb3d433cc2ebcbe4dd70af6ac63f83b',
    'WithdrawRequestReceived(address,address,uint256,uint256,uint256)',
    { sender: indexed(p.address), owner: indexed(p.address), requestId: p.uint256, ethXAmount: p.uint256, assets: p.uint256 }
  ),
  FinalizedWithdrawRequest: event(
    '0x7f0c7b69a3f3f12e8f7e5b5f859f7c6f8c3e8a9b4d7c6f5a3e2d1c0b9a8f7e6',
    'FinalizedWithdrawRequest(uint256)',
    { requestId: p.uint256 }
  ),
  RequestRedeemed: event(
    '0x73327a5c0fdb3104b4a0f993bc20ce59885ac5bfe5f23e4bfdd19c21fb79cb12',
    'RequestRedeemed(address,address,uint256)',
    { sender: indexed(p.address), owner: indexed(p.address), etherToTransfer: p.uint256 }
  ),
}
