import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'
import { ContractBase, event, fun, indexed, viewFun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const events = {
  Approval: event(
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    'Approval(address,address,uint256)',
    { owner: indexed(p.address), spender: indexed(p.address), value: p.uint256 },
  ),
  EtherDeposited: event(
    '0xef51b4c870b8b0100eae2072e91db01222a303072af3728e58c9d4d2da33127f',
    'EtherDeposited(address,uint256,uint256)',
    { from: indexed(p.address), amount: p.uint256, time: p.uint256 },
  ),
  TokensBurned: event(
    '0x19783b34589160c168487dc7f9c51ae0bcefe67a47d6708fba90f6ce0366d3d1',
    'TokensBurned(address,uint256,uint256,uint256)',
    { from: indexed(p.address), amount: p.uint256, ethAmount: p.uint256, time: p.uint256 },
  ),
  TokensMinted: event(
    '0x6155cfd0fd028b0ca77e8495a60cbe563e8bce8611f0aad6fedbdaafc05d44a2',
    'TokensMinted(address,uint256,uint256,uint256)',
    { to: indexed(p.address), amount: p.uint256, ethAmount: p.uint256, time: p.uint256 },
  ),
  Transfer: event(
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    'Transfer(address,address,uint256)',
    { from: indexed(p.address), to: indexed(p.address), value: p.uint256 },
  ),
}

export const functions = {
  allowance: viewFun('0xdd62ed3e', 'allowance(address,address)', { owner: p.address, spender: p.address }, p.uint256),
  approve: fun('0x095ea7b3', 'approve(address,uint256)', { spender: p.address, amount: p.uint256 }, p.bool),
  balanceOf: viewFun('0x70a08231', 'balanceOf(address)', { account: p.address }, p.uint256),
  burn: fun('0x42966c68', 'burn(uint256)', { _rethAmount: p.uint256 }),
  decimals: viewFun('0x313ce567', 'decimals()', {}, p.uint8),
  decreaseAllowance: fun(
    '0xa457c2d7',
    'decreaseAllowance(address,uint256)',
    { spender: p.address, subtractedValue: p.uint256 },
    p.bool,
  ),
  depositExcess: fun('0x6c985a88', 'depositExcess()', {}),
  depositExcessCollateral: fun('0x188e0dc6', 'depositExcessCollateral()', {}),
  getCollateralRate: viewFun('0x852185fc', 'getCollateralRate()', {}, p.uint256),
  getEthValue: viewFun('0x8b32fa23', 'getEthValue(uint256)', { _rethAmount: p.uint256 }, p.uint256),
  getExchangeRate: viewFun('0xe6aa216c', 'getExchangeRate()', {}, p.uint256),
  getRethValue: viewFun('0x4346f03e', 'getRethValue(uint256)', { _ethAmount: p.uint256 }, p.uint256),
  getTotalCollateral: viewFun('0xd6eb5910', 'getTotalCollateral()', {}, p.uint256),
  increaseAllowance: fun(
    '0x39509351',
    'increaseAllowance(address,uint256)',
    { spender: p.address, addedValue: p.uint256 },
    p.bool,
  ),
  mint: fun('0x94bf804d', 'mint(uint256,address)', { _ethAmount: p.uint256, _to: p.address }),
  name: viewFun('0x06fdde03', 'name()', {}, p.string),
  symbol: viewFun('0x95d89b41', 'symbol()', {}, p.string),
  totalSupply: viewFun('0x18160ddd', 'totalSupply()', {}, p.uint256),
  transfer: fun('0xa9059cbb', 'transfer(address,uint256)', { recipient: p.address, amount: p.uint256 }, p.bool),
  transferFrom: fun(
    '0x23b872dd',
    'transferFrom(address,address,uint256)',
    { sender: p.address, recipient: p.address, amount: p.uint256 },
    p.bool,
  ),
  version: viewFun('0x54fd4d50', 'version()', {}, p.uint8),
}

export class Contract extends ContractBase {
  allowance(owner: AllowanceParams['owner'], spender: AllowanceParams['spender']) {
    return this.eth_call(functions.allowance, { owner, spender })
  }

  balanceOf(account: BalanceOfParams['account']) {
    return this.eth_call(functions.balanceOf, { account })
  }

  decimals() {
    return this.eth_call(functions.decimals, {})
  }

  getCollateralRate() {
    return this.eth_call(functions.getCollateralRate, {})
  }

  getEthValue(_rethAmount: GetEthValueParams['_rethAmount']) {
    return this.eth_call(functions.getEthValue, { _rethAmount })
  }

  getExchangeRate() {
    return this.eth_call(functions.getExchangeRate, {})
  }

  getRethValue(_ethAmount: GetRethValueParams['_ethAmount']) {
    return this.eth_call(functions.getRethValue, { _ethAmount })
  }

  getTotalCollateral() {
    return this.eth_call(functions.getTotalCollateral, {})
  }

  name() {
    return this.eth_call(functions.name, {})
  }

  symbol() {
    return this.eth_call(functions.symbol, {})
  }

  totalSupply() {
    return this.eth_call(functions.totalSupply, {})
  }

  version() {
    return this.eth_call(functions.version, {})
  }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type EtherDepositedEventArgs = EParams<typeof events.EtherDeposited>
export type TokensBurnedEventArgs = EParams<typeof events.TokensBurned>
export type TokensMintedEventArgs = EParams<typeof events.TokensMinted>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BurnParams = FunctionArguments<typeof functions.burn>
export type BurnReturn = FunctionReturn<typeof functions.burn>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type DepositExcessParams = FunctionArguments<typeof functions.depositExcess>
export type DepositExcessReturn = FunctionReturn<typeof functions.depositExcess>

export type DepositExcessCollateralParams = FunctionArguments<typeof functions.depositExcessCollateral>
export type DepositExcessCollateralReturn = FunctionReturn<typeof functions.depositExcessCollateral>

export type GetCollateralRateParams = FunctionArguments<typeof functions.getCollateralRate>
export type GetCollateralRateReturn = FunctionReturn<typeof functions.getCollateralRate>

export type GetEthValueParams = FunctionArguments<typeof functions.getEthValue>
export type GetEthValueReturn = FunctionReturn<typeof functions.getEthValue>

export type GetExchangeRateParams = FunctionArguments<typeof functions.getExchangeRate>
export type GetExchangeRateReturn = FunctionReturn<typeof functions.getExchangeRate>

export type GetRethValueParams = FunctionArguments<typeof functions.getRethValue>
export type GetRethValueReturn = FunctionReturn<typeof functions.getRethValue>

export type GetTotalCollateralParams = FunctionArguments<typeof functions.getTotalCollateral>
export type GetTotalCollateralReturn = FunctionReturn<typeof functions.getTotalCollateral>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>
