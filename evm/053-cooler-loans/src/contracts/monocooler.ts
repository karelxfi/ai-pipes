import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuthorizationSet: event("0x5cdf194586d80f74248ba9e5d00553932d4b63b19a2238d30ae0f4cb9a987234", "AuthorizationSet(address,address,address,uint96)", {"caller": indexed(p.address), "account": indexed(p.address), "authorized": indexed(p.address), "authorizationDeadline": p.uint96}),
    Borrow: event("0xe9d4e3275d879ba5de12b4f7025d9afc60d203988e246cbdbeb173c694c7c1e0", "Borrow(address,address,address,uint128)", {"caller": indexed(p.address), "onBehalfOf": indexed(p.address), "recipient": indexed(p.address), "amount": p.uint128}),
    BorrowPausedSet: event("0xa1f4a6e2dfc84e852c5dd5b715b3ed1834e8b6017e6bfb3a59d61dbce99574d2", "BorrowPausedSet(bool)", {"isPaused": p.bool}),
    CollateralAdded: event("0xa294b8c659c4fead0fea8156278762692bd09dced6313207eba83a4404d1365e", "CollateralAdded(address,address,uint128)", {"caller": indexed(p.address), "onBehalfOf": indexed(p.address), "collateralAmount": p.uint128}),
    CollateralWithdrawn: event("0x7376a02914a6b7ac840e997fb29e6ed5ddecdc8d40db8a7d60c4314c2ca1295c", "CollateralWithdrawn(address,address,address,uint128)", {"caller": indexed(p.address), "onBehalfOf": indexed(p.address), "recipient": indexed(p.address), "collateralAmount": p.uint128}),
    InterestRateSet: event("0x43891472b8dabb9adc1f2290bf171a7fe446c42e51e827e7987426676154faa9", "InterestRateSet(uint96)", {"interestRateWad": p.uint96}),
    Liquidated: event("0x7d1f08aa089a9fe410e7b81d541fc53d04f4e32c8b7c09ee4b413fb845fe7007", "Liquidated(address,address,uint128,uint128,uint128)", {"caller": indexed(p.address), "account": indexed(p.address), "collateralSeized": p.uint128, "debtWiped": p.uint128, "incentives": p.uint128}),
    LiquidationsPausedSet: event("0x9620f507aec770d0d1dfc5054ec14baa7cc0fa4d49a042a5feb1e11aa1ccb167", "LiquidationsPausedSet(bool)", {"isPaused": p.bool}),
    LtvOracleSet: event("0x83455f1da0b81ff03aa77ca3a8da66d071f9907e0717d8892daf796cb6168dac", "LtvOracleSet(address)", {"oracle": indexed(p.address)}),
    Repay: event("0xb81daa514d39133aa6960d430d2f15f0c150cb0e4d51c8ff506080c34985f600", "Repay(address,address,uint128)", {"caller": indexed(p.address), "onBehalfOf": indexed(p.address), "repayAmount": p.uint128}),
    TreasuryBorrowerSet: event("0x55398e5d6dca240a679393f5c98ac0ff5afee8577bdf4b8dbbb3c93cb381c5f9", "TreasuryBorrowerSet(address)", {"treasuryBorrower": indexed(p.address)}),
}

