import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

// Pendle Router V4 events — manually defined because the Router is a Diamond proxy
// and evm-typegen cannot resolve the implementation ABI automatically.
// Event signatures verified against on-chain data via SQD Portal.

export const events = {
  // SwapPtAndToken(address indexed caller, address indexed market, address indexed token,
  //               address receiver, int256 netPtToAccount, int256 netTokenToAccount, uint256 netSyInterm)
  SwapPtAndToken: event(
    '0xd3c1d9b397236779b29ee5b5b150c1110fc8221b6b6ec0be49c9f4860ceb2036',
    'SwapPtAndToken(address,address,address,address,int256,int256,uint256)',
    {
      caller_: indexed(p.address),
      market_: indexed(p.address),
      token_: indexed(p.address),
      receiver_: p.address,
      netPtToAccount_: p.int256,
      netTokenToAccount_: p.int256,
      netSyInterm_: p.uint256,
    },
  ),

  // SwapYtAndSy(address indexed caller, address indexed market, address indexed yt,
  //            address receiver, int256 netYtToAccount, int256 netSyToAccount)
  SwapYtAndSy: event(
    '0x387bf301bf673df0120e2d57e639f0e05e5e03d5336577c4cd83c1bff96e8dee',
    'SwapYtAndSy(address,address,address,address,int256,int256)',
    {
      caller_: indexed(p.address),
      market_: indexed(p.address),
      yt_: indexed(p.address),
      receiver_: p.address,
      netYtToAccount_: p.int256,
      netSyToAccount_: p.int256,
    },
  ),

  // SwapYtAndToken(address indexed caller, address indexed market, address indexed token,
  //              address receiver, int256 netYtToAccount, int256 netTokenToAccount, uint256 netSyInterm)
  SwapYtAndToken: event(
    '0x3f5e2944826baeaed8eb77f0f74e6088a154a0fc1317f062fd984585607b4739',
    'SwapYtAndToken(address,address,address,address,int256,int256,uint256)',
    {
      caller_: indexed(p.address),
      market_: indexed(p.address),
      token_: indexed(p.address),
      receiver_: p.address,
      netYtToAccount_: p.int256,
      netTokenToAccount_: p.int256,
      netSyInterm_: p.uint256,
    },
  ),

  // SwapPtAndSy(address indexed caller, address indexed market,
  //            address receiver, int256 netPtToAccount, int256 netSyToAccount)
  SwapPtAndSy: event(
    '0x5258a3c624debb1cc84b0f5f66c73eef048832eeebe7178e63e95a53cf28dc94',
    'SwapPtAndSy(address,address,address,int256,int256)',
    {
      caller_: indexed(p.address),
      market_: indexed(p.address),
      receiver_: p.address,
      netPtToAccount_: p.int256,
      netSyToAccount_: p.int256,
    },
  ),
}
