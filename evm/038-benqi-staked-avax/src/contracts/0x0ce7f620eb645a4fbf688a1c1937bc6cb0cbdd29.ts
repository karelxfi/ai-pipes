import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccrueRewards: event("0x8fbf6a230d02fb8f41af8c1ca90b126472e11286c47d7ed86bb2e1fc51a283d8", "AccrueRewards(uint256)", {"value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    CooldownPeriodUpdated: event("0x98eaabfe135a9c40c420208962bf81e7926b4d6df3e23502164c0554b7b35224", "CooldownPeriodUpdated(uint256,uint256)", {"oldCooldownPeriod": p.uint256, "newCooldownPeriod": p.uint256}),
    Deposit: event("0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c", "Deposit(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
    MintingPaused: event("0x35365f539a67058ad0735a24a50fe45b0ee05207919e9f4a2f60d855f55e0c0e", "MintingPaused(address)", {"user": p.address}),
    MintingResumed: event("0x8a53acd29b3c02ba82b89c57b23196b792ccb00a28515221f71bd92eafbc2dc3", "MintingResumed(address)", {"user": p.address}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    Redeem: event("0xbd5034ffbd47e4e72a94baa2cdb74c6fad73cb3bcdc13036b72ec8306f5a7646", "Redeem(address,uint256,uint256,uint256)", {"user": indexed(p.address), "unlockRequestedAt": p.uint256, "shareAmount": p.uint256, "avaxAmount": p.uint256}),
    RedeemOverdueShares: event("0xeaca243f6502ade1b9ea0909306c290366d6ea6778ca407ca4415c4a0f45e353", "RedeemOverdueShares(address,uint256)", {"user": indexed(p.address), "shareAmount": p.uint256}),
    RedeemPeriodUpdated: event("0x13cca15637be33d4651625caf09528168b20c132463c69ab5c0ff48b3e639117", "RedeemPeriodUpdated(uint256,uint256)", {"oldRedeemPeriod": p.uint256, "newRedeemPeriod": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Submitted: event("0xbb0070894135d02edfa550b04d7e5e141aa8090b46e57597ad45bfedd6554498", "Submitted(address,uint256,uint256)", {"user": indexed(p.address), "avaxAmount": p.uint256, "shareAmount": p.uint256}),
    TotalPooledAvaxCapUpdated: event("0xc016457d0a92973d26bab98d68d6f20133e355c467d05e5206c88c25d3b739d0", "TotalPooledAvaxCapUpdated(uint256,uint256)", {"oldTotalPooldAvaxCap": p.uint256, "newTotalPooledAvaxCap": p.uint256}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    UnlockCancelled: event("0x7e4a9502fd577f76f1dc8c9c8f63196816f7c1bd73c6db99f888e8d7bb2f8998", "UnlockCancelled(address,uint256,uint256)", {"user": indexed(p.address), "unlockRequestedAt": p.uint256, "shareAmount": p.uint256}),
    UnlockRequested: event("0xd843ce9ef55b27026be6c5e44e9f58097e0ebfa0d9d2d5823cb8ffa779585170", "UnlockRequested(address,uint256)", {"user": indexed(p.address), "shareAmount": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    Withdraw: event("0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364", "Withdraw(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    ROLE_ACCRUE_REWARDS: viewFun("0xa905ff93", "ROLE_ACCRUE_REWARDS()", {}, p.bytes32),
    ROLE_DEPOSIT: viewFun("0xc2d78654", "ROLE_DEPOSIT()", {}, p.bytes32),
    ROLE_PAUSE: viewFun("0x4ff0241a", "ROLE_PAUSE()", {}, p.bytes32),
    ROLE_PAUSE_MINTING: viewFun("0x3fc777b3", "ROLE_PAUSE_MINTING()", {}, p.bytes32),
    ROLE_RESUME: viewFun("0xc1db6588", "ROLE_RESUME()", {}, p.bytes32),
    ROLE_RESUME_MINTING: viewFun("0x1ab8ab25", "ROLE_RESUME_MINTING()", {}, p.bytes32),
    ROLE_SET_TOTAL_POOLED_AVAX_CAP: viewFun("0x4757c0d2", "ROLE_SET_TOTAL_POOLED_AVAX_CAP()", {}, p.bytes32),
    ROLE_WITHDRAW: viewFun("0x4b7e23dc", "ROLE_WITHDRAW()", {}, p.bytes32),
    accrueRewards: fun("0xe1a472b9", "accrueRewards(uint256)", {"amount": p.uint256}, ),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    cancelPendingUnlockRequests: fun("0x01550f64", "cancelPendingUnlockRequests()", {}, ),
    cancelRedeemableUnlockRequests: fun("0xd1f1ca04", "cancelRedeemableUnlockRequests()", {}, ),
    cancelUnlockRequest: fun("0x1610247b", "cancelUnlockRequest(uint256)", {"unlockIndex": p.uint256}, ),
    cooldownPeriod: viewFun("0x04646a49", "cooldownPeriod()", {}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    deposit: fun("0xd0e30db0", "deposit()", {}, ),
    getPaginatedUnlockRequests: viewFun("0xf2ab8cd2", "getPaginatedUnlockRequests(address,uint256,uint256)", {"user": p.address, "from": p.uint256, "to": p.uint256}, {"_0": p.array(p.struct({"startedAt": p.uint256, "shareAmount": p.uint256})), "_1": p.array(p.uint256)}),
    getPooledAvaxByShares: viewFun("0x4a36d6c1", "getPooledAvaxByShares(uint256)", {"shareAmount": p.uint256}, p.uint256),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    getRoleMember: viewFun("0x9010d07c", "getRoleMember(bytes32,uint256)", {"role": p.bytes32, "index": p.uint256}, p.address),
    getRoleMemberCount: viewFun("0xca15c873", "getRoleMemberCount(bytes32)", {"role": p.bytes32}, p.uint256),
    getSharesByPooledAvax: viewFun("0xf1ee8d92", "getSharesByPooledAvax(uint256)", {"avaxAmount": p.uint256}, p.uint256),
    getUnlockRequestCount: viewFun("0xc423f9a8", "getUnlockRequestCount(address)", {"user": p.address}, p.uint256),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    historicalExchangeRateTimestamps: viewFun("0x1b2b3a2f", "historicalExchangeRateTimestamps(uint256)", {"_0": p.uint256}, p.uint256),
    historicalExchangeRatesByTimestamp: viewFun("0x0a732ce6", "historicalExchangeRatesByTimestamp(uint256)", {"_0": p.uint256}, p.uint256),
    initialize: fun("0xe4a30116", "initialize(uint256,uint256)", {"_cooldownPeriod": p.uint256, "_redeemPeriod": p.uint256}, ),
    mintingPaused: viewFun("0xe1a283d6", "mintingPaused()", {}, p.bool),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    pause: fun("0x8456cb59", "pause()", {}, ),
    pauseMinting: fun("0xda8fbf2a", "pauseMinting()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    'redeem()': fun("0xbe040fb0", "redeem()", {}, ),
    'redeem(uint256)': fun("0xdb006a75", "redeem(uint256)", {"unlockIndex": p.uint256}, ),
    'redeemOverdueShares()': fun("0x0d10d32c", "redeemOverdueShares()", {}, ),
    'redeemOverdueShares(uint256)': fun("0x0f7e2048", "redeemOverdueShares(uint256)", {"unlockIndex": p.uint256}, ),
    redeemPeriod: viewFun("0x40a233a6", "redeemPeriod()", {}, p.uint256),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    requestUnlock: fun("0xc9d2ff9d", "requestUnlock(uint256)", {"shareAmount": p.uint256}, ),
    resume: fun("0x046f7da2", "resume()", {}, ),
    resumeMinting: fun("0x59ae340e", "resumeMinting()", {}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setCooldownPeriod: fun("0x80ea3de1", "setCooldownPeriod(uint256)", {"newCooldownPeriod": p.uint256}, ),
    setRedeemPeriod: fun("0xf0d82e84", "setRedeemPeriod(uint256)", {"newRedeemPeriod": p.uint256}, ),
    setTotalPooledAvaxCap: fun("0xada03b38", "setTotalPooledAvaxCap(uint256)", {"newTotalPooledAvaxCap": p.uint256}, ),
    stakerCount: viewFun("0xdff69787", "stakerCount()", {}, p.uint256),
    submit: fun("0x5bcb2fc6", "submit()", {}, p.uint256),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalPooledAvax: viewFun("0x629e8056", "totalPooledAvax()", {}, p.uint256),
    totalPooledAvaxCap: viewFun("0x5cd47487", "totalPooledAvaxCap()", {}, p.uint256),
    totalShares: viewFun("0x3a98ef39", "totalShares()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"recipient": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"sender": p.address, "recipient": p.address, "amount": p.uint256}, p.bool),
    userSharesInCustody: viewFun("0x5d039525", "userSharesInCustody(address)", {"_0": p.address}, p.uint256),
    userUnlockRequests: viewFun("0xfd012e34", "userUnlockRequests(address,uint256)", {"_0": p.address, "_1": p.uint256}, {"startedAt": p.uint256, "shareAmount": p.uint256}),
    withdraw: fun("0x2e1a7d4d", "withdraw(uint256)", {"amount": p.uint256}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    ROLE_ACCRUE_REWARDS() {
        return this.eth_call(functions.ROLE_ACCRUE_REWARDS, {})
    }

    ROLE_DEPOSIT() {
        return this.eth_call(functions.ROLE_DEPOSIT, {})
    }

    ROLE_PAUSE() {
        return this.eth_call(functions.ROLE_PAUSE, {})
    }

    ROLE_PAUSE_MINTING() {
        return this.eth_call(functions.ROLE_PAUSE_MINTING, {})
    }

    ROLE_RESUME() {
        return this.eth_call(functions.ROLE_RESUME, {})
    }

    ROLE_RESUME_MINTING() {
        return this.eth_call(functions.ROLE_RESUME_MINTING, {})
    }

    ROLE_SET_TOTAL_POOLED_AVAX_CAP() {
        return this.eth_call(functions.ROLE_SET_TOTAL_POOLED_AVAX_CAP, {})
    }

    ROLE_WITHDRAW() {
        return this.eth_call(functions.ROLE_WITHDRAW, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    cooldownPeriod() {
        return this.eth_call(functions.cooldownPeriod, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getPaginatedUnlockRequests(user: GetPaginatedUnlockRequestsParams["user"], from: GetPaginatedUnlockRequestsParams["from"], to: GetPaginatedUnlockRequestsParams["to"]) {
        return this.eth_call(functions.getPaginatedUnlockRequests, {user, from, to})
    }

    getPooledAvaxByShares(shareAmount: GetPooledAvaxBySharesParams["shareAmount"]) {
        return this.eth_call(functions.getPooledAvaxByShares, {shareAmount})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    getRoleMember(role: GetRoleMemberParams["role"], index: GetRoleMemberParams["index"]) {
        return this.eth_call(functions.getRoleMember, {role, index})
    }

    getRoleMemberCount(role: GetRoleMemberCountParams["role"]) {
        return this.eth_call(functions.getRoleMemberCount, {role})
    }

    getSharesByPooledAvax(avaxAmount: GetSharesByPooledAvaxParams["avaxAmount"]) {
        return this.eth_call(functions.getSharesByPooledAvax, {avaxAmount})
    }

    getUnlockRequestCount(user: GetUnlockRequestCountParams["user"]) {
        return this.eth_call(functions.getUnlockRequestCount, {user})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    historicalExchangeRateTimestamps(_0: HistoricalExchangeRateTimestampsParams["_0"]) {
        return this.eth_call(functions.historicalExchangeRateTimestamps, {_0})
    }

    historicalExchangeRatesByTimestamp(_0: HistoricalExchangeRatesByTimestampParams["_0"]) {
        return this.eth_call(functions.historicalExchangeRatesByTimestamp, {_0})
    }

    mintingPaused() {
        return this.eth_call(functions.mintingPaused, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    redeemPeriod() {
        return this.eth_call(functions.redeemPeriod, {})
    }

    stakerCount() {
        return this.eth_call(functions.stakerCount, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalPooledAvax() {
        return this.eth_call(functions.totalPooledAvax, {})
    }

    totalPooledAvaxCap() {
        return this.eth_call(functions.totalPooledAvaxCap, {})
    }

    totalShares() {
        return this.eth_call(functions.totalShares, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    userSharesInCustody(_0: UserSharesInCustodyParams["_0"]) {
        return this.eth_call(functions.userSharesInCustody, {_0})
    }

    userUnlockRequests(_0: UserUnlockRequestsParams["_0"], _1: UserUnlockRequestsParams["_1"]) {
        return this.eth_call(functions.userUnlockRequests, {_0, _1})
    }
}

/// Event types
export type AccrueRewardsEventArgs = EParams<typeof events.AccrueRewards>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type CooldownPeriodUpdatedEventArgs = EParams<typeof events.CooldownPeriodUpdated>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type MintingPausedEventArgs = EParams<typeof events.MintingPaused>
export type MintingResumedEventArgs = EParams<typeof events.MintingResumed>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RedeemEventArgs = EParams<typeof events.Redeem>
export type RedeemOverdueSharesEventArgs = EParams<typeof events.RedeemOverdueShares>
export type RedeemPeriodUpdatedEventArgs = EParams<typeof events.RedeemPeriodUpdated>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type SubmittedEventArgs = EParams<typeof events.Submitted>
export type TotalPooledAvaxCapUpdatedEventArgs = EParams<typeof events.TotalPooledAvaxCapUpdated>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UnlockCancelledEventArgs = EParams<typeof events.UnlockCancelled>
export type UnlockRequestedEventArgs = EParams<typeof events.UnlockRequested>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type ROLE_ACCRUE_REWARDSParams = FunctionArguments<typeof functions.ROLE_ACCRUE_REWARDS>
export type ROLE_ACCRUE_REWARDSReturn = FunctionReturn<typeof functions.ROLE_ACCRUE_REWARDS>

export type ROLE_DEPOSITParams = FunctionArguments<typeof functions.ROLE_DEPOSIT>
export type ROLE_DEPOSITReturn = FunctionReturn<typeof functions.ROLE_DEPOSIT>

export type ROLE_PAUSEParams = FunctionArguments<typeof functions.ROLE_PAUSE>
export type ROLE_PAUSEReturn = FunctionReturn<typeof functions.ROLE_PAUSE>

export type ROLE_PAUSE_MINTINGParams = FunctionArguments<typeof functions.ROLE_PAUSE_MINTING>
export type ROLE_PAUSE_MINTINGReturn = FunctionReturn<typeof functions.ROLE_PAUSE_MINTING>

export type ROLE_RESUMEParams = FunctionArguments<typeof functions.ROLE_RESUME>
export type ROLE_RESUMEReturn = FunctionReturn<typeof functions.ROLE_RESUME>

export type ROLE_RESUME_MINTINGParams = FunctionArguments<typeof functions.ROLE_RESUME_MINTING>
export type ROLE_RESUME_MINTINGReturn = FunctionReturn<typeof functions.ROLE_RESUME_MINTING>

export type ROLE_SET_TOTAL_POOLED_AVAX_CAPParams = FunctionArguments<typeof functions.ROLE_SET_TOTAL_POOLED_AVAX_CAP>
export type ROLE_SET_TOTAL_POOLED_AVAX_CAPReturn = FunctionReturn<typeof functions.ROLE_SET_TOTAL_POOLED_AVAX_CAP>

export type ROLE_WITHDRAWParams = FunctionArguments<typeof functions.ROLE_WITHDRAW>
export type ROLE_WITHDRAWReturn = FunctionReturn<typeof functions.ROLE_WITHDRAW>

export type AccrueRewardsParams = FunctionArguments<typeof functions.accrueRewards>
export type AccrueRewardsReturn = FunctionReturn<typeof functions.accrueRewards>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type CancelPendingUnlockRequestsParams = FunctionArguments<typeof functions.cancelPendingUnlockRequests>
export type CancelPendingUnlockRequestsReturn = FunctionReturn<typeof functions.cancelPendingUnlockRequests>

export type CancelRedeemableUnlockRequestsParams = FunctionArguments<typeof functions.cancelRedeemableUnlockRequests>
export type CancelRedeemableUnlockRequestsReturn = FunctionReturn<typeof functions.cancelRedeemableUnlockRequests>

export type CancelUnlockRequestParams = FunctionArguments<typeof functions.cancelUnlockRequest>
export type CancelUnlockRequestReturn = FunctionReturn<typeof functions.cancelUnlockRequest>

export type CooldownPeriodParams = FunctionArguments<typeof functions.cooldownPeriod>
export type CooldownPeriodReturn = FunctionReturn<typeof functions.cooldownPeriod>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type GetPaginatedUnlockRequestsParams = FunctionArguments<typeof functions.getPaginatedUnlockRequests>
export type GetPaginatedUnlockRequestsReturn = FunctionReturn<typeof functions.getPaginatedUnlockRequests>

export type GetPooledAvaxBySharesParams = FunctionArguments<typeof functions.getPooledAvaxByShares>
export type GetPooledAvaxBySharesReturn = FunctionReturn<typeof functions.getPooledAvaxByShares>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetRoleMemberParams = FunctionArguments<typeof functions.getRoleMember>
export type GetRoleMemberReturn = FunctionReturn<typeof functions.getRoleMember>

export type GetRoleMemberCountParams = FunctionArguments<typeof functions.getRoleMemberCount>
export type GetRoleMemberCountReturn = FunctionReturn<typeof functions.getRoleMemberCount>

export type GetSharesByPooledAvaxParams = FunctionArguments<typeof functions.getSharesByPooledAvax>
export type GetSharesByPooledAvaxReturn = FunctionReturn<typeof functions.getSharesByPooledAvax>

export type GetUnlockRequestCountParams = FunctionArguments<typeof functions.getUnlockRequestCount>
export type GetUnlockRequestCountReturn = FunctionReturn<typeof functions.getUnlockRequestCount>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type HistoricalExchangeRateTimestampsParams = FunctionArguments<typeof functions.historicalExchangeRateTimestamps>
export type HistoricalExchangeRateTimestampsReturn = FunctionReturn<typeof functions.historicalExchangeRateTimestamps>

export type HistoricalExchangeRatesByTimestampParams = FunctionArguments<typeof functions.historicalExchangeRatesByTimestamp>
export type HistoricalExchangeRatesByTimestampReturn = FunctionReturn<typeof functions.historicalExchangeRatesByTimestamp>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type MintingPausedParams = FunctionArguments<typeof functions.mintingPaused>
export type MintingPausedReturn = FunctionReturn<typeof functions.mintingPaused>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PauseMintingParams = FunctionArguments<typeof functions.pauseMinting>
export type PauseMintingReturn = FunctionReturn<typeof functions.pauseMinting>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RedeemParams_0 = FunctionArguments<typeof functions['redeem()']>
export type RedeemReturn_0 = FunctionReturn<typeof functions['redeem()']>

export type RedeemParams_1 = FunctionArguments<typeof functions['redeem(uint256)']>
export type RedeemReturn_1 = FunctionReturn<typeof functions['redeem(uint256)']>

export type RedeemOverdueSharesParams_0 = FunctionArguments<typeof functions['redeemOverdueShares()']>
export type RedeemOverdueSharesReturn_0 = FunctionReturn<typeof functions['redeemOverdueShares()']>

export type RedeemOverdueSharesParams_1 = FunctionArguments<typeof functions['redeemOverdueShares(uint256)']>
export type RedeemOverdueSharesReturn_1 = FunctionReturn<typeof functions['redeemOverdueShares(uint256)']>

export type RedeemPeriodParams = FunctionArguments<typeof functions.redeemPeriod>
export type RedeemPeriodReturn = FunctionReturn<typeof functions.redeemPeriod>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RequestUnlockParams = FunctionArguments<typeof functions.requestUnlock>
export type RequestUnlockReturn = FunctionReturn<typeof functions.requestUnlock>

export type ResumeParams = FunctionArguments<typeof functions.resume>
export type ResumeReturn = FunctionReturn<typeof functions.resume>

export type ResumeMintingParams = FunctionArguments<typeof functions.resumeMinting>
export type ResumeMintingReturn = FunctionReturn<typeof functions.resumeMinting>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetCooldownPeriodParams = FunctionArguments<typeof functions.setCooldownPeriod>
export type SetCooldownPeriodReturn = FunctionReturn<typeof functions.setCooldownPeriod>

export type SetRedeemPeriodParams = FunctionArguments<typeof functions.setRedeemPeriod>
export type SetRedeemPeriodReturn = FunctionReturn<typeof functions.setRedeemPeriod>

export type SetTotalPooledAvaxCapParams = FunctionArguments<typeof functions.setTotalPooledAvaxCap>
export type SetTotalPooledAvaxCapReturn = FunctionReturn<typeof functions.setTotalPooledAvaxCap>

export type StakerCountParams = FunctionArguments<typeof functions.stakerCount>
export type StakerCountReturn = FunctionReturn<typeof functions.stakerCount>

export type SubmitParams = FunctionArguments<typeof functions.submit>
export type SubmitReturn = FunctionReturn<typeof functions.submit>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalPooledAvaxParams = FunctionArguments<typeof functions.totalPooledAvax>
export type TotalPooledAvaxReturn = FunctionReturn<typeof functions.totalPooledAvax>

export type TotalPooledAvaxCapParams = FunctionArguments<typeof functions.totalPooledAvaxCap>
export type TotalPooledAvaxCapReturn = FunctionReturn<typeof functions.totalPooledAvaxCap>

export type TotalSharesParams = FunctionArguments<typeof functions.totalShares>
export type TotalSharesReturn = FunctionReturn<typeof functions.totalShares>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UserSharesInCustodyParams = FunctionArguments<typeof functions.userSharesInCustody>
export type UserSharesInCustodyReturn = FunctionReturn<typeof functions.userSharesInCustody>

export type UserUnlockRequestsParams = FunctionArguments<typeof functions.userUnlockRequests>
export type UserUnlockRequestsReturn = FunctionReturn<typeof functions.userUnlockRequests>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

