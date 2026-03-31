import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    SetStaker: event("0x6901da73a3480b0bbd7deb64f259ff29a76ce811c7a3e5cf495f0e1eb4fb4dfb", "SetStaker(address)", {"staker": indexed(p.address)}),
    WithdrawAdminFees: event("0x78b4892921a904766a871a893b75e9461080a308419f358353f73739b29c7fc4", "WithdrawAdminFees(address,uint256)", {"receiver": p.address, "amount": p.uint256}),
    AllocateStablecoins: event("0x6f16a992fba7b966942bb6064775e154f99de09fce962940d4e284c5c9132868", "AllocateStablecoins(address,uint256,uint256)", {"allocator": indexed(p.address), "stablecoin_allocation": p.uint256, "stablecoin_allocated": p.uint256}),
    DistributeBorrowerFees: event("0x5bdcb9afddbd4bbebe8e11112e8b8ba0008f38b107b6c8d4bed13e9fb40acb1c", "DistributeBorrowerFees(address,uint256,uint256,uint256)", {"sender": indexed(p.address), "amount": p.uint256, "min_amount": p.uint256, "discount": p.uint256}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"sender": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", "Withdraw(address,address,address,uint256,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    SetAdmin: event("0x5a272403b402d892977df56625f4164ccaf70ca3863991c43ecfe76a6905b0a1", "SetAdmin(address)", {"admin": p.address}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
}

export const functions = {
    min_admin_fee: viewFun("0x8c5710c9", "min_admin_fee()", {}, p.uint256),
    preview_deposit: viewFun("0x39116704", "preview_deposit(uint256,uint256)", {"assets": p.uint256, "debt": p.uint256}, p.uint256),
    preview_withdraw: viewFun("0xf51dd485", "preview_withdraw(uint256)", {"tokens": p.uint256}, p.uint256),
    'deposit(uint256,uint256,uint256)': fun("0x00aeef8a", "deposit(uint256,uint256,uint256)", {"assets": p.uint256, "debt": p.uint256, "min_shares": p.uint256}, p.uint256),
    'deposit(uint256,uint256,uint256,address)': fun("0xfad3cc4b", "deposit(uint256,uint256,uint256,address)", {"assets": p.uint256, "debt": p.uint256, "min_shares": p.uint256, "receiver": p.address}, p.uint256),
    'withdraw(uint256,uint256)': fun("0x441a3e70", "withdraw(uint256,uint256)", {"shares": p.uint256, "min_assets": p.uint256}, p.uint256),
    'withdraw(uint256,uint256,address)': fun("0x0ad58d2f", "withdraw(uint256,uint256,address)", {"shares": p.uint256, "min_assets": p.uint256, "receiver": p.address}, p.uint256),
    preview_emergency_withdraw: viewFun("0x650dfae2", "preview_emergency_withdraw(uint256)", {"shares": p.uint256}, {"_0": p.uint256, "_1": p.int256}),
    'emergency_withdraw(uint256)': fun("0xec46bf8f", "emergency_withdraw(uint256)", {"shares": p.uint256}, {"_0": p.uint256, "_1": p.int256}),
    'emergency_withdraw(uint256,address)': fun("0xb78be802", "emergency_withdraw(uint256,address)", {"shares": p.uint256, "receiver": p.address}, {"_0": p.uint256, "_1": p.int256}),
    'emergency_withdraw(uint256,address,address)': fun("0xd5569431", "emergency_withdraw(uint256,address,address)", {"shares": p.uint256, "receiver": p.address, "owner": p.address}, {"_0": p.uint256, "_1": p.int256}),
    checkpoint_staker_rebase: fun("0x8fa57492", "checkpoint_staker_rebase()", {}, ),
    pricePerShare: viewFun("0x99530b06", "pricePerShare()", {}, p.uint256),
    set_amm: fun("0x6831c45b", "set_amm(address)", {"amm": p.address}, ),
    set_admin: fun("0xe9333fab", "set_admin(address)", {"new_admin": p.address}, ),
    set_rate: fun("0xd4387a99", "set_rate(uint256)", {"rate": p.uint256}, ),
    set_amm_fee: fun("0x4189617d", "set_amm_fee(uint256)", {"fee": p.uint256}, ),
    'allocate_stablecoins()': fun("0x16126c50", "allocate_stablecoins()", {}, ),
    'allocate_stablecoins(uint256)': fun("0xe5ef2aae", "allocate_stablecoins(uint256)", {"limit": p.uint256}, ),
    'distribute_borrower_fees()': fun("0x7ba3152e", "distribute_borrower_fees()", {}, ),
    'distribute_borrower_fees(uint256)': fun("0xe3e4bbbb", "distribute_borrower_fees(uint256)", {"discount": p.uint256}, ),
    withdraw_admin_fees: fun("0x30c54085", "withdraw_admin_fees()", {}, ),
    set_staker: fun("0x464d700b", "set_staker(address)", {"staker": p.address}, ),
    set_killed: fun("0x90b22997", "set_killed(bool)", {"is_killed": p.bool}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_value": p.uint256}, p.bool),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_to": p.address, "_value": p.uint256}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_spender": p.address, "_value": p.uint256}, p.bool),
    is_killed: viewFun("0x9c868ac0", "is_killed()", {}, p.bool),
    CRYPTOPOOL: viewFun("0x93d9d94c", "CRYPTOPOOL()", {}, p.address),
    STABLECOIN: viewFun("0x93a39776", "STABLECOIN()", {}, p.address),
    ASSET_TOKEN: viewFun("0xd7062005", "ASSET_TOKEN()", {}, p.address),
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    amm: viewFun("0x2a943945", "amm()", {}, p.address),
    agg: viewFun("0xf5e34bfa", "agg()", {}, p.address),
    staker: viewFun("0x5ebaf1db", "staker()", {}, p.address),
    liquidity: viewFun("0x1a686502", "liquidity()", {}, p.struct({"admin": p.int256, "total": p.uint256, "ideal_staked": p.uint256, "staked": p.uint256})),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"arg0": p.address, "arg1": p.address}, p.uint256),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"arg0": p.address}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    stablecoin_allocation: viewFun("0x36b2e3e8", "stablecoin_allocation()", {}, p.uint256),
    stablecoin_allocated: viewFun("0x6d893449", "stablecoin_allocated()", {}, p.uint256),
}