export const functions = {
    DLGTE: viewFun("0x7a9c2975", "DLGTE()", {}, p.address),
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    MINTR: viewFun("0x577de7d0", "MINTR()", {}, p.address),
    ROLES: viewFun("0x923cb952", "ROLES()", {}, p.address),
    accountCollateral: viewFun("0x030c3c58", "accountCollateral(address)", {"account": p.address}, p.uint128),
    accountDebt: viewFun("0x5472214b", "accountDebt(address)", {"account": p.address}, p.uint128),
    accountDelegationsList: viewFun("0xe75aea90", "accountDelegationsList(address,uint256,uint256)", {"account": p.address, "startIndex": p.uint256, "maxItems": p.uint256}, p.array(p.struct({"delegate": p.address, "amount": p.uint256, "escrow": p.address}))),
    accountPosition: viewFun("0xf46cf7f0", "accountPosition(address)", {"account": p.address}, p.struct({"collateral": p.uint256, "currentDebt": p.uint256, "maxOriginationDebtAmount": p.uint256, "liquidationDebtAmount": p.uint256, "healthFactor": p.uint256, "currentLtv": p.uint256, "totalDelegated": p.uint256, "numDelegateAddresses": p.uint256, "maxDelegateAddresses": p.uint256})),
    accountState: viewFun("0x0ec4c601", "accountState(address)", {"account": p.address}, p.struct({"collateral": p.uint128, "debtCheckpoint": p.uint128, "interestAccumulatorRay": p.uint256})),
    addCollateral: fun("0x05d6f8ad", "addCollateral(uint128,address,(address,int256)[])", {"collateralAmount": p.uint128, "onBehalfOf": p.address, "delegationRequests": p.array(p.struct({"delegate": p.address, "amount": p.int256}))}, ),
    applyDelegations: fun("0xb64c393a", "applyDelegations((address,int256)[],address)", {"delegationRequests": p.array(p.struct({"delegate": p.address, "amount": p.int256})), "onBehalfOf": p.address}, {"totalDelegated": p.uint256, "totalUndelegated": p.uint256, "undelegatedBalance": p.uint256}),
    applyUnhealthyDelegations: fun("0x5480478a", "applyUnhealthyDelegations(address,uint256)", {"account": p.address, "autoRescindMaxNumDelegates": p.uint256}, {"totalUndelegated": p.uint256, "undelegatedBalance": p.uint256}),
    authorizationNonces: viewFun("0x81de274c", "authorizationNonces(address)", {"_0": p.address}, p.uint256),
    authorizations: viewFun("0x06899031", "authorizations(address,address)", {"_0": p.address, "_1": p.address}, p.uint96),
    batchLiquidate: fun("0x81cf9071", "batchLiquidate(address[])", {"accounts": p.array(p.address)}, {"totalCollateralClaimed": p.uint128, "totalDebtWiped": p.uint128, "totalLiquidationIncentive": p.uint128}),
    borrow: fun("0xa8f18f25", "borrow(uint128,address,address)", {"borrowAmount": p.uint128, "onBehalfOf": p.address, "recipient": p.address}, p.uint128),
    borrowsPaused: viewFun("0x25fbed10", "borrowsPaused()", {}, p.bool),
    changeKernel: fun("0x4657b36c", "changeKernel(address)", {"newKernel_": p.address}, ),
    checkpointDebt: fun("0xc9c0bccf", "checkpointDebt()", {}, {"_0": p.uint128, "_1": p.uint256}),
    collateralToken: viewFun("0xb2016bd4", "collateralToken()", {}, p.address),
    computeLiquidity: viewFun("0xc3e7a9de", "computeLiquidity(address[])", {"accounts": p.array(p.address)}, p.array(p.struct({"collateral": p.uint128, "currentDebt": p.uint128, "currentLtv": p.uint128, "exceededLiquidationLtv": p.bool, "exceededMaxOriginationLtv": p.bool, "currentIncentive": p.uint128}))),
    configureDependencies: fun("0x9459b875", "configureDependencies()", {}, p.array(p.bytes5)),
    debtDeltaForMaxOriginationLtv: viewFun("0xb611328a", "debtDeltaForMaxOriginationLtv(address,int128)", {"account": p.address, "collateralDelta": p.int128}, p.int128),
    debtToken: viewFun("0xf8d89898", "debtToken()", {}, p.address),
    globalState: viewFun("0xe76c01e4", "globalState()", {}, {"_0": p.uint128, "_1": p.uint256}),
    interestAccumulatorRay: viewFun("0x1cbc74c5", "interestAccumulatorRay()", {}, p.uint256),
    interestAccumulatorUpdatedAt: viewFun("0x2e1ddb32", "interestAccumulatorUpdatedAt()", {}, p.uint40),
    interestRateWad: viewFun("0xbb720329", "interestRateWad()", {}, p.uint96),
    isActive: viewFun("0x22f3e2d4", "isActive()", {}, p.bool),
    isSenderAuthorized: viewFun("0xa35ac753", "isSenderAuthorized(address,address)", {"sender": p.address, "onBehalfOf": p.address}, p.bool),
    kernel: viewFun("0xd4aae0c4", "kernel()", {}, p.address),
    liquidationsPaused: viewFun("0x8f6d0f11", "liquidationsPaused()", {}, p.bool),
    loanToValues: viewFun("0x6a6044ad", "loanToValues()", {}, {"maxOriginationLtv": p.uint96, "liquidationLtv": p.uint96}),
    ltvOracle: viewFun("0x42137cc2", "ltvOracle()", {}, p.address),
    minDebtRequired: viewFun("0x9f3b2753", "minDebtRequired()", {}, p.uint256),
    ohm: viewFun("0x02b1d239", "ohm()", {}, p.address),
    repay: fun("0x25e6b5e8", "repay(uint128,address)", {"repayAmount": p.uint128, "onBehalfOf": p.address}, p.uint128),
    requestPermissions: viewFun("0x5924be70", "requestPermissions()", {}, p.array(p.struct({"keycode": p.bytes5, "funcSelector": p.bytes4}))),
    setAuthorization: fun("0x18b7b493", "setAuthorization(address,uint96)", {"authorized": p.address, "authorizationDeadline": p.uint96}, ),
    setAuthorizationWithSig: fun("0xe54c0d96", "setAuthorizationWithSig((address,address,uint96,uint256,uint256),(uint8,bytes32,bytes32))", {"authorization": p.struct({"account": p.address, "authorized": p.address, "authorizationDeadline": p.uint96, "nonce": p.uint256, "signatureDeadline": p.uint256}), "signature": p.struct({"v": p.uint8, "r": p.bytes32, "s": p.bytes32})}, ),
    setBorrowPaused: fun("0x939752bd", "setBorrowPaused(bool)", {"isPaused": p.bool}, ),
    setInterestRateWad: fun("0xb6b89443", "setInterestRateWad(uint96)", {"newInterestRate": p.uint96}, ),
    setLiquidationsPaused: fun("0xd9a7ed5c", "setLiquidationsPaused(bool)", {"isPaused": p.bool}, ),
    setLtvOracle: fun("0x1c46b149", "setLtvOracle(address)", {"newOracle": p.address}, ),
    setMaxDelegateAddresses: fun("0x52fb2d02", "setMaxDelegateAddresses(address,uint32)", {"account": p.address, "maxDelegateAddresses": p.uint32}, ),
    setTreasuryBorrower: fun("0xdf80edfd", "setTreasuryBorrower(address)", {"newTreasuryBorrower": p.address}, ),
    staking: viewFun("0x4cf088d9", "staking()", {}, p.address),
    totalCollateral: viewFun("0x4ac8eb5f", "totalCollateral()", {}, p.uint128),
    totalDebt: viewFun("0xfc7b9c18", "totalDebt()", {}, p.uint128),
    treasuryBorrower: viewFun("0x1c34a342", "treasuryBorrower()", {}, p.address),
    withdrawCollateral: fun("0x2cf05b40", "withdrawCollateral(uint128,address,address,(address,int256)[])", {"collateralAmount": p.uint128, "onBehalfOf": p.address, "recipient": p.address, "delegationRequests": p.array(p.struct({"delegate": p.address, "amount": p.int256}))}, p.uint128),
}

