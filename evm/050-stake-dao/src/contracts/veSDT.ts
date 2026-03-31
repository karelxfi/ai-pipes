import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    CommitOwnership: event("0x2f56810a6bf40af059b96d3aea4db54081f378029a518390491093a7b67032e9", "CommitOwnership(address)", {"admin": p.address}),
    ApplyOwnership: event("0xebee2d5739011062cb4f14113f3b36bf0ffe3da5c0568f64189d1012a1189105", "ApplyOwnership(address)", {"admin": p.address}),
    Deposit: event("0x4566dfc29f6f11d13a418c26a02bef7c28bae749d4de47e4e6a7cddea6730d59", "Deposit(address,uint256,uint256,int128,uint256)", {"provider": indexed(p.address), "value": p.uint256, "locktime": indexed(p.uint256), "type": p.int128, "ts": p.uint256}),
    Withdraw: event("0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568", "Withdraw(address,uint256,uint256)", {"provider": indexed(p.address), "value": p.uint256, "ts": p.uint256}),
    Supply: event("0x5e2aa66efd74cce82b21852e317e5490d9ecc9e6bb953ae24d90851258cc2f5c", "Supply(uint256,uint256)", {"prevSupply": p.uint256, "supply": p.uint256}),
}

export const functions = {
    initialize: fun("0x83b43589", "initialize(address,address,address,string,string)", {"_admin": p.address, "token_addr": p.address, "_smart_wallet_checker": p.address, "_name": p.string, "_symbol": p.string}, ),
    commit_transfer_ownership: fun("0x6b441a40", "commit_transfer_ownership(address)", {"addr": p.address}, ),
    accept_transfer_ownership: fun("0xe5ea47b8", "accept_transfer_ownership()", {}, ),
    apply_transfer_ownership: fun("0x6a1c05ae", "apply_transfer_ownership()", {}, ),
    commit_smart_wallet_checker: fun("0x57f901e2", "commit_smart_wallet_checker(address)", {"addr": p.address}, ),
    apply_smart_wallet_checker: fun("0x8e5b490f", "apply_smart_wallet_checker()", {}, ),
    get_last_user_slope: viewFun("0x7c74a174", "get_last_user_slope(address)", {"addr": p.address}, p.int128),
    user_point_history__ts: viewFun("0xda020a18", "user_point_history__ts(address,uint256)", {"_addr": p.address, "_idx": p.uint256}, p.uint256),
    locked__end: viewFun("0xadc63589", "locked__end(address)", {"_addr": p.address}, p.uint256),
    checkpoint: fun("0xc2c4c5c1", "checkpoint()", {}, ),
    deposit_for: fun("0x3a46273e", "deposit_for(address,uint256)", {"_addr": p.address, "_value": p.uint256}, ),
    deposit_for_from: fun("0x301d4a0d", "deposit_for_from(address,uint256)", {"_addr": p.address, "_value": p.uint256}, ),
    create_lock: fun("0x65fc3873", "create_lock(uint256,uint256)", {"_value": p.uint256, "_unlock_time": p.uint256}, ),
    increase_amount: fun("0x4957677c", "increase_amount(uint256)", {"_value": p.uint256}, ),
    increase_unlock_time: fun("0xeff7a612", "increase_unlock_time(uint256)", {"_unlock_time": p.uint256}, ),
    withdraw: fun("0x3ccfd60b", "withdraw()", {}, ),
    'balanceOf(address)': viewFun("0x70a08231", "balanceOf(address)", {"addr": p.address}, p.uint256),
    'balanceOf(address,uint256)': viewFun("0x00fdd58e", "balanceOf(address,uint256)", {"addr": p.address, "_t": p.uint256}, p.uint256),
    balanceOfAt: viewFun("0x4ee2cd7e", "balanceOfAt(address,uint256)", {"addr": p.address, "_block": p.uint256}, p.uint256),
    getPastVotes: viewFun("0x3a46b1a8", "getPastVotes(address,uint256)", {"addr": p.address, "_block": p.uint256}, p.uint256),
    'totalSupply()': viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    'totalSupply(uint256)': viewFun("0xbd85b039", "totalSupply(uint256)", {"t": p.uint256}, p.uint256),
    totalSupplyAt: viewFun("0x981b24d0", "totalSupplyAt(uint256)", {"_block": p.uint256}, p.uint256),
    token: viewFun("0xfc0c546a", "token()", {}, p.address),
    supply: viewFun("0x047fc9aa", "supply()", {}, p.uint256),
    locked: viewFun("0xcbf9fe5f", "locked(address)", {"arg0": p.address}, {"amount": p.int128, "end": p.uint256}),
    epoch: viewFun("0x900cf0cf", "epoch()", {}, p.uint256),
    point_history: viewFun("0xd1febfb9", "point_history(uint256)", {"arg0": p.uint256}, {"bias": p.int128, "slope": p.int128, "ts": p.uint256, "blk": p.uint256}),
    user_point_history: viewFun("0x28d09d47", "user_point_history(address,uint256)", {"arg0": p.address, "arg1": p.uint256}, {"bias": p.int128, "slope": p.int128, "ts": p.uint256, "blk": p.uint256}),
    user_point_epoch: viewFun("0x010ae757", "user_point_epoch(address)", {"arg0": p.address}, p.uint256),
    slope_changes: viewFun("0x71197484", "slope_changes(uint256)", {"arg0": p.uint256}, p.int128),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint256),
    future_smart_wallet_checker: viewFun("0x8ff36fd1", "future_smart_wallet_checker()", {}, p.address),
    smart_wallet_checker: viewFun("0x7175d4f7", "smart_wallet_checker()", {}, p.address),
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    future_admin: viewFun("0x17f7182a", "future_admin()", {}, p.address),
    initialized: viewFun("0x158ef93e", "initialized()", {}, p.bool),
}

