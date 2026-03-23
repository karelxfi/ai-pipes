import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ActivePoolAddressChanged: event("0x78f058b189175430c48dc02699e3a0031ea4ff781536dc2fab847de4babdd882", "ActivePoolAddressChanged(address)", {"_activePoolAddress": p.address}),
    BaseRateUpdated: event("0xc454ee9b76c52f782a256af821b857ca6e125d1e3333bcede402fec2bed9600c", "BaseRateUpdated(uint256)", {"_baseRate": p.uint256}),
    BorrowerOperationsAddressChanged: event("0x3ca631ffcd2a9b5d9ae18543fc82f58eb4ca33af9e6ab01b7a8e95331e6ed985", "BorrowerOperationsAddressChanged(address)", {"_newBorrowerOperationsAddress": p.address}),
    CollSurplusPoolAddressChanged: event("0xe67f36a6e961157d6eff83b91f3af5a62131ceb6f04954ef74f51c1c05e7f88d", "CollSurplusPoolAddressChanged(address)", {"_collSurplusPoolAddress": p.address}),
    DefaultPoolAddressChanged: event("0x5ee0cae2f063ed938bb55046f6a932fb6ae792bf43624806bb90abe68a50be9b", "DefaultPoolAddressChanged(address)", {"_defaultPoolAddress": p.address}),
    GasPoolAddressChanged: event("0xcfb07d791fcafc032b35837b50eb84b74df518cf4cc287e8084f47630fa70fa0", "GasPoolAddressChanged(address)", {"_gasPoolAddress": p.address}),
    LQTYStakingAddressChanged: event("0x756ebc192164c295bba134b5aacd72cc7aff8098a670d1f0a5f6b3a0b4ce6707", "LQTYStakingAddressChanged(address)", {"_lqtyStakingAddress": p.address}),
    LQTYTokenAddressChanged: event("0x2ac6e99201ddc1b6eac6f8f28662d1ecafee131f6eb98c29de54528a9888a7d1", "LQTYTokenAddressChanged(address)", {"_lqtyTokenAddress": p.address}),
    LTermsUpdated: event("0x9f8bc8ab0daf5bceef75ecfd2085d1fcc6548c657ea970d9a23a60610d0737e3", "LTermsUpdated(uint256,uint256)", {"_L_ETH": p.uint256, "_L_LUSDDebt": p.uint256}),
    LUSDTokenAddressChanged: event("0x227eec0ec317af6ab1a9587ffa1c84332522eb4c583a908f89babc05f8f339bd", "LUSDTokenAddressChanged(address)", {"_newLUSDTokenAddress": p.address}),
    LastFeeOpTimeUpdated: event("0x860f8d2f0c74dd487e89e2883e3b25b8159ce1e1b3433a291cba7b82c508f3bc", "LastFeeOpTimeUpdated(uint256)", {"_lastFeeOpTime": p.uint256}),
    Liquidation: event("0x4152c73dd2614c4f9fc35e8c9cf16013cd588c75b49a4c1673ecffdcbcda9403", "Liquidation(uint256,uint256,uint256,uint256)", {"_liquidatedDebt": p.uint256, "_liquidatedColl": p.uint256, "_collGasCompensation": p.uint256, "_LUSDGasCompensation": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PriceFeedAddressChanged: event("0x8c537274438aa850a330284665d81a85dd38267d09e4050d416bfc94142db264", "PriceFeedAddressChanged(address)", {"_newPriceFeedAddress": p.address}),
    Redemption: event("0x43a3f4082a4dbc33d78e317d2497d3a730bc7fc3574159dcea1056e62e5d9ad8", "Redemption(uint256,uint256,uint256,uint256)", {"_attemptedLUSDAmount": p.uint256, "_actualLUSDAmount": p.uint256, "_ETHSent": p.uint256, "_ETHFee": p.uint256}),
    SortedTrovesAddressChanged: event("0x65f4cf077bc01e4742eb5ad98326f6e95b63548ea24b17f8d5e823111fe78800", "SortedTrovesAddressChanged(address)", {"_sortedTrovesAddress": p.address}),
    StabilityPoolAddressChanged: event("0x82966d27eea39b038ee0fa30cd16532bb24f6e65d31cb58fb227aa5766cdcc7f", "StabilityPoolAddressChanged(address)", {"_stabilityPoolAddress": p.address}),
    SystemSnapshotsUpdated: event("0x51bf4c63ec3cba9d03d43238abbdd979dd91bd16d9895c74ceea9118c7baaf60", "SystemSnapshotsUpdated(uint256,uint256)", {"_totalStakesSnapshot": p.uint256, "_totalCollateralSnapshot": p.uint256}),
    TotalStakesUpdated: event("0x6bac5e0eb3c44eb03a60ab11ec3a2c051771616aecadbcfff2630aabae520382", "TotalStakesUpdated(uint256)", {"_newTotalStakes": p.uint256}),
    TroveIndexUpdated: event("0x02b04ae5f7be9ca7c103293a2aa15f3c339d15d6eda53b721fef7b0e609c831a", "TroveIndexUpdated(address,uint256)", {"_borrower": p.address, "_newIndex": p.uint256}),
    TroveLiquidated: event("0xea67486ed7ebe3eea8ab3390efd4a3c8aae48be5bea27df104a8af786c408434", "TroveLiquidated(address,uint256,uint256,uint8)", {"_borrower": indexed(p.address), "_debt": p.uint256, "_coll": p.uint256, "_operation": p.uint8}),
    TroveSnapshotsUpdated: event("0xc437f324d85e369394148dd9d62f98f534b382e01ed3dd2eb98138fb6d3ab49a", "TroveSnapshotsUpdated(uint256,uint256)", {"_L_ETH": p.uint256, "_L_LUSDDebt": p.uint256}),
    TroveUpdated: event("0xc3770d654ed33aeea6bf11ac8ef05d02a6a04ed4686dd2f624d853bbec43cc8b", "TroveUpdated(address,uint256,uint256,uint256,uint8)", {"_borrower": indexed(p.address), "_debt": p.uint256, "_coll": p.uint256, "_stake": p.uint256, "_operation": p.uint8}),
}

export const functions = {
    BETA: viewFun("0x071a7541", "BETA()", {}, p.uint256),
    BOOTSTRAP_PERIOD: viewFun("0xc35bc550", "BOOTSTRAP_PERIOD()", {}, p.uint256),
    BORROWING_FEE_FLOOR: viewFun("0xf92d3433", "BORROWING_FEE_FLOOR()", {}, p.uint256),
    CCR: viewFun("0x5733d58f", "CCR()", {}, p.uint256),
    DECIMAL_PRECISION: viewFun("0xa20baee6", "DECIMAL_PRECISION()", {}, p.uint256),
    LUSD_GAS_COMPENSATION: viewFun("0x2e86bbd8", "LUSD_GAS_COMPENSATION()", {}, p.uint256),
    L_ETH: viewFun("0x9dd233d2", "L_ETH()", {}, p.uint256),
    L_LUSDDebt: viewFun("0xdba1c5f2", "L_LUSDDebt()", {}, p.uint256),
    MAX_BORROWING_FEE: viewFun("0x24092669", "MAX_BORROWING_FEE()", {}, p.uint256),
    MCR: viewFun("0x794e5724", "MCR()", {}, p.uint256),
    MINUTE_DECAY_FACTOR: viewFun("0xc7b55481", "MINUTE_DECAY_FACTOR()", {}, p.uint256),
    MIN_NET_DEBT: viewFun("0x1bf43555", "MIN_NET_DEBT()", {}, p.uint256),
    NAME: viewFun("0xa3f4df7e", "NAME()", {}, p.string),
    PERCENT_DIVISOR: viewFun("0x4870dd9a", "PERCENT_DIVISOR()", {}, p.uint256),
    REDEMPTION_FEE_FLOOR: viewFun("0x28d28b5b", "REDEMPTION_FEE_FLOOR()", {}, p.uint256),
    SECONDS_IN_ONE_MINUTE: viewFun("0x61ec893d", "SECONDS_IN_ONE_MINUTE()", {}, p.uint256),
    TroveOwners: viewFun("0x756b253e", "TroveOwners(uint256)", {"_0": p.uint256}, p.address),
    Troves: viewFun("0x6ef64338", "Troves(address)", {"_0": p.address}, {"debt": p.uint256, "coll": p.uint256, "stake": p.uint256, "status": p.uint8, "arrayIndex": p.uint128}),
    _100pct: viewFun("0x72fe25aa", "_100pct()", {}, p.uint256),
    activePool: viewFun("0x7f7dde4a", "activePool()", {}, p.address),
    addTroveOwnerToArray: fun("0x15d549f1", "addTroveOwnerToArray(address)", {"_borrower": p.address}, p.uint256),
    applyPendingRewards: fun("0x0b076557", "applyPendingRewards(address)", {"_borrower": p.address}, ),
    baseRate: viewFun("0x1f68f20a", "baseRate()", {}, p.uint256),
    batchLiquidateTroves: fun("0x1e8b1c2b", "batchLiquidateTroves(address[])", {"_troveArray": p.array(p.address)}, ),
    borrowerOperationsAddress: viewFun("0xb7f8cf9b", "borrowerOperationsAddress()", {}, p.address),
    checkRecoveryMode: viewFun("0x4e443d9e", "checkRecoveryMode(uint256)", {"_price": p.uint256}, p.bool),
    closeTrove: fun("0xcbd138ae", "closeTrove(address)", {"_borrower": p.address}, ),
    decayBaseRateFromBorrowing: fun("0x5dba4c4a", "decayBaseRateFromBorrowing()", {}, ),
    decreaseTroveColl: fun("0xd3d6f843", "decreaseTroveColl(address,uint256)", {"_borrower": p.address, "_collDecrease": p.uint256}, p.uint256),
    decreaseTroveDebt: fun("0x12610e92", "decreaseTroveDebt(address,uint256)", {"_borrower": p.address, "_debtDecrease": p.uint256}, p.uint256),
    defaultPool: viewFun("0x3cc74225", "defaultPool()", {}, p.address),
    getBorrowingFee: viewFun("0x631203b0", "getBorrowingFee(uint256)", {"_LUSDDebt": p.uint256}, p.uint256),
    getBorrowingFeeWithDecay: viewFun("0x477d66cf", "getBorrowingFeeWithDecay(uint256)", {"_LUSDDebt": p.uint256}, p.uint256),
    getBorrowingRate: viewFun("0xf36b2425", "getBorrowingRate()", {}, p.uint256),
    getBorrowingRateWithDecay: viewFun("0x66ca4a21", "getBorrowingRateWithDecay()", {}, p.uint256),
    getCurrentICR: viewFun("0xd293c710", "getCurrentICR(address,uint256)", {"_borrower": p.address, "_price": p.uint256}, p.uint256),
    getEntireDebtAndColl: viewFun("0xb91af97c", "getEntireDebtAndColl(address)", {"_borrower": p.address}, {"debt": p.uint256, "coll": p.uint256, "pendingLUSDDebtReward": p.uint256, "pendingETHReward": p.uint256}),
    getEntireSystemColl: viewFun("0x887105d3", "getEntireSystemColl()", {}, p.uint256),
    getEntireSystemDebt: viewFun("0x795d26c3", "getEntireSystemDebt()", {}, p.uint256),
    getNominalICR: viewFun("0xb0d8e181", "getNominalICR(address)", {"_borrower": p.address}, p.uint256),
    getPendingETHReward: viewFun("0x5d8c9609", "getPendingETHReward(address)", {"_borrower": p.address}, p.uint256),
    getPendingLUSDDebtReward: viewFun("0xf34862de", "getPendingLUSDDebtReward(address)", {"_borrower": p.address}, p.uint256),
    getRedemptionFeeWithDecay: viewFun("0xd5b35635", "getRedemptionFeeWithDecay(uint256)", {"_ETHDrawn": p.uint256}, p.uint256),
    getRedemptionRate: viewFun("0x2b11551a", "getRedemptionRate()", {}, p.uint256),
    getRedemptionRateWithDecay: viewFun("0xc52861f2", "getRedemptionRateWithDecay()", {}, p.uint256),
    getTCR: viewFun("0xb82f263d", "getTCR(uint256)", {"_price": p.uint256}, p.uint256),
    getTroveColl: viewFun("0x480cd578", "getTroveColl(address)", {"_borrower": p.address}, p.uint256),
    getTroveDebt: viewFun("0xd66a2553", "getTroveDebt(address)", {"_borrower": p.address}, p.uint256),
    getTroveFromTroveOwnersArray: viewFun("0xd9a72444", "getTroveFromTroveOwnersArray(uint256)", {"_index": p.uint256}, p.address),
    getTroveOwnersCount: viewFun("0x49eefeee", "getTroveOwnersCount()", {}, p.uint256),
    getTroveStake: viewFun("0x64cee260", "getTroveStake(address)", {"_borrower": p.address}, p.uint256),
    getTroveStatus: viewFun("0x21e37801", "getTroveStatus(address)", {"_borrower": p.address}, p.uint256),
    hasPendingRewards: viewFun("0xe2ac77b0", "hasPendingRewards(address)", {"_borrower": p.address}, p.bool),
    increaseTroveColl: fun("0x72423c17", "increaseTroveColl(address,uint256)", {"_borrower": p.address, "_collIncrease": p.uint256}, p.uint256),
    increaseTroveDebt: fun("0x9976cf45", "increaseTroveDebt(address,uint256)", {"_borrower": p.address, "_debtIncrease": p.uint256}, p.uint256),
    isOwner: viewFun("0x8f32d59b", "isOwner()", {}, p.bool),
    lastETHError_Redistribution: viewFun("0x797250e3", "lastETHError_Redistribution()", {}, p.uint256),
    lastFeeOperationTime: viewFun("0xd380a37c", "lastFeeOperationTime()", {}, p.uint256),
    lastLUSDDebtError_Redistribution: viewFun("0x060d49a3", "lastLUSDDebtError_Redistribution()", {}, p.uint256),
    liquidate: fun("0x2f865568", "liquidate(address)", {"_borrower": p.address}, ),
    liquidateTroves: fun("0x653d46e7", "liquidateTroves(uint256)", {"_n": p.uint256}, ),
    lqtyStaking: viewFun("0xa3a64017", "lqtyStaking()", {}, p.address),
    lqtyToken: viewFun("0x1f7af3c3", "lqtyToken()", {}, p.address),
    lusdToken: viewFun("0xb83f91a2", "lusdToken()", {}, p.address),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    priceFeed: viewFun("0x741bef1a", "priceFeed()", {}, p.address),
    redeemCollateral: fun("0xbcd37526", "redeemCollateral(uint256,address,address,address,uint256,uint256,uint256)", {"_LUSDamount": p.uint256, "_firstRedemptionHint": p.address, "_upperPartialRedemptionHint": p.address, "_lowerPartialRedemptionHint": p.address, "_partialRedemptionHintNICR": p.uint256, "_maxIterations": p.uint256, "_maxFeePercentage": p.uint256}, ),
    removeStake: fun("0xfe2ba848", "removeStake(address)", {"_borrower": p.address}, ),
    rewardSnapshots: viewFun("0x1673c79a", "rewardSnapshots(address)", {"_0": p.address}, {"ETH": p.uint256, "LUSDDebt": p.uint256}),
    setAddresses: fun("0x7985c5e4", "setAddresses(address,address,address,address,address,address,address,address,address,address,address)", {"_borrowerOperationsAddress": p.address, "_activePoolAddress": p.address, "_defaultPoolAddress": p.address, "_stabilityPoolAddress": p.address, "_gasPoolAddress": p.address, "_collSurplusPoolAddress": p.address, "_priceFeedAddress": p.address, "_lusdTokenAddress": p.address, "_sortedTrovesAddress": p.address, "_lqtyTokenAddress": p.address, "_lqtyStakingAddress": p.address}, ),
    setTroveStatus: fun("0x5d6b480f", "setTroveStatus(address,uint256)", {"_borrower": p.address, "_num": p.uint256}, ),
    sortedTroves: viewFun("0xae918754", "sortedTroves()", {}, p.address),
    stabilityPool: viewFun("0x048c661d", "stabilityPool()", {}, p.address),
    totalCollateralSnapshot: viewFun("0x96d711ff", "totalCollateralSnapshot()", {}, p.uint256),
    totalStakes: viewFun("0xbf9befb1", "totalStakes()", {}, p.uint256),
    totalStakesSnapshot: viewFun("0x807d138d", "totalStakesSnapshot()", {}, p.uint256),
    updateStakeAndTotalStakes: fun("0x18f2817a", "updateStakeAndTotalStakes(address)", {"_borrower": p.address}, p.uint256),
    updateTroveRewardSnapshots: fun("0x82fe3eb9", "updateTroveRewardSnapshots(address)", {"_borrower": p.address}, ),
}

export class Contract extends ContractBase {

    BETA() {
        return this.eth_call(functions.BETA, {})
    }

    BOOTSTRAP_PERIOD() {
        return this.eth_call(functions.BOOTSTRAP_PERIOD, {})
    }

    BORROWING_FEE_FLOOR() {
        return this.eth_call(functions.BORROWING_FEE_FLOOR, {})
    }

    CCR() {
        return this.eth_call(functions.CCR, {})
    }

    DECIMAL_PRECISION() {
        return this.eth_call(functions.DECIMAL_PRECISION, {})
    }

    LUSD_GAS_COMPENSATION() {
        return this.eth_call(functions.LUSD_GAS_COMPENSATION, {})
    }

    L_ETH() {
        return this.eth_call(functions.L_ETH, {})
    }

    L_LUSDDebt() {
        return this.eth_call(functions.L_LUSDDebt, {})
    }

    MAX_BORROWING_FEE() {
        return this.eth_call(functions.MAX_BORROWING_FEE, {})
    }

    MCR() {
        return this.eth_call(functions.MCR, {})
    }

    MINUTE_DECAY_FACTOR() {
        return this.eth_call(functions.MINUTE_DECAY_FACTOR, {})
    }

    MIN_NET_DEBT() {
        return this.eth_call(functions.MIN_NET_DEBT, {})
    }

    NAME() {
        return this.eth_call(functions.NAME, {})
    }

    PERCENT_DIVISOR() {
        return this.eth_call(functions.PERCENT_DIVISOR, {})
    }

    REDEMPTION_FEE_FLOOR() {
        return this.eth_call(functions.REDEMPTION_FEE_FLOOR, {})
    }

    SECONDS_IN_ONE_MINUTE() {
        return this.eth_call(functions.SECONDS_IN_ONE_MINUTE, {})
    }

    TroveOwners(_0: TroveOwnersParams["_0"]) {
        return this.eth_call(functions.TroveOwners, {_0})
    }

    Troves(_0: TrovesParams["_0"]) {
        return this.eth_call(functions.Troves, {_0})
    }

    _100pct() {
        return this.eth_call(functions._100pct, {})
    }

    activePool() {
        return this.eth_call(functions.activePool, {})
    }

    baseRate() {
        return this.eth_call(functions.baseRate, {})
    }

    borrowerOperationsAddress() {
        return this.eth_call(functions.borrowerOperationsAddress, {})
    }

    checkRecoveryMode(_price: CheckRecoveryModeParams["_price"]) {
        return this.eth_call(functions.checkRecoveryMode, {_price})
    }

    defaultPool() {
        return this.eth_call(functions.defaultPool, {})
    }

    getBorrowingFee(_LUSDDebt: GetBorrowingFeeParams["_LUSDDebt"]) {
        return this.eth_call(functions.getBorrowingFee, {_LUSDDebt})
    }

    getBorrowingFeeWithDecay(_LUSDDebt: GetBorrowingFeeWithDecayParams["_LUSDDebt"]) {
        return this.eth_call(functions.getBorrowingFeeWithDecay, {_LUSDDebt})
    }

    getBorrowingRate() {
        return this.eth_call(functions.getBorrowingRate, {})
    }

    getBorrowingRateWithDecay() {
        return this.eth_call(functions.getBorrowingRateWithDecay, {})
    }

    getCurrentICR(_borrower: GetCurrentICRParams["_borrower"], _price: GetCurrentICRParams["_price"]) {
        return this.eth_call(functions.getCurrentICR, {_borrower, _price})
    }

    getEntireDebtAndColl(_borrower: GetEntireDebtAndCollParams["_borrower"]) {
        return this.eth_call(functions.getEntireDebtAndColl, {_borrower})
    }

    getEntireSystemColl() {
        return this.eth_call(functions.getEntireSystemColl, {})
    }

    getEntireSystemDebt() {
        return this.eth_call(functions.getEntireSystemDebt, {})
    }

    getNominalICR(_borrower: GetNominalICRParams["_borrower"]) {
        return this.eth_call(functions.getNominalICR, {_borrower})
    }

    getPendingETHReward(_borrower: GetPendingETHRewardParams["_borrower"]) {
        return this.eth_call(functions.getPendingETHReward, {_borrower})
    }

    getPendingLUSDDebtReward(_borrower: GetPendingLUSDDebtRewardParams["_borrower"]) {
        return this.eth_call(functions.getPendingLUSDDebtReward, {_borrower})
    }

    getRedemptionFeeWithDecay(_ETHDrawn: GetRedemptionFeeWithDecayParams["_ETHDrawn"]) {
        return this.eth_call(functions.getRedemptionFeeWithDecay, {_ETHDrawn})
    }

    getRedemptionRate() {
        return this.eth_call(functions.getRedemptionRate, {})
    }

    getRedemptionRateWithDecay() {
        return this.eth_call(functions.getRedemptionRateWithDecay, {})
    }

    getTCR(_price: GetTCRParams["_price"]) {
        return this.eth_call(functions.getTCR, {_price})
    }

    getTroveColl(_borrower: GetTroveCollParams["_borrower"]) {
        return this.eth_call(functions.getTroveColl, {_borrower})
    }

    getTroveDebt(_borrower: GetTroveDebtParams["_borrower"]) {
        return this.eth_call(functions.getTroveDebt, {_borrower})
    }

    getTroveFromTroveOwnersArray(_index: GetTroveFromTroveOwnersArrayParams["_index"]) {
        return this.eth_call(functions.getTroveFromTroveOwnersArray, {_index})
    }

    getTroveOwnersCount() {
        return this.eth_call(functions.getTroveOwnersCount, {})
    }

    getTroveStake(_borrower: GetTroveStakeParams["_borrower"]) {
        return this.eth_call(functions.getTroveStake, {_borrower})
    }

    getTroveStatus(_borrower: GetTroveStatusParams["_borrower"]) {
        return this.eth_call(functions.getTroveStatus, {_borrower})
    }

    hasPendingRewards(_borrower: HasPendingRewardsParams["_borrower"]) {
        return this.eth_call(functions.hasPendingRewards, {_borrower})
    }

    isOwner() {
        return this.eth_call(functions.isOwner, {})
    }

    lastETHError_Redistribution() {
        return this.eth_call(functions.lastETHError_Redistribution, {})
    }

    lastFeeOperationTime() {
        return this.eth_call(functions.lastFeeOperationTime, {})
    }

    lastLUSDDebtError_Redistribution() {
        return this.eth_call(functions.lastLUSDDebtError_Redistribution, {})
    }

    lqtyStaking() {
        return this.eth_call(functions.lqtyStaking, {})
    }

    lqtyToken() {
        return this.eth_call(functions.lqtyToken, {})
    }

    lusdToken() {
        return this.eth_call(functions.lusdToken, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    priceFeed() {
        return this.eth_call(functions.priceFeed, {})
    }

    rewardSnapshots(_0: RewardSnapshotsParams["_0"]) {
        return this.eth_call(functions.rewardSnapshots, {_0})
    }

    sortedTroves() {
        return this.eth_call(functions.sortedTroves, {})
    }

    stabilityPool() {
        return this.eth_call(functions.stabilityPool, {})
    }

    totalCollateralSnapshot() {
        return this.eth_call(functions.totalCollateralSnapshot, {})
    }

    totalStakes() {
        return this.eth_call(functions.totalStakes, {})
    }

    totalStakesSnapshot() {
        return this.eth_call(functions.totalStakesSnapshot, {})
    }
}

/// Event types
export type ActivePoolAddressChangedEventArgs = EParams<typeof events.ActivePoolAddressChanged>
export type BaseRateUpdatedEventArgs = EParams<typeof events.BaseRateUpdated>
export type BorrowerOperationsAddressChangedEventArgs = EParams<typeof events.BorrowerOperationsAddressChanged>
export type CollSurplusPoolAddressChangedEventArgs = EParams<typeof events.CollSurplusPoolAddressChanged>
export type DefaultPoolAddressChangedEventArgs = EParams<typeof events.DefaultPoolAddressChanged>
export type GasPoolAddressChangedEventArgs = EParams<typeof events.GasPoolAddressChanged>
export type LQTYStakingAddressChangedEventArgs = EParams<typeof events.LQTYStakingAddressChanged>
export type LQTYTokenAddressChangedEventArgs = EParams<typeof events.LQTYTokenAddressChanged>
export type LTermsUpdatedEventArgs = EParams<typeof events.LTermsUpdated>
export type LUSDTokenAddressChangedEventArgs = EParams<typeof events.LUSDTokenAddressChanged>
export type LastFeeOpTimeUpdatedEventArgs = EParams<typeof events.LastFeeOpTimeUpdated>
export type LiquidationEventArgs = EParams<typeof events.Liquidation>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PriceFeedAddressChangedEventArgs = EParams<typeof events.PriceFeedAddressChanged>
export type RedemptionEventArgs = EParams<typeof events.Redemption>
export type SortedTrovesAddressChangedEventArgs = EParams<typeof events.SortedTrovesAddressChanged>
export type StabilityPoolAddressChangedEventArgs = EParams<typeof events.StabilityPoolAddressChanged>
export type SystemSnapshotsUpdatedEventArgs = EParams<typeof events.SystemSnapshotsUpdated>
export type TotalStakesUpdatedEventArgs = EParams<typeof events.TotalStakesUpdated>
export type TroveIndexUpdatedEventArgs = EParams<typeof events.TroveIndexUpdated>
export type TroveLiquidatedEventArgs = EParams<typeof events.TroveLiquidated>
export type TroveSnapshotsUpdatedEventArgs = EParams<typeof events.TroveSnapshotsUpdated>
export type TroveUpdatedEventArgs = EParams<typeof events.TroveUpdated>

/// Function types
export type BETAParams = FunctionArguments<typeof functions.BETA>
export type BETAReturn = FunctionReturn<typeof functions.BETA>

export type BOOTSTRAP_PERIODParams = FunctionArguments<typeof functions.BOOTSTRAP_PERIOD>
export type BOOTSTRAP_PERIODReturn = FunctionReturn<typeof functions.BOOTSTRAP_PERIOD>

export type BORROWING_FEE_FLOORParams = FunctionArguments<typeof functions.BORROWING_FEE_FLOOR>
export type BORROWING_FEE_FLOORReturn = FunctionReturn<typeof functions.BORROWING_FEE_FLOOR>

export type CCRParams = FunctionArguments<typeof functions.CCR>
export type CCRReturn = FunctionReturn<typeof functions.CCR>

export type DECIMAL_PRECISIONParams = FunctionArguments<typeof functions.DECIMAL_PRECISION>
export type DECIMAL_PRECISIONReturn = FunctionReturn<typeof functions.DECIMAL_PRECISION>

export type LUSD_GAS_COMPENSATIONParams = FunctionArguments<typeof functions.LUSD_GAS_COMPENSATION>
export type LUSD_GAS_COMPENSATIONReturn = FunctionReturn<typeof functions.LUSD_GAS_COMPENSATION>

export type L_ETHParams = FunctionArguments<typeof functions.L_ETH>
export type L_ETHReturn = FunctionReturn<typeof functions.L_ETH>

export type L_LUSDDebtParams = FunctionArguments<typeof functions.L_LUSDDebt>
export type L_LUSDDebtReturn = FunctionReturn<typeof functions.L_LUSDDebt>

export type MAX_BORROWING_FEEParams = FunctionArguments<typeof functions.MAX_BORROWING_FEE>
export type MAX_BORROWING_FEEReturn = FunctionReturn<typeof functions.MAX_BORROWING_FEE>

export type MCRParams = FunctionArguments<typeof functions.MCR>
export type MCRReturn = FunctionReturn<typeof functions.MCR>

export type MINUTE_DECAY_FACTORParams = FunctionArguments<typeof functions.MINUTE_DECAY_FACTOR>
export type MINUTE_DECAY_FACTORReturn = FunctionReturn<typeof functions.MINUTE_DECAY_FACTOR>

export type MIN_NET_DEBTParams = FunctionArguments<typeof functions.MIN_NET_DEBT>
export type MIN_NET_DEBTReturn = FunctionReturn<typeof functions.MIN_NET_DEBT>

export type NAMEParams = FunctionArguments<typeof functions.NAME>
export type NAMEReturn = FunctionReturn<typeof functions.NAME>

export type PERCENT_DIVISORParams = FunctionArguments<typeof functions.PERCENT_DIVISOR>
export type PERCENT_DIVISORReturn = FunctionReturn<typeof functions.PERCENT_DIVISOR>

export type REDEMPTION_FEE_FLOORParams = FunctionArguments<typeof functions.REDEMPTION_FEE_FLOOR>
export type REDEMPTION_FEE_FLOORReturn = FunctionReturn<typeof functions.REDEMPTION_FEE_FLOOR>

export type SECONDS_IN_ONE_MINUTEParams = FunctionArguments<typeof functions.SECONDS_IN_ONE_MINUTE>
export type SECONDS_IN_ONE_MINUTEReturn = FunctionReturn<typeof functions.SECONDS_IN_ONE_MINUTE>

export type TroveOwnersParams = FunctionArguments<typeof functions.TroveOwners>
export type TroveOwnersReturn = FunctionReturn<typeof functions.TroveOwners>

export type TrovesParams = FunctionArguments<typeof functions.Troves>
export type TrovesReturn = FunctionReturn<typeof functions.Troves>

export type _100pctParams = FunctionArguments<typeof functions._100pct>
export type _100pctReturn = FunctionReturn<typeof functions._100pct>

export type ActivePoolParams = FunctionArguments<typeof functions.activePool>
export type ActivePoolReturn = FunctionReturn<typeof functions.activePool>

export type AddTroveOwnerToArrayParams = FunctionArguments<typeof functions.addTroveOwnerToArray>
export type AddTroveOwnerToArrayReturn = FunctionReturn<typeof functions.addTroveOwnerToArray>

export type ApplyPendingRewardsParams = FunctionArguments<typeof functions.applyPendingRewards>
export type ApplyPendingRewardsReturn = FunctionReturn<typeof functions.applyPendingRewards>

export type BaseRateParams = FunctionArguments<typeof functions.baseRate>
export type BaseRateReturn = FunctionReturn<typeof functions.baseRate>

export type BatchLiquidateTrovesParams = FunctionArguments<typeof functions.batchLiquidateTroves>
export type BatchLiquidateTrovesReturn = FunctionReturn<typeof functions.batchLiquidateTroves>

export type BorrowerOperationsAddressParams = FunctionArguments<typeof functions.borrowerOperationsAddress>
export type BorrowerOperationsAddressReturn = FunctionReturn<typeof functions.borrowerOperationsAddress>

export type CheckRecoveryModeParams = FunctionArguments<typeof functions.checkRecoveryMode>
export type CheckRecoveryModeReturn = FunctionReturn<typeof functions.checkRecoveryMode>

export type CloseTroveParams = FunctionArguments<typeof functions.closeTrove>
export type CloseTroveReturn = FunctionReturn<typeof functions.closeTrove>

export type DecayBaseRateFromBorrowingParams = FunctionArguments<typeof functions.decayBaseRateFromBorrowing>
export type DecayBaseRateFromBorrowingReturn = FunctionReturn<typeof functions.decayBaseRateFromBorrowing>

export type DecreaseTroveCollParams = FunctionArguments<typeof functions.decreaseTroveColl>
export type DecreaseTroveCollReturn = FunctionReturn<typeof functions.decreaseTroveColl>

export type DecreaseTroveDebtParams = FunctionArguments<typeof functions.decreaseTroveDebt>
export type DecreaseTroveDebtReturn = FunctionReturn<typeof functions.decreaseTroveDebt>

export type DefaultPoolParams = FunctionArguments<typeof functions.defaultPool>
export type DefaultPoolReturn = FunctionReturn<typeof functions.defaultPool>

export type GetBorrowingFeeParams = FunctionArguments<typeof functions.getBorrowingFee>
export type GetBorrowingFeeReturn = FunctionReturn<typeof functions.getBorrowingFee>

export type GetBorrowingFeeWithDecayParams = FunctionArguments<typeof functions.getBorrowingFeeWithDecay>
export type GetBorrowingFeeWithDecayReturn = FunctionReturn<typeof functions.getBorrowingFeeWithDecay>

export type GetBorrowingRateParams = FunctionArguments<typeof functions.getBorrowingRate>
export type GetBorrowingRateReturn = FunctionReturn<typeof functions.getBorrowingRate>

export type GetBorrowingRateWithDecayParams = FunctionArguments<typeof functions.getBorrowingRateWithDecay>
export type GetBorrowingRateWithDecayReturn = FunctionReturn<typeof functions.getBorrowingRateWithDecay>

export type GetCurrentICRParams = FunctionArguments<typeof functions.getCurrentICR>
export type GetCurrentICRReturn = FunctionReturn<typeof functions.getCurrentICR>

export type GetEntireDebtAndCollParams = FunctionArguments<typeof functions.getEntireDebtAndColl>
export type GetEntireDebtAndCollReturn = FunctionReturn<typeof functions.getEntireDebtAndColl>

export type GetEntireSystemCollParams = FunctionArguments<typeof functions.getEntireSystemColl>
export type GetEntireSystemCollReturn = FunctionReturn<typeof functions.getEntireSystemColl>

export type GetEntireSystemDebtParams = FunctionArguments<typeof functions.getEntireSystemDebt>
export type GetEntireSystemDebtReturn = FunctionReturn<typeof functions.getEntireSystemDebt>

export type GetNominalICRParams = FunctionArguments<typeof functions.getNominalICR>
export type GetNominalICRReturn = FunctionReturn<typeof functions.getNominalICR>

export type GetPendingETHRewardParams = FunctionArguments<typeof functions.getPendingETHReward>
export type GetPendingETHRewardReturn = FunctionReturn<typeof functions.getPendingETHReward>

export type GetPendingLUSDDebtRewardParams = FunctionArguments<typeof functions.getPendingLUSDDebtReward>
export type GetPendingLUSDDebtRewardReturn = FunctionReturn<typeof functions.getPendingLUSDDebtReward>

export type GetRedemptionFeeWithDecayParams = FunctionArguments<typeof functions.getRedemptionFeeWithDecay>
export type GetRedemptionFeeWithDecayReturn = FunctionReturn<typeof functions.getRedemptionFeeWithDecay>

export type GetRedemptionRateParams = FunctionArguments<typeof functions.getRedemptionRate>
export type GetRedemptionRateReturn = FunctionReturn<typeof functions.getRedemptionRate>

export type GetRedemptionRateWithDecayParams = FunctionArguments<typeof functions.getRedemptionRateWithDecay>
export type GetRedemptionRateWithDecayReturn = FunctionReturn<typeof functions.getRedemptionRateWithDecay>

export type GetTCRParams = FunctionArguments<typeof functions.getTCR>
export type GetTCRReturn = FunctionReturn<typeof functions.getTCR>

export type GetTroveCollParams = FunctionArguments<typeof functions.getTroveColl>
export type GetTroveCollReturn = FunctionReturn<typeof functions.getTroveColl>

export type GetTroveDebtParams = FunctionArguments<typeof functions.getTroveDebt>
export type GetTroveDebtReturn = FunctionReturn<typeof functions.getTroveDebt>

export type GetTroveFromTroveOwnersArrayParams = FunctionArguments<typeof functions.getTroveFromTroveOwnersArray>
export type GetTroveFromTroveOwnersArrayReturn = FunctionReturn<typeof functions.getTroveFromTroveOwnersArray>

export type GetTroveOwnersCountParams = FunctionArguments<typeof functions.getTroveOwnersCount>
export type GetTroveOwnersCountReturn = FunctionReturn<typeof functions.getTroveOwnersCount>

export type GetTroveStakeParams = FunctionArguments<typeof functions.getTroveStake>
export type GetTroveStakeReturn = FunctionReturn<typeof functions.getTroveStake>

export type GetTroveStatusParams = FunctionArguments<typeof functions.getTroveStatus>
export type GetTroveStatusReturn = FunctionReturn<typeof functions.getTroveStatus>

export type HasPendingRewardsParams = FunctionArguments<typeof functions.hasPendingRewards>
export type HasPendingRewardsReturn = FunctionReturn<typeof functions.hasPendingRewards>

export type IncreaseTroveCollParams = FunctionArguments<typeof functions.increaseTroveColl>
export type IncreaseTroveCollReturn = FunctionReturn<typeof functions.increaseTroveColl>

export type IncreaseTroveDebtParams = FunctionArguments<typeof functions.increaseTroveDebt>
export type IncreaseTroveDebtReturn = FunctionReturn<typeof functions.increaseTroveDebt>

export type IsOwnerParams = FunctionArguments<typeof functions.isOwner>
export type IsOwnerReturn = FunctionReturn<typeof functions.isOwner>

export type LastETHError_RedistributionParams = FunctionArguments<typeof functions.lastETHError_Redistribution>
export type LastETHError_RedistributionReturn = FunctionReturn<typeof functions.lastETHError_Redistribution>

export type LastFeeOperationTimeParams = FunctionArguments<typeof functions.lastFeeOperationTime>
export type LastFeeOperationTimeReturn = FunctionReturn<typeof functions.lastFeeOperationTime>

export type LastLUSDDebtError_RedistributionParams = FunctionArguments<typeof functions.lastLUSDDebtError_Redistribution>
export type LastLUSDDebtError_RedistributionReturn = FunctionReturn<typeof functions.lastLUSDDebtError_Redistribution>

export type LiquidateParams = FunctionArguments<typeof functions.liquidate>
export type LiquidateReturn = FunctionReturn<typeof functions.liquidate>

export type LiquidateTrovesParams = FunctionArguments<typeof functions.liquidateTroves>
export type LiquidateTrovesReturn = FunctionReturn<typeof functions.liquidateTroves>

export type LqtyStakingParams = FunctionArguments<typeof functions.lqtyStaking>
export type LqtyStakingReturn = FunctionReturn<typeof functions.lqtyStaking>

export type LqtyTokenParams = FunctionArguments<typeof functions.lqtyToken>
export type LqtyTokenReturn = FunctionReturn<typeof functions.lqtyToken>

export type LusdTokenParams = FunctionArguments<typeof functions.lusdToken>
export type LusdTokenReturn = FunctionReturn<typeof functions.lusdToken>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PriceFeedParams = FunctionArguments<typeof functions.priceFeed>
export type PriceFeedReturn = FunctionReturn<typeof functions.priceFeed>

export type RedeemCollateralParams = FunctionArguments<typeof functions.redeemCollateral>
export type RedeemCollateralReturn = FunctionReturn<typeof functions.redeemCollateral>

export type RemoveStakeParams = FunctionArguments<typeof functions.removeStake>
export type RemoveStakeReturn = FunctionReturn<typeof functions.removeStake>

export type RewardSnapshotsParams = FunctionArguments<typeof functions.rewardSnapshots>
export type RewardSnapshotsReturn = FunctionReturn<typeof functions.rewardSnapshots>

export type SetAddressesParams = FunctionArguments<typeof functions.setAddresses>
export type SetAddressesReturn = FunctionReturn<typeof functions.setAddresses>

export type SetTroveStatusParams = FunctionArguments<typeof functions.setTroveStatus>
export type SetTroveStatusReturn = FunctionReturn<typeof functions.setTroveStatus>

export type SortedTrovesParams = FunctionArguments<typeof functions.sortedTroves>
export type SortedTrovesReturn = FunctionReturn<typeof functions.sortedTroves>

export type StabilityPoolParams = FunctionArguments<typeof functions.stabilityPool>
export type StabilityPoolReturn = FunctionReturn<typeof functions.stabilityPool>

export type TotalCollateralSnapshotParams = FunctionArguments<typeof functions.totalCollateralSnapshot>
export type TotalCollateralSnapshotReturn = FunctionReturn<typeof functions.totalCollateralSnapshot>

export type TotalStakesParams = FunctionArguments<typeof functions.totalStakes>
export type TotalStakesReturn = FunctionReturn<typeof functions.totalStakes>

export type TotalStakesSnapshotParams = FunctionArguments<typeof functions.totalStakesSnapshot>
export type TotalStakesSnapshotReturn = FunctionReturn<typeof functions.totalStakesSnapshot>

export type UpdateStakeAndTotalStakesParams = FunctionArguments<typeof functions.updateStakeAndTotalStakes>
export type UpdateStakeAndTotalStakesReturn = FunctionReturn<typeof functions.updateStakeAndTotalStakes>

export type UpdateTroveRewardSnapshotsParams = FunctionArguments<typeof functions.updateTroveRewardSnapshots>
export type UpdateTroveRewardSnapshotsReturn = FunctionReturn<typeof functions.updateTroveRewardSnapshots>

