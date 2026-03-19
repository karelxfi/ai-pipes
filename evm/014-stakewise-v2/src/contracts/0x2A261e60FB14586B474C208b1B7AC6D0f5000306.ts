import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AvgRewardPerSecondUpdated: event("0x575b153fd68e97b63239f63ca929196a4e398b8157c14ddb6bfc54dad71071cb", "AvgRewardPerSecondUpdated(uint256)", {"avgRewardPerSecond": p.uint256}),
    Burn: event("0x5d624aa9c148153ab3446c1b154f660ee7701e549fe9b62dab7171b1c80e6fa2", "Burn(address,address,uint256,uint256)", {"vault": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    CapacityUpdated: event("0x161ab4db855064d603dd1cc5517b1938db43fb85b56aab98c326b307dd1f9356", "CapacityUpdated(uint256)", {"capacity": p.uint256}),
    FeePercentUpdated: event("0xcbefe12795a171d23fc26333ec4f03a7478bae6ec54d70e18ff15ebca679407c", "FeePercentUpdated(uint16)", {"feePercent": p.uint16}),
    KeeperUpdated: event("0x0425bcd291db1d48816f2a98edc7ecaf6dd5c64b973d9e4b3b6b750763dc6c2e", "KeeperUpdated(address)", {"keeper": p.address}),
    Mint: event("0x2f00e3cdd69a77be7ed215ec7b2a36784dd158f921fca79ac29deffa353fe6ee", "Mint(address,address,uint256,uint256)", {"vault": indexed(p.address), "receiver": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    OwnershipTransferStarted: event("0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700", "OwnershipTransferStarted(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    StateUpdated: event("0xb27a3a9979877b12952e21e91eeded34f5ecc7d5147544ca7b58fa9cd85e30be", "StateUpdated(uint256,uint256,uint256)", {"profitAccrued": p.uint256, "treasuryShares": p.uint256, "treasuryAssets": p.uint256}),
    TreasuryUpdated: event("0x7dae230f18360d76a040c81f050aa14eb9d6dc7901b20fc5d855e2a20fe814d1", "TreasuryUpdated(address)", {"treasury": indexed(p.address)}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    avgRewardPerSecond: viewFun("0x8d7d4520", "avgRewardPerSecond()", {}, p.uint256),
    burnShares: fun("0xee7a7c04", "burnShares(address,uint256)", {"owner": p.address, "shares": p.uint256}, p.uint256),
    capacity: viewFun("0x5cfc1a51", "capacity()", {}, p.uint256),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets": p.uint256}, p.uint256),
    cumulativeFeePerShare: viewFun("0x752a536d", "cumulativeFeePerShare()", {}, p.uint256),
    feePercent: viewFun("0x7fd6f15c", "feePercent()", {}, p.uint64),
    keeper: viewFun("0xaced1661", "keeper()", {}, p.address),
    mintShares: fun("0x528c198a", "mintShares(address,uint256)", {"receiver": p.address, "shares": p.uint256}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pendingOwner: viewFun("0xe30c3978", "pendingOwner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    setAvgRewardPerSecond: fun("0xa52bbb89", "setAvgRewardPerSecond(uint256)", {"_avgRewardPerSecond": p.uint256}, ),
    setCapacity: fun("0x91915ef8", "setCapacity(uint256)", {"_capacity": p.uint256}, ),
    setFeePercent: fun("0x0402f196", "setFeePercent(uint16)", {"_feePercent": p.uint16}, ),
    setKeeper: fun("0x748747e6", "setKeeper(address)", {"_keeper": p.address}, ),
    setTreasury: fun("0xf0f44260", "setTreasury(address)", {"_treasury": p.address}, ),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalShares: viewFun("0x3a98ef39", "totalShares()", {}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    treasury: viewFun("0x61d027b3", "treasury()", {}, p.address),
    updateState: fun("0x1d8557d7", "updateState()", {}, ),
}

export class Contract extends ContractBase {

    avgRewardPerSecond() {
        return this.eth_call(functions.avgRewardPerSecond, {})
    }

    capacity() {
        return this.eth_call(functions.capacity, {})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    cumulativeFeePerShare() {
        return this.eth_call(functions.cumulativeFeePerShare, {})
    }

    feePercent() {
        return this.eth_call(functions.feePercent, {})
    }

    keeper() {
        return this.eth_call(functions.keeper, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingOwner() {
        return this.eth_call(functions.pendingOwner, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalShares() {
        return this.eth_call(functions.totalShares, {})
    }

    treasury() {
        return this.eth_call(functions.treasury, {})
    }
}

/// Event types
export type AvgRewardPerSecondUpdatedEventArgs = EParams<typeof events.AvgRewardPerSecondUpdated>
export type BurnEventArgs = EParams<typeof events.Burn>
export type CapacityUpdatedEventArgs = EParams<typeof events.CapacityUpdated>
export type FeePercentUpdatedEventArgs = EParams<typeof events.FeePercentUpdated>
export type KeeperUpdatedEventArgs = EParams<typeof events.KeeperUpdated>
export type MintEventArgs = EParams<typeof events.Mint>
export type OwnershipTransferStartedEventArgs = EParams<typeof events.OwnershipTransferStarted>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type StateUpdatedEventArgs = EParams<typeof events.StateUpdated>
export type TreasuryUpdatedEventArgs = EParams<typeof events.TreasuryUpdated>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type AvgRewardPerSecondParams = FunctionArguments<typeof functions.avgRewardPerSecond>
export type AvgRewardPerSecondReturn = FunctionReturn<typeof functions.avgRewardPerSecond>

export type BurnSharesParams = FunctionArguments<typeof functions.burnShares>
export type BurnSharesReturn = FunctionReturn<typeof functions.burnShares>

export type CapacityParams = FunctionArguments<typeof functions.capacity>
export type CapacityReturn = FunctionReturn<typeof functions.capacity>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type CumulativeFeePerShareParams = FunctionArguments<typeof functions.cumulativeFeePerShare>
export type CumulativeFeePerShareReturn = FunctionReturn<typeof functions.cumulativeFeePerShare>

export type FeePercentParams = FunctionArguments<typeof functions.feePercent>
export type FeePercentReturn = FunctionReturn<typeof functions.feePercent>

export type KeeperParams = FunctionArguments<typeof functions.keeper>
export type KeeperReturn = FunctionReturn<typeof functions.keeper>

export type MintSharesParams = FunctionArguments<typeof functions.mintShares>
export type MintSharesReturn = FunctionReturn<typeof functions.mintShares>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingOwnerParams = FunctionArguments<typeof functions.pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof functions.pendingOwner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SetAvgRewardPerSecondParams = FunctionArguments<typeof functions.setAvgRewardPerSecond>
export type SetAvgRewardPerSecondReturn = FunctionReturn<typeof functions.setAvgRewardPerSecond>

export type SetCapacityParams = FunctionArguments<typeof functions.setCapacity>
export type SetCapacityReturn = FunctionReturn<typeof functions.setCapacity>

export type SetFeePercentParams = FunctionArguments<typeof functions.setFeePercent>
export type SetFeePercentReturn = FunctionReturn<typeof functions.setFeePercent>

export type SetKeeperParams = FunctionArguments<typeof functions.setKeeper>
export type SetKeeperReturn = FunctionReturn<typeof functions.setKeeper>

export type SetTreasuryParams = FunctionArguments<typeof functions.setTreasury>
export type SetTreasuryReturn = FunctionReturn<typeof functions.setTreasury>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSharesParams = FunctionArguments<typeof functions.totalShares>
export type TotalSharesReturn = FunctionReturn<typeof functions.totalShares>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type TreasuryParams = FunctionArguments<typeof functions.treasury>
export type TreasuryReturn = FunctionReturn<typeof functions.treasury>

export type UpdateStateParams = FunctionArguments<typeof functions.updateState>
export type UpdateStateReturn = FunctionReturn<typeof functions.updateState>