export class Contract extends ContractBase {

    get_last_user_slope(addr: Get_last_user_slopeParams["addr"]) {
        return this.eth_call(functions.get_last_user_slope, {addr})
    }

    user_point_history__ts(_addr: User_point_history__tsParams["_addr"], _idx: User_point_history__tsParams["_idx"]) {
        return this.eth_call(functions.user_point_history__ts, {_addr, _idx})
    }

    locked__end(_addr: Locked__endParams["_addr"]) {
        return this.eth_call(functions.locked__end, {_addr})
    }

    'balanceOf(address)'(addr: BalanceOfParams_0["addr"]) {
        return this.eth_call(functions['balanceOf(address)'], {addr})
    }

    'balanceOf(address,uint256)'(addr: BalanceOfParams_1["addr"], _t: BalanceOfParams_1["_t"]) {
        return this.eth_call(functions['balanceOf(address,uint256)'], {addr, _t})
    }

    balanceOfAt(addr: BalanceOfAtParams["addr"], _block: BalanceOfAtParams["_block"]) {
        return this.eth_call(functions.balanceOfAt, {addr, _block})
    }

    getPastVotes(addr: GetPastVotesParams["addr"], _block: GetPastVotesParams["_block"]) {
        return this.eth_call(functions.getPastVotes, {addr, _block})
    }

    'totalSupply()'() {
        return this.eth_call(functions['totalSupply()'], {})
    }

    'totalSupply(uint256)'(t: TotalSupplyParams_1["t"]) {
        return this.eth_call(functions['totalSupply(uint256)'], {t})
    }

    totalSupplyAt(_block: TotalSupplyAtParams["_block"]) {
        return this.eth_call(functions.totalSupplyAt, {_block})
    }

    token() {
        return this.eth_call(functions.token, {})
    }

    supply() {
        return this.eth_call(functions.supply, {})
    }

    locked(arg0: LockedParams["arg0"]) {
        return this.eth_call(functions.locked, {arg0})
    }

    epoch() {
        return this.eth_call(functions.epoch, {})
    }

    point_history(arg0: Point_historyParams["arg0"]) {
        return this.eth_call(functions.point_history, {arg0})
    }

    user_point_history(arg0: User_point_historyParams["arg0"], arg1: User_point_historyParams["arg1"]) {
        return this.eth_call(functions.user_point_history, {arg0, arg1})
    }

    user_point_epoch(arg0: User_point_epochParams["arg0"]) {
        return this.eth_call(functions.user_point_epoch, {arg0})
    }