export class Contract extends ContractBase {

    DLGTE() {
        return this.eth_call(functions.DLGTE, {})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    MINTR() {
        return this.eth_call(functions.MINTR, {})
    }

    ROLES() {
        return this.eth_call(functions.ROLES, {})
    }

    accountCollateral(account: AccountCollateralParams["account"]) {
        return this.eth_call(functions.accountCollateral, {account})
    }

    accountDebt(account: AccountDebtParams["account"]) {
        return this.eth_call(functions.accountDebt, {account})
    }

    accountDelegationsList(account: AccountDelegationsListParams["account"], startIndex: AccountDelegationsListParams["startIndex"], maxItems: AccountDelegationsListParams["maxItems"]) {
        return this.eth_call(functions.accountDelegationsList, {account, startIndex, maxItems})
    }

    accountPosition(account: AccountPositionParams["account"]) {
        return this.eth_call(functions.accountPosition, {account})
    }

    accountState(account: AccountStateParams["account"]) {
        return this.eth_call(functions.accountState, {account})
    }

    authorizationNonces(_0: AuthorizationNoncesParams["_0"]) {
        return this.eth_call(functions.authorizationNonces, {_0})
    }

    authorizations(_0: AuthorizationsParams["_0"], _1: AuthorizationsParams["_1"]) {
        return this.eth_call(functions.authorizations, {_0, _1})
    }

    borrowsPaused() {
        return this.eth_call(functions.borrowsPaused, {})
    }

    collateralToken() {
        return this.eth_call(functions.collateralToken, {})
    }

    computeLiquidity(accounts: ComputeLiquidityParams["accounts"]) {
        return this.eth_call(functions.computeLiquidity, {accounts})
    }

    debtDeltaForMaxOriginationLtv(account: DebtDeltaForMaxOriginationLtvParams["account"], collateralDelta: DebtDeltaForMaxOriginationLtvParams["collateralDelta"]) {
        return this.eth_call(functions.debtDeltaForMaxOriginationLtv, {account, collateralDelta})
    }

    debtToken() {
        return this.eth_call(functions.debtToken, {})
    }

    globalState() {
        return this.eth_call(functions.globalState, {})
    }

    interestAccumulatorRay() {
        return this.eth_call(functions.interestAccumulatorRay, {})
    }

    interestAccumulatorUpdatedAt() {
        return this.eth_call(functions.interestAccumulatorUpdatedAt, {})
    }

    interestRateWad() {
        return this.eth_call(functions.interestRateWad, {})
    }

    isActive() {
        return this.eth_call(functions.isActive, {})
    }

    isSenderAuthorized(sender: IsSenderAuthorizedParams["sender"], onBehalfOf: IsSenderAuthorizedParams["onBehalfOf"]) {
        return this.eth_call(functions.isSenderAuthorized, {sender, onBehalfOf})
    }

    kernel() {
        return this.eth_call(functions.kernel, {})
    }

    liquidationsPaused() {
        return this.eth_call(functions.liquidationsPaused, {})
    }

    loanToValues() {
        return this.eth_call(functions.loanToValues, {})
    }

    ltvOracle() {
        return this.eth_call(functions.ltvOracle, {})
    }

    minDebtRequired() {
        return this.eth_call(functions.minDebtRequired, {})
    }

    ohm() {
        return this.eth_call(functions.ohm, {})
    }

    requestPermissions() {
        return this.eth_call(functions.requestPermissions, {})
    }

    staking() {
        return this.eth_call(functions.staking, {})
    }

    totalCollateral() {
        return this.eth_call(functions.totalCollateral, {})
    }

    totalDebt() {
        return this.eth_call(functions.totalDebt, {})
    }

    treasuryBorrower() {
        return this.eth_call(functions.treasuryBorrower, {})
    }
}

/// Event types
export type AuthorizationSetEventArgs = EParams<typeof events.AuthorizationSet>
export type BorrowEventArgs = EParams<typeof events.Borrow>
export type BorrowPausedSetEventArgs = EParams<typeof events.BorrowPausedSet>
export type CollateralAddedEventArgs = EParams<typeof events.CollateralAdded>
export type CollateralWithdrawnEventArgs = EParams<typeof events.CollateralWithdrawn>
export type InterestRateSetEventArgs = EParams<typeof events.InterestRateSet>
export type LiquidatedEventArgs = EParams<typeof events.Liquidated>
export type LiquidationsPausedSetEventArgs = EParams<typeof events.LiquidationsPausedSet>
export type LtvOracleSetEventArgs = EParams<typeof events.LtvOracleSet>
export type RepayEventArgs = EParams<typeof events.Repay>
export type TreasuryBorrowerSetEventArgs = EParams<typeof events.TreasuryBorrowerSet>

/// Function types
export type DLGTEParams = FunctionArguments<typeof functions.DLGTE>
export type DLGTEReturn = FunctionReturn<typeof functions.DLGTE>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type MINTRParams = FunctionArguments<typeof functions.MINTR>
export type MINTRReturn = FunctionReturn<typeof functions.MINTR>

export type ROLESParams = FunctionArguments<typeof functions.ROLES>
export type ROLESReturn = FunctionReturn<typeof functions.ROLES>

export type AccountCollateralParams = FunctionArguments<typeof functions.accountCollateral>
export type AccountCollateralReturn = FunctionReturn<typeof functions.accountCollateral>

export type AccountDebtParams = FunctionArguments<typeof functions.accountDebt>
export type AccountDebtReturn = FunctionReturn<typeof functions.accountDebt>

export type AccountDelegationsListParams = FunctionArguments<typeof functions.accountDelegationsList>
export type AccountDelegationsListReturn = FunctionReturn<typeof functions.accountDelegationsList>

export type AccountPositionParams = FunctionArguments<typeof functions.accountPosition>
export type AccountPositionReturn = FunctionReturn<typeof functions.accountPosition>

export type AccountStateParams = FunctionArguments<typeof functions.accountState>
export type AccountStateReturn = FunctionReturn<typeof functions.accountState>

export type AddCollateralParams = FunctionArguments<typeof functions.addCollateral>
export type AddCollateralReturn = FunctionReturn<typeof functions.addCollateral>

export type ApplyDelegationsParams = FunctionArguments<typeof functions.applyDelegations>
export type ApplyDelegationsReturn = FunctionReturn<typeof functions.applyDelegations>

export type ApplyUnhealthyDelegationsParams = FunctionArguments<typeof functions.applyUnhealthyDelegations>
export type ApplyUnhealthyDelegationsReturn = FunctionReturn<typeof functions.applyUnhealthyDelegations>

export type AuthorizationNoncesParams = FunctionArguments<typeof functions.authorizationNonces>
export type AuthorizationNoncesReturn = FunctionReturn<typeof functions.authorizationNonces>

export type AuthorizationsParams = FunctionArguments<typeof functions.authorizations>
export type AuthorizationsReturn = FunctionReturn<typeof functions.authorizations>

export type BatchLiquidateParams = FunctionArguments<typeof functions.batchLiquidate>
export type BatchLiquidateReturn = FunctionReturn<typeof functions.batchLiquidate>

export type BorrowParams = FunctionArguments<typeof functions.borrow>
export type BorrowReturn = FunctionReturn<typeof functions.borrow>

export type BorrowsPausedParams = FunctionArguments<typeof functions.borrowsPaused>
export type BorrowsPausedReturn = FunctionReturn<typeof functions.borrowsPaused>

export type ChangeKernelParams = FunctionArguments<typeof functions.changeKernel>
export type ChangeKernelReturn = FunctionReturn<typeof functions.changeKernel>

export type CheckpointDebtParams = FunctionArguments<typeof functions.checkpointDebt>
export type CheckpointDebtReturn = FunctionReturn<typeof functions.checkpointDebt>

export type CollateralTokenParams = FunctionArguments<typeof functions.collateralToken>
export type CollateralTokenReturn = FunctionReturn<typeof functions.collateralToken>

export type ComputeLiquidityParams = FunctionArguments<typeof functions.computeLiquidity>
export type ComputeLiquidityReturn = FunctionReturn<typeof functions.computeLiquidity>

export type ConfigureDependenciesParams = FunctionArguments<typeof functions.configureDependencies>
export type ConfigureDependenciesReturn = FunctionReturn<typeof functions.configureDependencies>

export type DebtDeltaForMaxOriginationLtvParams = FunctionArguments<typeof functions.debtDeltaForMaxOriginationLtv>
export type DebtDeltaForMaxOriginationLtvReturn = FunctionReturn<typeof functions.debtDeltaForMaxOriginationLtv>

export type DebtTokenParams = FunctionArguments<typeof functions.debtToken>
export type DebtTokenReturn = FunctionReturn<typeof functions.debtToken>

export type GlobalStateParams = FunctionArguments<typeof functions.globalState>
export type GlobalStateReturn = FunctionReturn<typeof functions.globalState>

export type InterestAccumulatorRayParams = FunctionArguments<typeof functions.interestAccumulatorRay>
export type InterestAccumulatorRayReturn = FunctionReturn<typeof functions.interestAccumulatorRay>

export type InterestAccumulatorUpdatedAtParams = FunctionArguments<typeof functions.interestAccumulatorUpdatedAt>
export type InterestAccumulatorUpdatedAtReturn = FunctionReturn<typeof functions.interestAccumulatorUpdatedAt>

export type InterestRateWadParams = FunctionArguments<typeof functions.interestRateWad>
export type InterestRateWadReturn = FunctionReturn<typeof functions.interestRateWad>

export type IsActiveParams = FunctionArguments<typeof functions.isActive>
export type IsActiveReturn = FunctionReturn<typeof functions.isActive>

export type IsSenderAuthorizedParams = FunctionArguments<typeof functions.isSenderAuthorized>
export type IsSenderAuthorizedReturn = FunctionReturn<typeof functions.isSenderAuthorized>

export type KernelParams = FunctionArguments<typeof functions.kernel>
export type KernelReturn = FunctionReturn<typeof functions.kernel>

export type LiquidationsPausedParams = FunctionArguments<typeof functions.liquidationsPaused>
export type LiquidationsPausedReturn = FunctionReturn<typeof functions.liquidationsPaused>

export type LoanToValuesParams = FunctionArguments<typeof functions.loanToValues>
export type LoanToValuesReturn = FunctionReturn<typeof functions.loanToValues>

export type LtvOracleParams = FunctionArguments<typeof functions.ltvOracle>
export type LtvOracleReturn = FunctionReturn<typeof functions.ltvOracle>

export type MinDebtRequiredParams = FunctionArguments<typeof functions.minDebtRequired>
export type MinDebtRequiredReturn = FunctionReturn<typeof functions.minDebtRequired>

export type OhmParams = FunctionArguments<typeof functions.ohm>
export type OhmReturn = FunctionReturn<typeof functions.ohm>

export type RepayParams = FunctionArguments<typeof functions.repay>
export type RepayReturn = FunctionReturn<typeof functions.repay>

export type RequestPermissionsParams = FunctionArguments<typeof functions.requestPermissions>
export type RequestPermissionsReturn = FunctionReturn<typeof functions.requestPermissions>

export type SetAuthorizationParams = FunctionArguments<typeof functions.setAuthorization>
export type SetAuthorizationReturn = FunctionReturn<typeof functions.setAuthorization>

export type SetAuthorizationWithSigParams = FunctionArguments<typeof functions.setAuthorizationWithSig>
export type SetAuthorizationWithSigReturn = FunctionReturn<typeof functions.setAuthorizationWithSig>

export type SetBorrowPausedParams = FunctionArguments<typeof functions.setBorrowPaused>
export type SetBorrowPausedReturn = FunctionReturn<typeof functions.setBorrowPaused>

export type SetInterestRateWadParams = FunctionArguments<typeof functions.setInterestRateWad>
export type SetInterestRateWadReturn = FunctionReturn<typeof functions.setInterestRateWad>

export type SetLiquidationsPausedParams = FunctionArguments<typeof functions.setLiquidationsPaused>
export type SetLiquidationsPausedReturn = FunctionReturn<typeof functions.setLiquidationsPaused>

export type SetLtvOracleParams = FunctionArguments<typeof functions.setLtvOracle>
export type SetLtvOracleReturn = FunctionReturn<typeof functions.setLtvOracle>

export type SetMaxDelegateAddressesParams = FunctionArguments<typeof functions.setMaxDelegateAddresses>
export type SetMaxDelegateAddressesReturn = FunctionReturn<typeof functions.setMaxDelegateAddresses>

export type SetTreasuryBorrowerParams = FunctionArguments<typeof functions.setTreasuryBorrower>
export type SetTreasuryBorrowerReturn = FunctionReturn<typeof functions.setTreasuryBorrower>

export type StakingParams = FunctionArguments<typeof functions.staking>
export type StakingReturn = FunctionReturn<typeof functions.staking>

export type TotalCollateralParams = FunctionArguments<typeof functions.totalCollateral>
export type TotalCollateralReturn = FunctionReturn<typeof functions.totalCollateral>

export type TotalDebtParams = FunctionArguments<typeof functions.totalDebt>
export type TotalDebtReturn = FunctionReturn<typeof functions.totalDebt>

export type TreasuryBorrowerParams = FunctionArguments<typeof functions.treasuryBorrower>
export type TreasuryBorrowerReturn = FunctionReturn<typeof functions.treasuryBorrower>

export type WithdrawCollateralParams = FunctionArguments<typeof functions.withdrawCollateral>
export type WithdrawCollateralReturn = FunctionReturn<typeof functions.withdrawCollateral>

