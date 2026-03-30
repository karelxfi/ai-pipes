import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AddDynamicReserveConfig: event("0xfcede5501ba87e3766118ae6ed360a87ee9b6570156ae9cac52d35ff0de0403b", "AddDynamicReserveConfig(uint256,uint32,(uint16,uint32,uint16))", {"reserveId": indexed(p.uint256), "dynamicConfigKey": indexed(p.uint32), "config": p.struct({"collateralFactor": p.uint16, "maxLiquidationBonus": p.uint32, "liquidationFee": p.uint16})}),
    AddReserve: event("0xb2d3221c3db1eb0d586556ae23399acdfe3e52ff0fcd184c19069c730f9ca2e9", "AddReserve(uint256,uint256,address)", {"reserveId": indexed(p.uint256), "assetId": indexed(p.uint256), "hub": indexed(p.address)}),
    AuthorityUpdated: event("0x2f658b440c35314f52658ea8a740e05b284cdc84dc9ae01e891f21b8933e7cad", "AuthorityUpdated(address)", {"authority": p.address}),
    Borrow: event("0xef18174796a5d2f91d51dc5e907a4d7867bbd6e800f6225168e0453d581d0dcd", "Borrow(uint256,address,address,uint256,uint256)", {"reserveId": indexed(p.uint256), "caller": indexed(p.address), "user": indexed(p.address), "drawnShares": p.uint256, "drawnAmount": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    LiquidationCall: event("0x2a1f12d996f530f89d8038aa293f9fde81cac44b6dfd6225e3358d09b78a4a37", "LiquidationCall(uint256,uint256,address,address,bool,uint256,uint256,(int256,int256,uint256),uint256,uint256,uint256)", {"collateralReserveId": indexed(p.uint256), "debtReserveId": indexed(p.uint256), "user": indexed(p.address), "liquidator": p.address, "receiveShares": p.bool, "debtAmountRestored": p.uint256, "drawnSharesLiquidated": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256}), "collateralAmountRemoved": p.uint256, "collateralSharesLiquidated": p.uint256, "collateralSharesToLiquidator": p.uint256}),
    RefreshAllUserDynamicConfig: event("0x837314749a8459031ad895d39a13552d1627fddc93d64b404bab0ae5f0798da7", "RefreshAllUserDynamicConfig(address)", {"user": indexed(p.address)}),
    RefreshPremiumDebt: event("0x4fd0c5440d5b8c1dd712c65f039f54384c59e81a139427b0a9155260d974a9a7", "RefreshPremiumDebt(uint256,address,(int256,int256,uint256))", {"reserveId": indexed(p.uint256), "user": indexed(p.address), "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}),
    RefreshSingleUserDynamicConfig: event("0x5790b5f096c9cfee6b98a4e2d4f54ff3fc4ca306df5bc2093d93a36496d917b8", "RefreshSingleUserDynamicConfig(address,uint256)", {"user": indexed(p.address), "reserveId": p.uint256}),
    Repay: event("0xd765a0263e8a360da8dd4fdb8c0dc5553adec12a96f29a462cdb45e5bea407dd", "Repay(uint256,address,address,uint256,uint256,(int256,int256,uint256))", {"reserveId": indexed(p.uint256), "caller": indexed(p.address), "user": indexed(p.address), "drawnShares": p.uint256, "totalAmountRepaid": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}),
    ReportDeficit: event("0x59932f333b3a5e3fec86e662babe8dd767529ed207420e7468bd220cdfb3f076", "ReportDeficit(uint256,address,uint256,(int256,int256,uint256))", {"reserveId": indexed(p.uint256), "user": indexed(p.address), "drawnShares": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}),
    SetSpokeImmutables: event("0x6d87c7e547bc13244d61719fa011b6947b26036a16d69a607c1cf72a77d052bc", "SetSpokeImmutables(address,uint16)", {"oracle": indexed(p.address), "maxUserReservesLimit": p.uint16}),
    SetUserPositionManager: event("0x413bea992b9956f4f10f6c819bf7a6c8ed5baa119a2901fe221ae03171d52277", "SetUserPositionManager(address,address,bool)", {"user": indexed(p.address), "positionManager": indexed(p.address), "approve": p.bool}),
    SetUsingAsCollateral: event("0x4763df430bc5274807f8ab4ce0734e7898513638418d6eec0c5285ef85f7f51f", "SetUsingAsCollateral(uint256,address,address,bool)", {"reserveId": indexed(p.uint256), "caller": indexed(p.address), "user": indexed(p.address), "usingAsCollateral": p.bool}),
    Supply: event("0xd986db228cb1fe8392c5f45ff5f2c639b7db6cbd9ca7d1fe70b2de90c2c8c961", "Supply(uint256,address,address,uint256,uint256)", {"reserveId": indexed(p.uint256), "caller": indexed(p.address), "user": indexed(p.address), "suppliedShares": p.uint256, "suppliedAmount": p.uint256}),
    UpdateDynamicReserveConfig: event("0x2d4f2760aaff0dfa53526a8fdd306864689a7d5e43f44ddfeece0f38315c298d", "UpdateDynamicReserveConfig(uint256,uint32,(uint16,uint32,uint16))", {"reserveId": indexed(p.uint256), "dynamicConfigKey": indexed(p.uint32), "config": p.struct({"collateralFactor": p.uint16, "maxLiquidationBonus": p.uint32, "liquidationFee": p.uint16})}),
    UpdateLiquidationConfig: event("0x9062eec1933c38394d82dc926d7ddcd777a5cd08e1ae6baa94e90047338d3459", "UpdateLiquidationConfig((uint128,uint64,uint16))", {"config": p.struct({"targetHealthFactor": p.uint128, "healthFactorForMaxBonus": p.uint64, "liquidationBonusFactor": p.uint16})}),
    UpdatePositionManager: event("0x8e04e916c2b397f8ab1cf9a55e94728a44837b3751f72369339ad991d371edc4", "UpdatePositionManager(address,bool)", {"positionManager": indexed(p.address), "active": p.bool}),
    UpdateReserveConfig: event("0xe9495512a0eb05fe0cbdd52286bdeb54cb8e5a8d50e7e17d75f75903a98e2af8", "UpdateReserveConfig(uint256,(uint24,bool,bool,bool,bool))", {"reserveId": indexed(p.uint256), "config": p.struct({"collateralRisk": p.uint24, "paused": p.bool, "frozen": p.bool, "borrowable": p.bool, "receiveSharesEnabled": p.bool})}),
    UpdateReservePriceSource: event("0x18a45d070f507b6387b78837652d7468e733927acc7f9a13d9cc308675735c08", "UpdateReservePriceSource(uint256,address)", {"reserveId": indexed(p.uint256), "priceSource": indexed(p.address)}),
    UpdateUserRiskPremium: event("0x9a9082fd74a00ac52b567642a2d8fd3383cb2bd8690f6b2a3b7b37aaf489dac1", "UpdateUserRiskPremium(address,uint256)", {"user": indexed(p.address), "riskPremium": p.uint256}),
    Withdraw: event("0xfe7813e2866053d5c3938554e517b554fce6666a6561bed9eaa7419b29fa9b68", "Withdraw(uint256,address,address,uint256,uint256)", {"reserveId": indexed(p.uint256), "caller": indexed(p.address), "user": indexed(p.address), "withdrawnShares": p.uint256, "withdrawnAmount": p.uint256}),
}

export const functions = {
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    MAX_USER_RESERVES_LIMIT: viewFun("0x3d59ce76", "MAX_USER_RESERVES_LIMIT()", {}, p.uint16),
    ORACLE: viewFun("0x38013f02", "ORACLE()", {}, p.address),
    SET_USER_POSITION_MANAGERS_TYPEHASH: viewFun("0xf6acf369", "SET_USER_POSITION_MANAGERS_TYPEHASH()", {}, p.bytes32),
    SPOKE_REVISION: viewFun("0xe8dccc22", "SPOKE_REVISION()", {}, p.uint64),
    addDynamicReserveConfig: fun("0x9290fa00", "addDynamicReserveConfig(uint256,(uint16,uint32,uint16))", {"reserveId": p.uint256, "dynamicConfig": p.struct({"collateralFactor": p.uint16, "maxLiquidationBonus": p.uint32, "liquidationFee": p.uint16})}, p.uint32),
    addReserve: fun("0x4de8d2ba", "addReserve(address,uint256,address,(uint24,bool,bool,bool,bool),(uint16,uint32,uint16))", {"hub": p.address, "assetId": p.uint256, "priceSource": p.address, "config": p.struct({"collateralRisk": p.uint24, "paused": p.bool, "frozen": p.bool, "borrowable": p.bool, "receiveSharesEnabled": p.bool}), "dynamicConfig": p.struct({"collateralFactor": p.uint16, "maxLiquidationBonus": p.uint32, "liquidationFee": p.uint16})}, p.uint256),
    authority: viewFun("0xbf7e214f", "authority()", {}, p.address),
    borrow: fun("0xd6bda0c0", "borrow(uint256,uint256,address)", {"reserveId": p.uint256, "amount": p.uint256, "onBehalfOf": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    eip712Domain: viewFun("0x84b0196e", "eip712Domain()", {}, {"fields": p.bytes1, "name": p.string, "version": p.string, "chainId": p.uint256, "verifyingContract": p.address, "salt": p.bytes32, "extensions": p.array(p.uint256)}),
    extSload: viewFun("0xaaaf97ab", "extSload(bytes32)", {"slot": p.bytes32}, p.bytes32),
    extSloads: viewFun("0x7784c685", "extSloads(bytes32[])", {"slots": p.array(p.bytes32)}, p.array(p.bytes32)),
    getDynamicReserveConfig: viewFun("0xec17bb00", "getDynamicReserveConfig(uint256,uint32)", {"reserveId": p.uint256, "dynamicConfigKey": p.uint32}, p.struct({"collateralFactor": p.uint16, "maxLiquidationBonus": p.uint32, "liquidationFee": p.uint16})),
    getLiquidationBonus: viewFun("0x46fbf741", "getLiquidationBonus(uint256,address,uint256)", {"reserveId": p.uint256, "user": p.address, "healthFactor": p.uint256}, p.uint256),
    getLiquidationConfig: viewFun("0xe0fd5c5c", "getLiquidationConfig()", {}, p.struct({"targetHealthFactor": p.uint128, "healthFactorForMaxBonus": p.uint64, "liquidationBonusFactor": p.uint16})),
    getLiquidationLogic: viewFun("0x911a3413", "getLiquidationLogic()", {}, p.address),
    getReserve: viewFun("0x77778db3", "getReserve(uint256)", {"reserveId": p.uint256}, p.struct({"underlying": p.address, "hub": p.address, "assetId": p.uint16, "decimals": p.uint8, "collateralRisk": p.uint24, "flags": p.uint8, "dynamicConfigKey": p.uint32})),
    getReserveConfig: viewFun("0x008754a2", "getReserveConfig(uint256)", {"reserveId": p.uint256}, p.struct({"collateralRisk": p.uint24, "paused": p.bool, "frozen": p.bool, "borrowable": p.bool, "receiveSharesEnabled": p.bool})),
    getReserveCount: viewFun("0x99806546", "getReserveCount()", {}, p.uint256),
    getReserveDebt: viewFun("0x93eff7a8", "getReserveDebt(uint256)", {"reserveId": p.uint256}, {"_0": p.uint256, "_1": p.uint256}),
    getReserveId: viewFun("0x42aef1f1", "getReserveId(address,uint256)", {"hub": p.address, "assetId": p.uint256}, p.uint256),
    getReserveSuppliedAssets: viewFun("0x2fd00527", "getReserveSuppliedAssets(uint256)", {"reserveId": p.uint256}, p.uint256),
    getReserveSuppliedShares: viewFun("0xce603521", "getReserveSuppliedShares(uint256)", {"reserveId": p.uint256}, p.uint256),
    getReserveTotalDebt: viewFun("0x1cdc762c", "getReserveTotalDebt(uint256)", {"reserveId": p.uint256}, p.uint256),
    getUserAccountData: viewFun("0xbf92857c", "getUserAccountData(address)", {"user": p.address}, p.struct({"riskPremium": p.uint256, "avgCollateralFactor": p.uint256, "healthFactor": p.uint256, "totalCollateralValue": p.uint256, "totalDebtValueRay": p.uint256, "activeCollateralCount": p.uint256, "borrowCount": p.uint256})),
    getUserDebt: viewFun("0x7445fb16", "getUserDebt(uint256,address)", {"reserveId": p.uint256, "user": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    getUserLastRiskPremium: viewFun("0x238b26d3", "getUserLastRiskPremium(address)", {"user": p.address}, p.uint256),
    getUserPosition: viewFun("0x869da9db", "getUserPosition(uint256,address)", {"reserveId": p.uint256, "user": p.address}, p.struct({"drawnShares": p.uint120, "premiumShares": p.uint120, "premiumOffsetRay": p.int200, "suppliedShares": p.uint120, "dynamicConfigKey": p.uint32})),
    getUserPremiumDebtRay: viewFun("0xac177f1b", "getUserPremiumDebtRay(uint256,address)", {"reserveId": p.uint256, "user": p.address}, p.uint256),
    getUserReserveStatus: viewFun("0xa2a522f1", "getUserReserveStatus(uint256,address)", {"reserveId": p.uint256, "user": p.address}, {"_0": p.bool, "_1": p.bool}),
    getUserSuppliedAssets: viewFun("0xf1568a89", "getUserSuppliedAssets(uint256,address)", {"reserveId": p.uint256, "user": p.address}, p.uint256),
    getUserSuppliedShares: viewFun("0x2fa08544", "getUserSuppliedShares(uint256,address)", {"reserveId": p.uint256, "user": p.address}, p.uint256),
    getUserTotalDebt: viewFun("0x9b7172a6", "getUserTotalDebt(uint256,address)", {"reserveId": p.uint256, "user": p.address}, p.uint256),
    initialize: fun("0xc4d66de8", "initialize(address)", {"authority": p.address}, ),
    isConsumingScheduledOp: viewFun("0x8fb36037", "isConsumingScheduledOp()", {}, p.bytes4),
    isPositionManager: viewFun("0x2630faab", "isPositionManager(address,address)", {"user": p.address, "positionManager": p.address}, p.bool),
    isPositionManagerActive: viewFun("0x6a3b37da", "isPositionManagerActive(address)", {"positionManager": p.address}, p.bool),
    liquidationCall: fun("0xc2fa746c", "liquidationCall(uint256,uint256,address,uint256,bool)", {"collateralReserveId": p.uint256, "debtReserveId": p.uint256, "user": p.address, "debtToCover": p.uint256, "receiveShares": p.bool}, ),
    multicall: fun("0xac9650d8", "multicall(bytes[])", {"data": p.array(p.bytes)}, p.array(p.bytes)),
    nonces: viewFun("0xbef37613", "nonces(address,uint192)", {"owner": p.address, "key": p.uint192}, p.uint256),
    permitReserve: fun("0x2bccdfd5", "permitReserve(uint256,address,uint256,uint256,uint8,bytes32,bytes32)", {"reserveId": p.uint256, "onBehalfOf": p.address, "value": p.uint256, "deadline": p.uint256, "permitV": p.uint8, "permitR": p.bytes32, "permitS": p.bytes32}, ),
    renouncePositionManagerRole: fun("0xfea149a6", "renouncePositionManagerRole(address)", {"onBehalfOf": p.address}, ),
    repay: fun("0xb1e8f8ef", "repay(uint256,uint256,address)", {"reserveId": p.uint256, "amount": p.uint256, "onBehalfOf": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    setAuthority: fun("0x7a9e5e4b", "setAuthority(address)", {"newAuthority": p.address}, ),
    setUserPositionManager: fun("0x8874e104", "setUserPositionManager(address,bool)", {"positionManager": p.address, "approve": p.bool}, ),
    setUserPositionManagersWithSig: fun("0x03ed05c1", "setUserPositionManagersWithSig((address,(address,bool)[],uint256,uint256),bytes)", {"params": p.struct({"onBehalfOf": p.address, "updates": p.array(p.struct({"positionManager": p.address, "approve": p.bool})), "nonce": p.uint256, "deadline": p.uint256}), "signature": p.bytes}, ),
    setUsingAsCollateral: fun("0x9e35c533", "setUsingAsCollateral(uint256,bool,address)", {"reserveId": p.uint256, "usingAsCollateral": p.bool, "onBehalfOf": p.address}, ),
    supply: fun("0x852a56a5", "supply(uint256,uint256,address)", {"reserveId": p.uint256, "amount": p.uint256, "onBehalfOf": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    updateDynamicReserveConfig: fun("0xe903e1bd", "updateDynamicReserveConfig(uint256,uint32,(uint16,uint32,uint16))", {"reserveId": p.uint256, "dynamicConfigKey": p.uint32, "dynamicConfig": p.struct({"collateralFactor": p.uint16, "maxLiquidationBonus": p.uint32, "liquidationFee": p.uint16})}, ),
    updateLiquidationConfig: fun("0x87107a6d", "updateLiquidationConfig((uint128,uint64,uint16))", {"config": p.struct({"targetHealthFactor": p.uint128, "healthFactorForMaxBonus": p.uint64, "liquidationBonusFactor": p.uint16})}, ),
    updatePositionManager: fun("0x9ca9c134", "updatePositionManager(address,bool)", {"positionManager": p.address, "active": p.bool}, ),
    updateReserveConfig: fun("0xa0f5b9ab", "updateReserveConfig(uint256,(uint24,bool,bool,bool,bool))", {"reserveId": p.uint256, "config": p.struct({"collateralRisk": p.uint24, "paused": p.bool, "frozen": p.bool, "borrowable": p.bool, "receiveSharesEnabled": p.bool})}, ),
    updateReservePriceSource: fun("0xb2380e93", "updateReservePriceSource(uint256,address)", {"reserveId": p.uint256, "priceSource": p.address}, ),
    updateUserDynamicConfig: fun("0x826002e2", "updateUserDynamicConfig(address)", {"onBehalfOf": p.address}, ),
    updateUserRiskPremium: fun("0x91c46d09", "updateUserRiskPremium(address)", {"onBehalfOf": p.address}, ),
    useNonce: fun("0xd86b407f", "useNonce(uint192)", {"key": p.uint192}, p.uint256),
    withdraw: fun("0x0ad58d2f", "withdraw(uint256,uint256,address)", {"reserveId": p.uint256, "amount": p.uint256, "onBehalfOf": p.address}, {"_0": p.uint256, "_1": p.uint256}),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    MAX_USER_RESERVES_LIMIT() {
        return this.eth_call(functions.MAX_USER_RESERVES_LIMIT, {})
    }

    ORACLE() {
        return this.eth_call(functions.ORACLE, {})
    }

    SET_USER_POSITION_MANAGERS_TYPEHASH() {
        return this.eth_call(functions.SET_USER_POSITION_MANAGERS_TYPEHASH, {})
    }

    SPOKE_REVISION() {
        return this.eth_call(functions.SPOKE_REVISION, {})
    }

    authority() {
        return this.eth_call(functions.authority, {})
    }

    eip712Domain() {
        return this.eth_call(functions.eip712Domain, {})
    }

    extSload(slot: ExtSloadParams["slot"]) {
        return this.eth_call(functions.extSload, {slot})
    }

    extSloads(slots: ExtSloadsParams["slots"]) {
        return this.eth_call(functions.extSloads, {slots})
    }

    getDynamicReserveConfig(reserveId: GetDynamicReserveConfigParams["reserveId"], dynamicConfigKey: GetDynamicReserveConfigParams["dynamicConfigKey"]) {
        return this.eth_call(functions.getDynamicReserveConfig, {reserveId, dynamicConfigKey})
    }

    getLiquidationBonus(reserveId: GetLiquidationBonusParams["reserveId"], user: GetLiquidationBonusParams["user"], healthFactor: GetLiquidationBonusParams["healthFactor"]) {
        return this.eth_call(functions.getLiquidationBonus, {reserveId, user, healthFactor})
    }

    getLiquidationConfig() {
        return this.eth_call(functions.getLiquidationConfig, {})
    }

    getLiquidationLogic() {
        return this.eth_call(functions.getLiquidationLogic, {})
    }

    getReserve(reserveId: GetReserveParams["reserveId"]) {
        return this.eth_call(functions.getReserve, {reserveId})
    }

    getReserveConfig(reserveId: GetReserveConfigParams["reserveId"]) {
        return this.eth_call(functions.getReserveConfig, {reserveId})
    }

    getReserveCount() {
        return this.eth_call(functions.getReserveCount, {})
    }

    getReserveDebt(reserveId: GetReserveDebtParams["reserveId"]) {
        return this.eth_call(functions.getReserveDebt, {reserveId})
    }

    getReserveId(hub: GetReserveIdParams["hub"], assetId: GetReserveIdParams["assetId"]) {
        return this.eth_call(functions.getReserveId, {hub, assetId})
    }

    getReserveSuppliedAssets(reserveId: GetReserveSuppliedAssetsParams["reserveId"]) {
        return this.eth_call(functions.getReserveSuppliedAssets, {reserveId})
    }

    getReserveSuppliedShares(reserveId: GetReserveSuppliedSharesParams["reserveId"]) {
        return this.eth_call(functions.getReserveSuppliedShares, {reserveId})
    }

    getReserveTotalDebt(reserveId: GetReserveTotalDebtParams["reserveId"]) {
        return this.eth_call(functions.getReserveTotalDebt, {reserveId})
    }

    getUserAccountData(user: GetUserAccountDataParams["user"]) {
        return this.eth_call(functions.getUserAccountData, {user})
    }

    getUserDebt(reserveId: GetUserDebtParams["reserveId"], user: GetUserDebtParams["user"]) {
        return this.eth_call(functions.getUserDebt, {reserveId, user})
    }

    getUserLastRiskPremium(user: GetUserLastRiskPremiumParams["user"]) {
        return this.eth_call(functions.getUserLastRiskPremium, {user})
    }

    getUserPosition(reserveId: GetUserPositionParams["reserveId"], user: GetUserPositionParams["user"]) {
        return this.eth_call(functions.getUserPosition, {reserveId, user})
    }

    getUserPremiumDebtRay(reserveId: GetUserPremiumDebtRayParams["reserveId"], user: GetUserPremiumDebtRayParams["user"]) {
        return this.eth_call(functions.getUserPremiumDebtRay, {reserveId, user})
    }

    getUserReserveStatus(reserveId: GetUserReserveStatusParams["reserveId"], user: GetUserReserveStatusParams["user"]) {
        return this.eth_call(functions.getUserReserveStatus, {reserveId, user})
    }

    getUserSuppliedAssets(reserveId: GetUserSuppliedAssetsParams["reserveId"], user: GetUserSuppliedAssetsParams["user"]) {
        return this.eth_call(functions.getUserSuppliedAssets, {reserveId, user})
    }

    getUserSuppliedShares(reserveId: GetUserSuppliedSharesParams["reserveId"], user: GetUserSuppliedSharesParams["user"]) {
        return this.eth_call(functions.getUserSuppliedShares, {reserveId, user})
    }

    getUserTotalDebt(reserveId: GetUserTotalDebtParams["reserveId"], user: GetUserTotalDebtParams["user"]) {
        return this.eth_call(functions.getUserTotalDebt, {reserveId, user})
    }

    isConsumingScheduledOp() {
        return this.eth_call(functions.isConsumingScheduledOp, {})
    }

    isPositionManager(user: IsPositionManagerParams["user"], positionManager: IsPositionManagerParams["positionManager"]) {
        return this.eth_call(functions.isPositionManager, {user, positionManager})
    }

    isPositionManagerActive(positionManager: IsPositionManagerActiveParams["positionManager"]) {
        return this.eth_call(functions.isPositionManagerActive, {positionManager})
    }

    nonces(owner: NoncesParams["owner"], key: NoncesParams["key"]) {
        return this.eth_call(functions.nonces, {owner, key})
    }
}

/// Event types
export type AddDynamicReserveConfigEventArgs = EParams<typeof events.AddDynamicReserveConfig>
export type AddReserveEventArgs = EParams<typeof events.AddReserve>
export type AuthorityUpdatedEventArgs = EParams<typeof events.AuthorityUpdated>
export type BorrowEventArgs = EParams<typeof events.Borrow>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LiquidationCallEventArgs = EParams<typeof events.LiquidationCall>
export type RefreshAllUserDynamicConfigEventArgs = EParams<typeof events.RefreshAllUserDynamicConfig>
export type RefreshPremiumDebtEventArgs = EParams<typeof events.RefreshPremiumDebt>
export type RefreshSingleUserDynamicConfigEventArgs = EParams<typeof events.RefreshSingleUserDynamicConfig>
export type RepayEventArgs = EParams<typeof events.Repay>
export type ReportDeficitEventArgs = EParams<typeof events.ReportDeficit>
export type SetSpokeImmutablesEventArgs = EParams<typeof events.SetSpokeImmutables>
export type SetUserPositionManagerEventArgs = EParams<typeof events.SetUserPositionManager>
export type SetUsingAsCollateralEventArgs = EParams<typeof events.SetUsingAsCollateral>
export type SupplyEventArgs = EParams<typeof events.Supply>
export type UpdateDynamicReserveConfigEventArgs = EParams<typeof events.UpdateDynamicReserveConfig>
export type UpdateLiquidationConfigEventArgs = EParams<typeof events.UpdateLiquidationConfig>
export type UpdatePositionManagerEventArgs = EParams<typeof events.UpdatePositionManager>
export type UpdateReserveConfigEventArgs = EParams<typeof events.UpdateReserveConfig>
export type UpdateReservePriceSourceEventArgs = EParams<typeof events.UpdateReservePriceSource>
export type UpdateUserRiskPremiumEventArgs = EParams<typeof events.UpdateUserRiskPremium>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type MAX_USER_RESERVES_LIMITParams = FunctionArguments<typeof functions.MAX_USER_RESERVES_LIMIT>
export type MAX_USER_RESERVES_LIMITReturn = FunctionReturn<typeof functions.MAX_USER_RESERVES_LIMIT>

export type ORACLEParams = FunctionArguments<typeof functions.ORACLE>
export type ORACLEReturn = FunctionReturn<typeof functions.ORACLE>

export type SET_USER_POSITION_MANAGERS_TYPEHASHParams = FunctionArguments<typeof functions.SET_USER_POSITION_MANAGERS_TYPEHASH>
export type SET_USER_POSITION_MANAGERS_TYPEHASHReturn = FunctionReturn<typeof functions.SET_USER_POSITION_MANAGERS_TYPEHASH>

export type SPOKE_REVISIONParams = FunctionArguments<typeof functions.SPOKE_REVISION>
export type SPOKE_REVISIONReturn = FunctionReturn<typeof functions.SPOKE_REVISION>

export type AddDynamicReserveConfigParams = FunctionArguments<typeof functions.addDynamicReserveConfig>
export type AddDynamicReserveConfigReturn = FunctionReturn<typeof functions.addDynamicReserveConfig>

export type AddReserveParams = FunctionArguments<typeof functions.addReserve>
export type AddReserveReturn = FunctionReturn<typeof functions.addReserve>

export type AuthorityParams = FunctionArguments<typeof functions.authority>
export type AuthorityReturn = FunctionReturn<typeof functions.authority>

export type BorrowParams = FunctionArguments<typeof functions.borrow>
export type BorrowReturn = FunctionReturn<typeof functions.borrow>

export type Eip712DomainParams = FunctionArguments<typeof functions.eip712Domain>
export type Eip712DomainReturn = FunctionReturn<typeof functions.eip712Domain>

export type ExtSloadParams = FunctionArguments<typeof functions.extSload>
export type ExtSloadReturn = FunctionReturn<typeof functions.extSload>

export type ExtSloadsParams = FunctionArguments<typeof functions.extSloads>
export type ExtSloadsReturn = FunctionReturn<typeof functions.extSloads>

export type GetDynamicReserveConfigParams = FunctionArguments<typeof functions.getDynamicReserveConfig>
export type GetDynamicReserveConfigReturn = FunctionReturn<typeof functions.getDynamicReserveConfig>

export type GetLiquidationBonusParams = FunctionArguments<typeof functions.getLiquidationBonus>
export type GetLiquidationBonusReturn = FunctionReturn<typeof functions.getLiquidationBonus>

export type GetLiquidationConfigParams = FunctionArguments<typeof functions.getLiquidationConfig>
export type GetLiquidationConfigReturn = FunctionReturn<typeof functions.getLiquidationConfig>

export type GetLiquidationLogicParams = FunctionArguments<typeof functions.getLiquidationLogic>
export type GetLiquidationLogicReturn = FunctionReturn<typeof functions.getLiquidationLogic>

export type GetReserveParams = FunctionArguments<typeof functions.getReserve>
export type GetReserveReturn = FunctionReturn<typeof functions.getReserve>

export type GetReserveConfigParams = FunctionArguments<typeof functions.getReserveConfig>
export type GetReserveConfigReturn = FunctionReturn<typeof functions.getReserveConfig>

export type GetReserveCountParams = FunctionArguments<typeof functions.getReserveCount>
export type GetReserveCountReturn = FunctionReturn<typeof functions.getReserveCount>

export type GetReserveDebtParams = FunctionArguments<typeof functions.getReserveDebt>
export type GetReserveDebtReturn = FunctionReturn<typeof functions.getReserveDebt>

export type GetReserveIdParams = FunctionArguments<typeof functions.getReserveId>
export type GetReserveIdReturn = FunctionReturn<typeof functions.getReserveId>

export type GetReserveSuppliedAssetsParams = FunctionArguments<typeof functions.getReserveSuppliedAssets>
export type GetReserveSuppliedAssetsReturn = FunctionReturn<typeof functions.getReserveSuppliedAssets>

export type GetReserveSuppliedSharesParams = FunctionArguments<typeof functions.getReserveSuppliedShares>
export type GetReserveSuppliedSharesReturn = FunctionReturn<typeof functions.getReserveSuppliedShares>

export type GetReserveTotalDebtParams = FunctionArguments<typeof functions.getReserveTotalDebt>
export type GetReserveTotalDebtReturn = FunctionReturn<typeof functions.getReserveTotalDebt>

export type GetUserAccountDataParams = FunctionArguments<typeof functions.getUserAccountData>
export type GetUserAccountDataReturn = FunctionReturn<typeof functions.getUserAccountData>

export type GetUserDebtParams = FunctionArguments<typeof functions.getUserDebt>
export type GetUserDebtReturn = FunctionReturn<typeof functions.getUserDebt>

export type GetUserLastRiskPremiumParams = FunctionArguments<typeof functions.getUserLastRiskPremium>
export type GetUserLastRiskPremiumReturn = FunctionReturn<typeof functions.getUserLastRiskPremium>

export type GetUserPositionParams = FunctionArguments<typeof functions.getUserPosition>
export type GetUserPositionReturn = FunctionReturn<typeof functions.getUserPosition>

export type GetUserPremiumDebtRayParams = FunctionArguments<typeof functions.getUserPremiumDebtRay>
export type GetUserPremiumDebtRayReturn = FunctionReturn<typeof functions.getUserPremiumDebtRay>

export type GetUserReserveStatusParams = FunctionArguments<typeof functions.getUserReserveStatus>
export type GetUserReserveStatusReturn = FunctionReturn<typeof functions.getUserReserveStatus>

export type GetUserSuppliedAssetsParams = FunctionArguments<typeof functions.getUserSuppliedAssets>
export type GetUserSuppliedAssetsReturn = FunctionReturn<typeof functions.getUserSuppliedAssets>

export type GetUserSuppliedSharesParams = FunctionArguments<typeof functions.getUserSuppliedShares>
export type GetUserSuppliedSharesReturn = FunctionReturn<typeof functions.getUserSuppliedShares>

export type GetUserTotalDebtParams = FunctionArguments<typeof functions.getUserTotalDebt>
export type GetUserTotalDebtReturn = FunctionReturn<typeof functions.getUserTotalDebt>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsConsumingScheduledOpParams = FunctionArguments<typeof functions.isConsumingScheduledOp>
export type IsConsumingScheduledOpReturn = FunctionReturn<typeof functions.isConsumingScheduledOp>

export type IsPositionManagerParams = FunctionArguments<typeof functions.isPositionManager>
export type IsPositionManagerReturn = FunctionReturn<typeof functions.isPositionManager>

export type IsPositionManagerActiveParams = FunctionArguments<typeof functions.isPositionManagerActive>
export type IsPositionManagerActiveReturn = FunctionReturn<typeof functions.isPositionManagerActive>

export type LiquidationCallParams = FunctionArguments<typeof functions.liquidationCall>
export type LiquidationCallReturn = FunctionReturn<typeof functions.liquidationCall>

export type MulticallParams = FunctionArguments<typeof functions.multicall>
export type MulticallReturn = FunctionReturn<typeof functions.multicall>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type PermitReserveParams = FunctionArguments<typeof functions.permitReserve>
export type PermitReserveReturn = FunctionReturn<typeof functions.permitReserve>

export type RenouncePositionManagerRoleParams = FunctionArguments<typeof functions.renouncePositionManagerRole>
export type RenouncePositionManagerRoleReturn = FunctionReturn<typeof functions.renouncePositionManagerRole>

export type RepayParams = FunctionArguments<typeof functions.repay>
export type RepayReturn = FunctionReturn<typeof functions.repay>

export type SetAuthorityParams = FunctionArguments<typeof functions.setAuthority>
export type SetAuthorityReturn = FunctionReturn<typeof functions.setAuthority>

export type SetUserPositionManagerParams = FunctionArguments<typeof functions.setUserPositionManager>
export type SetUserPositionManagerReturn = FunctionReturn<typeof functions.setUserPositionManager>

export type SetUserPositionManagersWithSigParams = FunctionArguments<typeof functions.setUserPositionManagersWithSig>
export type SetUserPositionManagersWithSigReturn = FunctionReturn<typeof functions.setUserPositionManagersWithSig>

export type SetUsingAsCollateralParams = FunctionArguments<typeof functions.setUsingAsCollateral>
export type SetUsingAsCollateralReturn = FunctionReturn<typeof functions.setUsingAsCollateral>

export type SupplyParams = FunctionArguments<typeof functions.supply>
export type SupplyReturn = FunctionReturn<typeof functions.supply>

export type UpdateDynamicReserveConfigParams = FunctionArguments<typeof functions.updateDynamicReserveConfig>
export type UpdateDynamicReserveConfigReturn = FunctionReturn<typeof functions.updateDynamicReserveConfig>

export type UpdateLiquidationConfigParams = FunctionArguments<typeof functions.updateLiquidationConfig>
export type UpdateLiquidationConfigReturn = FunctionReturn<typeof functions.updateLiquidationConfig>

export type UpdatePositionManagerParams = FunctionArguments<typeof functions.updatePositionManager>
export type UpdatePositionManagerReturn = FunctionReturn<typeof functions.updatePositionManager>

export type UpdateReserveConfigParams = FunctionArguments<typeof functions.updateReserveConfig>
export type UpdateReserveConfigReturn = FunctionReturn<typeof functions.updateReserveConfig>

export type UpdateReservePriceSourceParams = FunctionArguments<typeof functions.updateReservePriceSource>
export type UpdateReservePriceSourceReturn = FunctionReturn<typeof functions.updateReservePriceSource>

export type UpdateUserDynamicConfigParams = FunctionArguments<typeof functions.updateUserDynamicConfig>
export type UpdateUserDynamicConfigReturn = FunctionReturn<typeof functions.updateUserDynamicConfig>

export type UpdateUserRiskPremiumParams = FunctionArguments<typeof functions.updateUserRiskPremium>
export type UpdateUserRiskPremiumReturn = FunctionReturn<typeof functions.updateUserRiskPremium>

export type UseNonceParams = FunctionArguments<typeof functions.useNonce>
export type UseNonceReturn = FunctionReturn<typeof functions.useNonce>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