    slope_changes(arg0: Slope_changesParams["arg0"]) {
        return this.eth_call(functions.slope_changes, {arg0})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    future_smart_wallet_checker() {
        return this.eth_call(functions.future_smart_wallet_checker, {})
    }

    smart_wallet_checker() {
        return this.eth_call(functions.smart_wallet_checker, {})
    }

    admin() {
        return this.eth_call(functions.admin, {})
    }

    future_admin() {
        return this.eth_call(functions.future_admin, {})
    }

    initialized() {
        return this.eth_call(functions.initialized, {})
    }
}

/// Event types
export type CommitOwnershipEventArgs = EParams<typeof events.CommitOwnership>
export type ApplyOwnershipEventArgs = EParams<typeof events.ApplyOwnership>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>
export type SupplyEventArgs = EParams<typeof events.Supply>

/// Function types
export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type Commit_transfer_ownershipParams = FunctionArguments<typeof functions.commit_transfer_ownership>
export type Commit_transfer_ownershipReturn = FunctionReturn<typeof functions.commit_transfer_ownership>

export type Accept_transfer_ownershipParams = FunctionArguments<typeof functions.accept_transfer_ownership>
export type Accept_transfer_ownershipReturn = FunctionReturn<typeof functions.accept_transfer_ownership>

export type Apply_transfer_ownershipParams = FunctionArguments<typeof functions.apply_transfer_ownership>
export type Apply_transfer_ownershipReturn = FunctionReturn<typeof functions.apply_transfer_ownership>

export type Commit_smart_wallet_checkerParams = FunctionArguments<typeof functions.commit_smart_wallet_checker>
export type Commit_smart_wallet_checkerReturn = FunctionReturn<typeof functions.commit_smart_wallet_checker>

export type Apply_smart_wallet_checkerParams = FunctionArguments<typeof functions.apply_smart_wallet_checker>
export type Apply_smart_wallet_checkerReturn = FunctionReturn<typeof functions.apply_smart_wallet_checker>

export type Get_last_user_slopeParams = FunctionArguments<typeof functions.get_last_user_slope>
export type Get_last_user_slopeReturn = FunctionReturn<typeof functions.get_last_user_slope>

export type User_point_history__tsParams = FunctionArguments<typeof functions.user_point_history__ts>
export type User_point_history__tsReturn = FunctionReturn<typeof functions.user_point_history__ts>

export type Locked__endParams = FunctionArguments<typeof functions.locked__end>
export type Locked__endReturn = FunctionReturn<typeof functions.locked__end>

export type CheckpointParams = FunctionArguments<typeof functions.checkpoint>
export type CheckpointReturn = FunctionReturn<typeof functions.checkpoint>

export type Deposit_forParams = FunctionArguments<typeof functions.deposit_for>
export type Deposit_forReturn = FunctionReturn<typeof functions.deposit_for>

export type Deposit_for_fromParams = FunctionArguments<typeof functions.deposit_for_from>
export type Deposit_for_fromReturn = FunctionReturn<typeof functions.deposit_for_from>

export type Create_lockParams = FunctionArguments<typeof functions.create_lock>
export type Create_lockReturn = FunctionReturn<typeof functions.create_lock>

export type Increase_amountParams = FunctionArguments<typeof functions.increase_amount>
export type Increase_amountReturn = FunctionReturn<typeof functions.increase_amount>

export type Increase_unlock_timeParams = FunctionArguments<typeof functions.increase_unlock_time>
export type Increase_unlock_timeReturn = FunctionReturn<typeof functions.increase_unlock_time>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type BalanceOfParams_0 = FunctionArguments<typeof functions['balanceOf(address)']>
export type BalanceOfReturn_0 = FunctionReturn<typeof functions['balanceOf(address)']>

export type BalanceOfParams_1 = FunctionArguments<typeof functions['balanceOf(address,uint256)']>
export type BalanceOfReturn_1 = FunctionReturn<typeof functions['balanceOf(address,uint256)']>

export type BalanceOfAtParams = FunctionArguments<typeof functions.balanceOfAt>
export type BalanceOfAtReturn = FunctionReturn<typeof functions.balanceOfAt>

export type GetPastVotesParams = FunctionArguments<typeof functions.getPastVotes>
export type GetPastVotesReturn = FunctionReturn<typeof functions.getPastVotes>

export type TotalSupplyParams_0 = FunctionArguments<typeof functions['totalSupply()']>
export type TotalSupplyReturn_0 = FunctionReturn<typeof functions['totalSupply()']>

export type TotalSupplyParams_1 = FunctionArguments<typeof functions['totalSupply(uint256)']>
export type TotalSupplyReturn_1 = FunctionReturn<typeof functions['totalSupply(uint256)']>

export type TotalSupplyAtParams = FunctionArguments<typeof functions.totalSupplyAt>
export type TotalSupplyAtReturn = FunctionReturn<typeof functions.totalSupplyAt>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type SupplyParams = FunctionArguments<typeof functions.supply>
export type SupplyReturn = FunctionReturn<typeof functions.supply>

export type LockedParams = FunctionArguments<typeof functions.locked>
export type LockedReturn = FunctionReturn<typeof functions.locked>

export type EpochParams = FunctionArguments<typeof functions.epoch>
export type EpochReturn = FunctionReturn<typeof functions.epoch>

export type Point_historyParams = FunctionArguments<typeof functions.point_history>
export type Point_historyReturn = FunctionReturn<typeof functions.point_history>

export type User_point_historyParams = FunctionArguments<typeof functions.user_point_history>
export type User_point_historyReturn = FunctionReturn<typeof functions.user_point_history>

export type User_point_epochParams = FunctionArguments<typeof functions.user_point_epoch>
export type User_point_epochReturn = FunctionReturn<typeof functions.user_point_epoch>

export type Slope_changesParams = FunctionArguments<typeof functions.slope_changes>
export type Slope_changesReturn = FunctionReturn<typeof functions.slope_changes>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type Future_smart_wallet_checkerParams = FunctionArguments<typeof functions.future_smart_wallet_checker>
export type Future_smart_wallet_checkerReturn = FunctionReturn<typeof functions.future_smart_wallet_checker>

export type Smart_wallet_checkerParams = FunctionArguments<typeof functions.smart_wallet_checker>
export type Smart_wallet_checkerReturn = FunctionReturn<typeof functions.smart_wallet_checker>

export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type Future_adminParams = FunctionArguments<typeof functions.future_admin>
export type Future_adminReturn = FunctionReturn<typeof functions.future_admin>

export type InitializedParams = FunctionArguments<typeof functions.initialized>
export type InitializedReturn = FunctionReturn<typeof functions.initialized>

