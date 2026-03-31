import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    CoreUpdate: event("0x9209b7c8c06dcfd261686a663e7c55989337b18d59da5433c6f2835fb6970920", "CoreUpdate(address,address)", {"oldCore": indexed(p.address), "newCore": indexed(p.address)}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"sender": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    VaultLoss: event("0x820476251d95b78d63480a8dbee716eb1c30b70352aa822aede4aa6a6d913577", "VaultLoss(uint256,uint256,uint256)", {"timestamp": indexed(p.uint256), "epoch": p.uint256, "assets": p.uint256}),
    VaultProfit: event("0x67d8e41dbea80661bb961d417970372decefc80a99de38a8ea4706efe68ffc2b", "VaultProfit(uint256,uint256,uint256)", {"timestamp": indexed(p.uint256), "epoch": p.uint256, "assets": p.uint256}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", "Withdraw(address,address,address,uint256,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
}

export const functions = {
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    applyLosses: fun("0x26522777", "applyLosses(uint256)", {"_amount": p.uint256}, ),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "value": p.uint256}, p.bool),
    asset: viewFun("0x38d52e0f", "asset()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets": p.uint256}, p.uint256),
    core: viewFun("0xf2f4eb26", "core()", {}, p.address),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    deposit: fun("0x6e553f65", "deposit(uint256,address)", {"assets": p.uint256, "receiver": p.address}, p.uint256),
    depositRewards: fun("0x8bdf67f2", "depositRewards(uint256)", {"_amount": p.uint256}, ),
    emergencyAction: fun("0x7df3927e", "emergencyAction((address,uint256,bytes)[])", {"calls": p.array(p.struct({"target": p.address, "value": p.uint256, "callData": p.bytes}))}, p.array(p.bytes)),
    epochRewards: viewFun("0x4dc47d34", "epochRewards(uint256)", {"epoch": p.uint256}, p.uint256),
    maxDeposit: viewFun("0x402d267d", "maxDeposit(address)", {"_receiver": p.address}, p.uint256),
    maxMint: viewFun("0xc63d75b6", "maxMint(address)", {"_receiver": p.address}, p.uint256),
    maxRedeem: viewFun("0xd905777e", "maxRedeem(address)", {"_receiver": p.address}, p.uint256),
    maxWithdraw: viewFun("0xce96cb77", "maxWithdraw(address)", {"_receiver": p.address}, p.uint256),
    mint: fun("0x94bf804d", "mint(uint256,address)", {"shares": p.uint256, "receiver": p.address}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"assets": p.uint256}, p.uint256),
    previewMint: viewFun("0xb3d7f6b9", "previewMint(uint256)", {"shares": p.uint256}, p.uint256),
    previewRedeem: viewFun("0x4cdad506", "previewRedeem(uint256)", {"shares": p.uint256}, p.uint256),
    previewWithdraw: viewFun("0x0a28a477", "previewWithdraw(uint256)", {"assets": p.uint256}, p.uint256),
    redeem: fun("0xba087652", "redeem(uint256,address,address)", {"shares": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
    setCore: fun("0x80009630", "setCore(address)", {"newCore": p.address}, ),
    setYieldSharing: fun("0x81d53faa", "setYieldSharing(address)", {"_yieldSharing": p.address}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"to": p.address, "value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "value": p.uint256}, p.bool),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    withdraw: fun("0xb460af94", "withdraw(uint256,address,address)", {"assets": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
    yieldSharing: viewFun("0xad0b93bd", "yieldSharing()", {}, p.address),
}

export class Contract extends ContractBase {

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    core() {
        return this.eth_call(functions.core, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    epochRewards(epoch: EpochRewardsParams["epoch"]) {
        return this.eth_call(functions.epochRewards, {epoch})
    }

    maxDeposit(_receiver: MaxDepositParams["_receiver"]) {
        return this.eth_call(functions.maxDeposit, {_receiver})
    }

    maxMint(_receiver: MaxMintParams["_receiver"]) {
        return this.eth_call(functions.maxMint, {_receiver})
    }

    maxRedeem(_receiver: MaxRedeemParams["_receiver"]) {
        return this.eth_call(functions.maxRedeem, {_receiver})
    }

    maxWithdraw(_receiver: MaxWithdrawParams["_receiver"]) {
        return this.eth_call(functions.maxWithdraw, {_receiver})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(functions.previewDeposit, {assets})
    }

    previewMint(shares: PreviewMintParams["shares"]) {
        return this.eth_call(functions.previewMint, {shares})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(functions.previewRedeem, {shares})
    }

    previewWithdraw(assets: PreviewWithdrawParams["assets"]) {
        return this.eth_call(functions.previewWithdraw, {assets})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    yieldSharing() {
        return this.eth_call(functions.yieldSharing, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type CoreUpdateEventArgs = EParams<typeof events.CoreUpdate>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type PausedEventArgs = EParams<typeof events.Paused>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type VaultLossEventArgs = EParams<typeof events.VaultLoss>
export type VaultProfitEventArgs = EParams<typeof events.VaultProfit>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApplyLossesParams = FunctionArguments<typeof functions.applyLosses>
export type ApplyLossesReturn = FunctionReturn<typeof functions.applyLosses>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssetParams = FunctionArguments<typeof functions.asset>
export type AssetReturn = FunctionReturn<typeof functions.asset>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type CoreParams = FunctionArguments<typeof functions.core>
export type CoreReturn = FunctionReturn<typeof functions.core>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositRewardsParams = FunctionArguments<typeof functions.depositRewards>
export type DepositRewardsReturn = FunctionReturn<typeof functions.depositRewards>

export type EmergencyActionParams = FunctionArguments<typeof functions.emergencyAction>
export type EmergencyActionReturn = FunctionReturn<typeof functions.emergencyAction>

export type EpochRewardsParams = FunctionArguments<typeof functions.epochRewards>
export type EpochRewardsReturn = FunctionReturn<typeof functions.epochRewards>

export type MaxDepositParams = FunctionArguments<typeof functions.maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof functions.maxDeposit>

export type MaxMintParams = FunctionArguments<typeof functions.maxMint>
export type MaxMintReturn = FunctionReturn<typeof functions.maxMint>

export type MaxRedeemParams = FunctionArguments<typeof functions.maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof functions.maxRedeem>

export type MaxWithdrawParams = FunctionArguments<typeof functions.maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof functions.maxWithdraw>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewMintParams = FunctionArguments<typeof functions.previewMint>
export type PreviewMintReturn = FunctionReturn<typeof functions.previewMint>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type SetCoreParams = FunctionArguments<typeof functions.setCore>
export type SetCoreReturn = FunctionReturn<typeof functions.setCore>

export type SetYieldSharingParams = FunctionArguments<typeof functions.setYieldSharing>
export type SetYieldSharingReturn = FunctionReturn<typeof functions.setYieldSharing>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type YieldSharingParams = FunctionArguments<typeof functions.yieldSharing>
export type YieldSharingReturn = FunctionReturn<typeof functions.yieldSharing>