export class Contract extends ContractBase {

    min_admin_fee() {
        return this.eth_call(functions.min_admin_fee, {})
    }

    preview_deposit(assets: Preview_depositParams["assets"], debt: Preview_depositParams["debt"]) {
        return this.eth_call(functions.preview_deposit, {assets, debt})
    }

    preview_withdraw(tokens: Preview_withdrawParams["tokens"]) {
        return this.eth_call(functions.preview_withdraw, {tokens})
    }

    preview_emergency_withdraw(shares: Preview_emergency_withdrawParams["shares"]) {
        return this.eth_call(functions.preview_emergency_withdraw, {shares})
    }

    pricePerShare() {
        return this.eth_call(functions.pricePerShare, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    is_killed() {
        return this.eth_call(functions.is_killed, {})
    }

    CRYPTOPOOL() {
        return this.eth_call(functions.CRYPTOPOOL, {})
    }

    STABLECOIN() {
        return this.eth_call(functions.STABLECOIN, {})
    }

    ASSET_TOKEN() {
        return this.eth_call(functions.ASSET_TOKEN, {})
    }

    admin() {
        return this.eth_call(functions.admin, {})
    }

    amm() {
        return this.eth_call(functions.amm, {})
    }

    agg() {
        return this.eth_call(functions.agg, {})
    }

    staker() {
        return this.eth_call(functions.staker, {})
    }

    liquidity() {
        return this.eth_call(functions.liquidity, {})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(functions.allowance, {arg0, arg1})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(functions.balanceOf, {arg0})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    stablecoin_allocation() {
        return this.eth_call(functions.stablecoin_allocation, {})
    }

    stablecoin_allocated() {
        return this.eth_call(functions.stablecoin_allocated, {})
    }
}

/// Event types
export type SetStakerEventArgs = EParams<typeof events.SetStaker>
export type WithdrawAdminFeesEventArgs = EParams<typeof events.WithdrawAdminFees>
export type AllocateStablecoinsEventArgs = EParams<typeof events.AllocateStablecoins>
export type DistributeBorrowerFeesEventArgs = EParams<typeof events.DistributeBorrowerFees>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>
export type SetAdminEventArgs = EParams<typeof events.SetAdmin>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>

/// Function types
export type Min_admin_feeParams = FunctionArguments<typeof functions.min_admin_fee>
export type Min_admin_feeReturn = FunctionReturn<typeof functions.min_admin_fee>

export type Preview_depositParams = FunctionArguments<typeof functions.preview_deposit>
export type Preview_depositReturn = FunctionReturn<typeof functions.preview_deposit>

export type Preview_withdrawParams = FunctionArguments<typeof functions.preview_withdraw>
export type Preview_withdrawReturn = FunctionReturn<typeof functions.preview_withdraw>

export type DepositParams_0 = FunctionArguments<typeof functions['deposit(uint256,uint256,uint256)']>
export type DepositReturn_0 = FunctionReturn<typeof functions['deposit(uint256,uint256,uint256)']>

export type DepositParams_1 = FunctionArguments<typeof functions['deposit(uint256,uint256,uint256,address)']>
export type DepositReturn_1 = FunctionReturn<typeof functions['deposit(uint256,uint256,uint256,address)']>

export type WithdrawParams_0 = FunctionArguments<typeof functions['withdraw(uint256,uint256)']>
export type WithdrawReturn_0 = FunctionReturn<typeof functions['withdraw(uint256,uint256)']>

export type WithdrawParams_1 = FunctionArguments<typeof functions['withdraw(uint256,uint256,address)']>
export type WithdrawReturn_1 = FunctionReturn<typeof functions['withdraw(uint256,uint256,address)']>

export type Preview_emergency_withdrawParams = FunctionArguments<typeof functions.preview_emergency_withdraw>
export type Preview_emergency_withdrawReturn = FunctionReturn<typeof functions.preview_emergency_withdraw>

export type Emergency_withdrawParams_0 = FunctionArguments<typeof functions['emergency_withdraw(uint256)']>
export type Emergency_withdrawReturn_0 = FunctionReturn<typeof functions['emergency_withdraw(uint256)']>

export type Emergency_withdrawParams_1 = FunctionArguments<typeof functions['emergency_withdraw(uint256,address)']>
export type Emergency_withdrawReturn_1 = FunctionReturn<typeof functions['emergency_withdraw(uint256,address)']>

export type Emergency_withdrawParams_2 = FunctionArguments<typeof functions['emergency_withdraw(uint256,address,address)']>
export type Emergency_withdrawReturn_2 = FunctionReturn<typeof functions['emergency_withdraw(uint256,address,address)']>

export type Checkpoint_staker_rebaseParams = FunctionArguments<typeof functions.checkpoint_staker_rebase>
export type Checkpoint_staker_rebaseReturn = FunctionReturn<typeof functions.checkpoint_staker_rebase>

export type PricePerShareParams = FunctionArguments<typeof functions.pricePerShare>
export type PricePerShareReturn = FunctionReturn<typeof functions.pricePerShare>

export type Set_ammParams = FunctionArguments<typeof functions.set_amm>
export type Set_ammReturn = FunctionReturn<typeof functions.set_amm>

export type Set_adminParams = FunctionArguments<typeof functions.set_admin>
export type Set_adminReturn = FunctionReturn<typeof functions.set_admin>

export type Set_rateParams = FunctionArguments<typeof functions.set_rate>
export type Set_rateReturn = FunctionReturn<typeof functions.set_rate>

export type Set_amm_feeParams = FunctionArguments<typeof functions.set_amm_fee>
export type Set_amm_feeReturn = FunctionReturn<typeof functions.set_amm_fee>

export type Allocate_stablecoinsParams_0 = FunctionArguments<typeof functions['allocate_stablecoins()']>
export type Allocate_stablecoinsReturn_0 = FunctionReturn<typeof functions['allocate_stablecoins()']>

export type Allocate_stablecoinsParams_1 = FunctionArguments<typeof functions['allocate_stablecoins(uint256)']>
export type Allocate_stablecoinsReturn_1 = FunctionReturn<typeof functions['allocate_stablecoins(uint256)']>

export type Distribute_borrower_feesParams_0 = FunctionArguments<typeof functions['distribute_borrower_fees()']>
export type Distribute_borrower_feesReturn_0 = FunctionReturn<typeof functions['distribute_borrower_fees()']>

export type Distribute_borrower_feesParams_1 = FunctionArguments<typeof functions['distribute_borrower_fees(uint256)']>
export type Distribute_borrower_feesReturn_1 = FunctionReturn<typeof functions['distribute_borrower_fees(uint256)']>

export type Withdraw_admin_feesParams = FunctionArguments<typeof functions.withdraw_admin_fees>
export type Withdraw_admin_feesReturn = FunctionReturn<typeof functions.withdraw_admin_fees>

export type Set_stakerParams = FunctionArguments<typeof functions.set_staker>
export type Set_stakerReturn = FunctionReturn<typeof functions.set_staker>

export type Set_killedParams = FunctionArguments<typeof functions.set_killed>
export type Set_killedReturn = FunctionReturn<typeof functions.set_killed>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type Is_killedParams = FunctionArguments<typeof functions.is_killed>
export type Is_killedReturn = FunctionReturn<typeof functions.is_killed>

export type CRYPTOPOOLParams = FunctionArguments<typeof functions.CRYPTOPOOL>
export type CRYPTOPOOLReturn = FunctionReturn<typeof functions.CRYPTOPOOL>

export type STABLECOINParams = FunctionArguments<typeof functions.STABLECOIN>
export type STABLECOINReturn = FunctionReturn<typeof functions.STABLECOIN>

export type ASSET_TOKENParams = FunctionArguments<typeof functions.ASSET_TOKEN>
export type ASSET_TOKENReturn = FunctionReturn<typeof functions.ASSET_TOKEN>

export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type AmmParams = FunctionArguments<typeof functions.amm>
export type AmmReturn = FunctionReturn<typeof functions.amm>

export type AggParams = FunctionArguments<typeof functions.agg>
export type AggReturn = FunctionReturn<typeof functions.agg>

export type StakerParams = FunctionArguments<typeof functions.staker>
export type StakerReturn = FunctionReturn<typeof functions.staker>

export type LiquidityParams = FunctionArguments<typeof functions.liquidity>
export type LiquidityReturn = FunctionReturn<typeof functions.liquidity>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type Stablecoin_allocationParams = FunctionArguments<typeof functions.stablecoin_allocation>
export type Stablecoin_allocationReturn = FunctionReturn<typeof functions.stablecoin_allocation>

export type Stablecoin_allocatedParams = FunctionArguments<typeof functions.stablecoin_allocated>
export type Stablecoin_allocatedReturn = FunctionReturn<typeof functions.stablecoin_allocated>

