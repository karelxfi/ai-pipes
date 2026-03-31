import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"sender": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    LogCheckpointExchangePrice: event("0x258e66ebbd5eea6c56ac90a53c88e2c9bd51f9faba8d52c69fd5a0a7ff520b7e", "LogCheckpointExchangePrice(uint256,uint256)", {"newPrice": p.uint256, "timestamp": p.uint256}),
    LogDeployIdleUSDC: event("0x03cd3d890ee77ecac581297dcc196e22d1d859e624f644065de1f548c4309e76", "LogDeployIdleUSDC(uint256)", {"amount": p.uint256}),
    LogPauseDeposits: event("0xb86857d5a495ed66056368e5a42f08606ff067bf78f7da5be5075ebedd7bea24", "LogPauseDeposits(bool)", {"isPaused": p.bool}),
    LogPauseWithdrawals: event("0xd9e6c3f798cddc3d67fa41d03da91fcfaa112432c0fc55d89806a703c1cad6bb", "LogPauseWithdrawals(bool)", {"isPaused": p.bool}),
    LogPullFunds: event("0xd5c6064df72d34ec03b1fdb206eb9dddc7a73f81b2837b90fabd66d7873f82eb", "LogPullFunds(uint256)", {"amount": p.uint256}),
    LogPushFunds: event("0xe8656b307cb261efcd0058667e0a7e0ab945c06c82f5fdd2d2e07b81fe30d4ca", "LogPushFunds(uint256)", {"amount": p.uint256}),
    LogUpdateConfig: event("0xa31b7aefeae5b48be3ed5c2ec398608825b5c9a7b543b96ab1e7c0234d4b8f88", "LogUpdateConfig(uint256,uint256)", {"fixedRate": p.uint256, "withdrawalFeeBPS": p.uint256}),
    LogUpdateOwner: event("0x15a67adfda80586faba254342816767d439e934c78f04dcdaeb6c6ace1422016", "LogUpdateOwner(address)", {"newOwner": indexed(p.address)}),
    LogUpdateRewardConfig: event("0x6f8c5b12ba4564d493f448611f30d2372621bba44eb744a9cb5ba940871ab5e8", "LogUpdateRewardConfig(uint256)", {"rewardAmountPerYear": p.uint256}),
    LogUpdateRole: event("0xa33588a5ebf62bd88596dcb9ed1ec23c30811cbd5d22a7663e6ec8eb72a141c5", "LogUpdateRole(address,uint256)", {"addr": indexed(p.address), "level": p.uint256}),
    LogUpdateSecondaryOwner: event("0x19bb608df6b7ada726db29eb891f86c67d299231a9de31d908ca3daf25bd1fc6", "LogUpdateSecondaryOwner(address)", {"newOwner": indexed(p.address)}),
    LogWithdrawFee: event("0xbcacd35e44ebcdaa615013d05335c060187b65a417e24f0714a9a6b629d64137", "LogWithdrawFee(address,uint256)", {"owner": indexed(p.address), "fee": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", "Withdraw(address,address,address,uint256,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
}

export const functions = {
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "value": p.uint256}, p.bool),
    asset: viewFun("0x38d52e0f", "asset()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares_": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets_": p.uint256}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    deployIdleUSDC: fun("0x9807f835", "deployIdleUSDC()", {}, ),
    deposit: fun("0x6e553f65", "deposit(uint256,address)", {"assets_": p.uint256, "receiver_": p.address}, p.uint256),
    getAllRoles: viewFun("0xf2bcac3d", "getAllRoles()", {}, p.array(p.struct({"addr": p.address, "level": p.uint256}))),
    getEffectiveExchangePrice: viewFun("0xd5d7961b", "getEffectiveExchangePrice()", {}, p.uint256),
    getExchangePrice: viewFun("0xa51ff4a2", "getExchangePrice()", {}, p.uint256),
    getFUSDC: viewFun("0x95dbb1e5", "getFUSDC()", {}, p.address),
    getFixedRate: viewFun("0x73c05178", "getFixedRate()", {}, p.uint256),
    getIdleBalance: viewFun("0xe8b276f9", "getIdleBalance()", {}, p.uint256),
    getLastUpdateTimestamp: viewFun("0xe1e46882", "getLastUpdateTimestamp()", {}, p.uint256),
    getOwner: viewFun("0x893d20e8", "getOwner()", {}, p.address),
    getRewardAmountPerYear: viewFun("0x1261a284", "getRewardAmountPerYear()", {}, p.uint256),
    getRoleCount: viewFun("0x83d33319", "getRoleCount()", {}, p.uint256),
    getSecondaryOwner: viewFun("0x8e98c2f3", "getSecondaryOwner()", {}, p.address),
    getStrategyHandler: viewFun("0x89dc9936", "getStrategyHandler()", {}, p.address),
    getWithdrawalFeeBPS: viewFun("0x0631d806", "getWithdrawalFeeBPS()", {}, p.uint256),
    initialize: fun("0x485cc955", "initialize(address,address)", {"owner_": p.address, "secondaryOwner_": p.address}, ),
    isAuth: viewFun("0x2520e7ff", "isAuth(address)", {"addr_": p.address}, p.bool),
    isDepositsPaused: viewFun("0x27042b84", "isDepositsPaused()", {}, p.bool),
    isWithdrawalsPaused: viewFun("0x5398d2c2", "isWithdrawalsPaused()", {}, p.bool),
    maxDeposit: viewFun("0x402d267d", "maxDeposit(address)", {"_0": p.address}, p.uint256),
    maxMint: viewFun("0xc63d75b6", "maxMint(address)", {"_0": p.address}, p.uint256),
    maxRedeem: viewFun("0xd905777e", "maxRedeem(address)", {"owner_": p.address}, p.uint256),
    maxWithdraw: viewFun("0xce96cb77", "maxWithdraw(address)", {"owner_": p.address}, p.uint256),
    mint: fun("0x94bf804d", "mint(uint256,address)", {"shares_": p.uint256, "receiver_": p.address}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    pauseDeposits: fun("0x738b62e5", "pauseDeposits(bool)", {"paused_": p.bool}, ),
    pauseWithdrawals: fun("0xf4cc87ba", "pauseWithdrawals(bool)", {"paused_": p.bool}, ),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"assets_": p.uint256}, p.uint256),
    previewMint: viewFun("0xb3d7f6b9", "previewMint(uint256)", {"shares_": p.uint256}, p.uint256),
    previewRedeem: viewFun("0x4cdad506", "previewRedeem(uint256)", {"shares_": p.uint256}, p.uint256),
    previewWithdraw: viewFun("0x0a28a477", "previewWithdraw(uint256)", {"assets_": p.uint256}, p.uint256),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    pullFunds: fun("0xec8d8777", "pullFunds(uint256)", {"amount_": p.uint256}, ),
    pushFunds: fun("0x7b36f157", "pushFunds(uint256)", {"amount_": p.uint256}, ),
    redeem: fun("0xba087652", "redeem(uint256,address,address)", {"shares_": p.uint256, "receiver_": p.address, "owner_": p.address}, p.uint256),
    roleLevel: viewFun("0xa454b3cf", "roleLevel(address)", {"addr_": p.address}, p.uint256),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"to": p.address, "value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "value": p.uint256}, p.bool),
    updateConfig: fun("0x8248e722", "updateConfig(uint256,uint256)", {"fixedRate_": p.uint256, "withdrawalFeeBPS_": p.uint256}, ),
    updateExchangePrice: fun("0xb00fe4cb", "updateExchangePrice(uint256)", {"newExchangePrice_": p.uint256}, ),
    updateOwner: fun("0x880cdc31", "updateOwner(address)", {"newOwner_": p.address}, ),
    updateRewardConfig: fun("0xf077bb2e", "updateRewardConfig(uint256)", {"rewardAmountPerYear_": p.uint256}, ),
    updateRole: fun("0xae5b102e", "updateRole(address,uint256)", {"addr_": p.address, "level_": p.uint256}, ),
    updateSecondaryOwner: fun("0xff7c3d02", "updateSecondaryOwner(address)", {"newOwner_": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
    withdraw: fun("0xb460af94", "withdraw(uint256,address,address)", {"assets_": p.uint256, "receiver_": p.address, "owner_": p.address}, p.uint256),
}

export class Contract extends ContractBase {

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    convertToAssets(shares_: ConvertToAssetsParams["shares_"]) {
        return this.eth_call(functions.convertToAssets, {shares_})
    }

    convertToShares(assets_: ConvertToSharesParams["assets_"]) {
        return this.eth_call(functions.convertToShares, {assets_})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getAllRoles() {
        return this.eth_call(functions.getAllRoles, {})
    }

    getEffectiveExchangePrice() {
        return this.eth_call(functions.getEffectiveExchangePrice, {})
    }

    getExchangePrice() {
        return this.eth_call(functions.getExchangePrice, {})
    }

    getFUSDC() {
        return this.eth_call(functions.getFUSDC, {})
    }

    getFixedRate() {
        return this.eth_call(functions.getFixedRate, {})
    }

    getIdleBalance() {
        return this.eth_call(functions.getIdleBalance, {})
    }

    getLastUpdateTimestamp() {
        return this.eth_call(functions.getLastUpdateTimestamp, {})
    }

    getOwner() {
        return this.eth_call(functions.getOwner, {})
    }

    getRewardAmountPerYear() {
        return this.eth_call(functions.getRewardAmountPerYear, {})
    }

    getRoleCount() {
        return this.eth_call(functions.getRoleCount, {})
    }

    getSecondaryOwner() {
        return this.eth_call(functions.getSecondaryOwner, {})
    }

    getStrategyHandler() {
        return this.eth_call(functions.getStrategyHandler, {})
    }

    getWithdrawalFeeBPS() {
        return this.eth_call(functions.getWithdrawalFeeBPS, {})
    }

    isAuth(addr_: IsAuthParams["addr_"]) {
        return this.eth_call(functions.isAuth, {addr_})
    }

    isDepositsPaused() {
        return this.eth_call(functions.isDepositsPaused, {})
    }

    isWithdrawalsPaused() {
        return this.eth_call(functions.isWithdrawalsPaused, {})
    }

    maxDeposit(_0: MaxDepositParams["_0"]) {
        return this.eth_call(functions.maxDeposit, {_0})
    }

    maxMint(_0: MaxMintParams["_0"]) {
        return this.eth_call(functions.maxMint, {_0})
    }

    maxRedeem(owner_: MaxRedeemParams["owner_"]) {
        return this.eth_call(functions.maxRedeem, {owner_})
    }

    maxWithdraw(owner_: MaxWithdrawParams["owner_"]) {
        return this.eth_call(functions.maxWithdraw, {owner_})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    previewDeposit(assets_: PreviewDepositParams["assets_"]) {
        return this.eth_call(functions.previewDeposit, {assets_})
    }

    previewMint(shares_: PreviewMintParams["shares_"]) {
        return this.eth_call(functions.previewMint, {shares_})
    }

    previewRedeem(shares_: PreviewRedeemParams["shares_"]) {
        return this.eth_call(functions.previewRedeem, {shares_})
    }

    previewWithdraw(assets_: PreviewWithdrawParams["assets_"]) {
        return this.eth_call(functions.previewWithdraw, {assets_})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    roleLevel(addr_: RoleLevelParams["addr_"]) {
        return this.eth_call(functions.roleLevel, {addr_})
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
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LogCheckpointExchangePriceEventArgs = EParams<typeof events.LogCheckpointExchangePrice>
export type LogDeployIdleUSDCEventArgs = EParams<typeof events.LogDeployIdleUSDC>
export type LogPauseDepositsEventArgs = EParams<typeof events.LogPauseDeposits>
export type LogPauseWithdrawalsEventArgs = EParams<typeof events.LogPauseWithdrawals>
export type LogPullFundsEventArgs = EParams<typeof events.LogPullFunds>
export type LogPushFundsEventArgs = EParams<typeof events.LogPushFunds>
export type LogUpdateConfigEventArgs = EParams<typeof events.LogUpdateConfig>
export type LogUpdateOwnerEventArgs = EParams<typeof events.LogUpdateOwner>
export type LogUpdateRewardConfigEventArgs = EParams<typeof events.LogUpdateRewardConfig>
export type LogUpdateRoleEventArgs = EParams<typeof events.LogUpdateRole>
export type LogUpdateSecondaryOwnerEventArgs = EParams<typeof events.LogUpdateSecondaryOwner>
export type LogWithdrawFeeEventArgs = EParams<typeof events.LogWithdrawFee>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

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

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DeployIdleUSDCParams = FunctionArguments<typeof functions.deployIdleUSDC>
export type DeployIdleUSDCReturn = FunctionReturn<typeof functions.deployIdleUSDC>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type GetAllRolesParams = FunctionArguments<typeof functions.getAllRoles>
export type GetAllRolesReturn = FunctionReturn<typeof functions.getAllRoles>

export type GetEffectiveExchangePriceParams = FunctionArguments<typeof functions.getEffectiveExchangePrice>
export type GetEffectiveExchangePriceReturn = FunctionReturn<typeof functions.getEffectiveExchangePrice>

export type GetExchangePriceParams = FunctionArguments<typeof functions.getExchangePrice>
export type GetExchangePriceReturn = FunctionReturn<typeof functions.getExchangePrice>

export type GetFUSDCParams = FunctionArguments<typeof functions.getFUSDC>
export type GetFUSDCReturn = FunctionReturn<typeof functions.getFUSDC>

export type GetFixedRateParams = FunctionArguments<typeof functions.getFixedRate>
export type GetFixedRateReturn = FunctionReturn<typeof functions.getFixedRate>

export type GetIdleBalanceParams = FunctionArguments<typeof functions.getIdleBalance>
export type GetIdleBalanceReturn = FunctionReturn<typeof functions.getIdleBalance>

export type GetLastUpdateTimestampParams = FunctionArguments<typeof functions.getLastUpdateTimestamp>
export type GetLastUpdateTimestampReturn = FunctionReturn<typeof functions.getLastUpdateTimestamp>

export type GetOwnerParams = FunctionArguments<typeof functions.getOwner>
export type GetOwnerReturn = FunctionReturn<typeof functions.getOwner>

export type GetRewardAmountPerYearParams = FunctionArguments<typeof functions.getRewardAmountPerYear>
export type GetRewardAmountPerYearReturn = FunctionReturn<typeof functions.getRewardAmountPerYear>

export type GetRoleCountParams = FunctionArguments<typeof functions.getRoleCount>
export type GetRoleCountReturn = FunctionReturn<typeof functions.getRoleCount>

export type GetSecondaryOwnerParams = FunctionArguments<typeof functions.getSecondaryOwner>
export type GetSecondaryOwnerReturn = FunctionReturn<typeof functions.getSecondaryOwner>

export type GetStrategyHandlerParams = FunctionArguments<typeof functions.getStrategyHandler>
export type GetStrategyHandlerReturn = FunctionReturn<typeof functions.getStrategyHandler>

export type GetWithdrawalFeeBPSParams = FunctionArguments<typeof functions.getWithdrawalFeeBPS>
export type GetWithdrawalFeeBPSReturn = FunctionReturn<typeof functions.getWithdrawalFeeBPS>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsAuthParams = FunctionArguments<typeof functions.isAuth>
export type IsAuthReturn = FunctionReturn<typeof functions.isAuth>

export type IsDepositsPausedParams = FunctionArguments<typeof functions.isDepositsPaused>
export type IsDepositsPausedReturn = FunctionReturn<typeof functions.isDepositsPaused>

export type IsWithdrawalsPausedParams = FunctionArguments<typeof functions.isWithdrawalsPaused>
export type IsWithdrawalsPausedReturn = FunctionReturn<typeof functions.isWithdrawalsPaused>

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

export type PauseDepositsParams = FunctionArguments<typeof functions.pauseDeposits>
export type PauseDepositsReturn = FunctionReturn<typeof functions.pauseDeposits>

export type PauseWithdrawalsParams = FunctionArguments<typeof functions.pauseWithdrawals>
export type PauseWithdrawalsReturn = FunctionReturn<typeof functions.pauseWithdrawals>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewMintParams = FunctionArguments<typeof functions.previewMint>
export type PreviewMintReturn = FunctionReturn<typeof functions.previewMint>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type PullFundsParams = FunctionArguments<typeof functions.pullFunds>
export type PullFundsReturn = FunctionReturn<typeof functions.pullFunds>

export type PushFundsParams = FunctionArguments<typeof functions.pushFunds>
export type PushFundsReturn = FunctionReturn<typeof functions.pushFunds>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RoleLevelParams = FunctionArguments<typeof functions.roleLevel>
export type RoleLevelReturn = FunctionReturn<typeof functions.roleLevel>

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

export type UpdateConfigParams = FunctionArguments<typeof functions.updateConfig>
export type UpdateConfigReturn = FunctionReturn<typeof functions.updateConfig>

export type UpdateExchangePriceParams = FunctionArguments<typeof functions.updateExchangePrice>
export type UpdateExchangePriceReturn = FunctionReturn<typeof functions.updateExchangePrice>

export type UpdateOwnerParams = FunctionArguments<typeof functions.updateOwner>
export type UpdateOwnerReturn = FunctionReturn<typeof functions.updateOwner>

export type UpdateRewardConfigParams = FunctionArguments<typeof functions.updateRewardConfig>
export type UpdateRewardConfigReturn = FunctionReturn<typeof functions.updateRewardConfig>

export type UpdateRoleParams = FunctionArguments<typeof functions.updateRole>
export type UpdateRoleReturn = FunctionReturn<typeof functions.updateRole>

export type UpdateSecondaryOwnerParams = FunctionArguments<typeof functions.updateSecondaryOwner>
export type UpdateSecondaryOwnerReturn = FunctionReturn<typeof functions.updateSecondaryOwner>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

