import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Add: event("0xb233dd05ed21346e144167b35a6213bcf04768dbdffdc8339e8b027b94b9f305", "Add(uint256,address,uint256,uint256)", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "shares": p.uint256, "amount": p.uint256}),
    AddAsset: event("0x92fb402b777f3710166f15b30098f41042b439850df67d0195196d125458e7b3", "AddAsset(uint256,address,uint8)", {"assetId": indexed(p.uint256), "underlying": indexed(p.address), "decimals": p.uint8}),
    AddSpoke: event("0x47acdb603dbca71028fbd9b37192e17a62e64fa160e2e607eef3853b792ea5ab", "AddSpoke(uint256,address)", {"assetId": indexed(p.uint256), "spoke": indexed(p.address)}),
    AuthorityUpdated: event("0x2f658b440c35314f52658ea8a740e05b284cdc84dc9ae01e891f21b8933e7cad", "AuthorityUpdated(address)", {"authority": p.address}),
    Draw: event("0xe2497bc41b1fa7c4ba996f24dc2affdffb2a5571584db6db0eed8fbbf1dc8517", "Draw(uint256,address,uint256,uint256)", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "drawnShares": p.uint256, "drawnAmount": p.uint256}),
    EliminateDeficit: event("0xe97b8576ac531cdc817b933309d0518ca3d26c6b46d490f3ae9fa39426a141ee", "EliminateDeficit(uint256,address,address,uint256,uint256)", {"assetId": indexed(p.uint256), "callerSpoke": indexed(p.address), "coveredSpoke": indexed(p.address), "shares": p.uint256, "deficitAmountRay": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    MintFeeShares: event("0xafd21228e21de4a3f779e1cc3617e12672c3da091dcf3812a931036aa0bf633c", "MintFeeShares(uint256,address,uint256,uint256)", {"assetId": indexed(p.uint256), "feeReceiver": indexed(p.address), "shares": p.uint256, "assets": p.uint256}),
    Reclaim: event("0x566111831db1f090374baff3c3f9fc512084f5a9b8f5b199fb475d9c43a8013f", "Reclaim(uint256,address,uint256)", {"assetId": indexed(p.uint256), "reinvestmentController": indexed(p.address), "amount": p.uint256}),
    RefreshPremium: event("0x3fa96ecf17429fddfbb919a64196f4e43f71b57f0c5c38c49a21c8e1e763d18c", "RefreshPremium(uint256,address,(int256,int256,uint256))", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}),
    Remove: event("0x535be2ff85ab4c5d0991e10dc057a4951ea2bac426ffb036eded23036a3942b2", "Remove(uint256,address,uint256,uint256)", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "shares": p.uint256, "amount": p.uint256}),
    ReportDeficit: event("0x4845ee5c72bde2b62defc8a1ca2f0fc3313b2d9e799997ce4f6776da9773bcbf", "ReportDeficit(uint256,address,uint256,(int256,int256,uint256),uint256)", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "drawnShares": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256}), "deficitAmountRay": p.uint256}),
    Restore: event("0x119e7f996dc987b3ae79eb3735f1620c4292f6a7761a1e0f834c445f7798b912", "Restore(uint256,address,uint256,(int256,int256,uint256),uint256,uint256)", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "drawnShares": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256}), "drawnAmount": p.uint256, "premiumAmount": p.uint256}),
    Sweep: event("0x69bb3893073d7a893f3933f3871309fc25acfc72e365b71f554d439a85b20e8b", "Sweep(uint256,address,uint256)", {"assetId": indexed(p.uint256), "reinvestmentController": indexed(p.address), "amount": p.uint256}),
    TransferShares: event("0x0d93b0e8579bc9db73c85a1fb79d785ffc47f8e20d346253f809cc98c48292a0", "TransferShares(uint256,address,address,uint256)", {"assetId": indexed(p.uint256), "sender": indexed(p.address), "receiver": indexed(p.address), "shares": p.uint256}),
    UpdateAsset: event("0xa1facf110ded5028ee267fa3d5986f2aa4dc14230b79ffd27e95760f14883350", "UpdateAsset(uint256,uint256,uint256,uint256)", {"assetId": indexed(p.uint256), "drawnIndex": p.uint256, "drawnRate": p.uint256, "accruedFees": p.uint256}),
    UpdateAssetConfig: event("0xea358cc423f2a5739a0914913452665f0a41d404780bfe9038844d2980e5b974", "UpdateAssetConfig(uint256,(address,uint16,address,address))", {"assetId": indexed(p.uint256), "config": p.struct({"feeReceiver": p.address, "liquidityFee": p.uint16, "irStrategy": p.address, "reinvestmentController": p.address})}),
    UpdateSpokeConfig: event("0x90984699e37aaae5f79c2f33e480f273509662005a8ff82a17b325eb7072454e", "UpdateSpokeConfig(uint256,address,(uint40,uint40,uint24,bool,bool))", {"assetId": indexed(p.uint256), "spoke": indexed(p.address), "config": p.struct({"addCap": p.uint40, "drawCap": p.uint40, "riskPremiumThreshold": p.uint24, "active": p.bool, "halted": p.bool})}),
}

export const functions = {
    HUB_REVISION: viewFun("0xb33454e5", "HUB_REVISION()", {}, p.uint64),
    MAX_ALLOWED_SPOKE_CAP: viewFun("0xa0b3d9d8", "MAX_ALLOWED_SPOKE_CAP()", {}, p.uint40),
    MAX_ALLOWED_UNDERLYING_DECIMALS: viewFun("0xf8998605", "MAX_ALLOWED_UNDERLYING_DECIMALS()", {}, p.uint8),
    MAX_RISK_PREMIUM_THRESHOLD: viewFun("0x33697066", "MAX_RISK_PREMIUM_THRESHOLD()", {}, p.uint24),
    MIN_ALLOWED_UNDERLYING_DECIMALS: viewFun("0xf91ebd52", "MIN_ALLOWED_UNDERLYING_DECIMALS()", {}, p.uint8),
    add: fun("0x771602f7", "add(uint256,uint256)", {"assetId": p.uint256, "amount": p.uint256}, p.uint256),
    addAsset: fun("0x1e83287e", "addAsset(address,uint8,address,address,bytes)", {"underlying": p.address, "decimals": p.uint8, "feeReceiver": p.address, "irStrategy": p.address, "irData": p.bytes}, p.uint256),
    addSpoke: fun("0xc25d82fe", "addSpoke(uint256,address,(uint40,uint40,uint24,bool,bool))", {"assetId": p.uint256, "spoke": p.address, "config": p.struct({"addCap": p.uint40, "drawCap": p.uint40, "riskPremiumThreshold": p.uint24, "active": p.bool, "halted": p.bool})}, ),
    authority: viewFun("0xbf7e214f", "authority()", {}, p.address),
    draw: fun("0xa436458d", "draw(uint256,uint256,address)", {"assetId": p.uint256, "amount": p.uint256, "to": p.address}, p.uint256),
    eliminateDeficit: fun("0xbe105280", "eliminateDeficit(uint256,uint256,address)", {"assetId": p.uint256, "amount": p.uint256, "spoke": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    getAddedAssets: viewFun("0x24ba667f", "getAddedAssets(uint256)", {"assetId": p.uint256}, p.uint256),
    getAddedShares: viewFun("0xb0745f2b", "getAddedShares(uint256)", {"assetId": p.uint256}, p.uint256),
    getAsset: viewFun("0xeac8f5b8", "getAsset(uint256)", {"assetId": p.uint256}, p.struct({"liquidity": p.uint120, "realizedFees": p.uint120, "decimals": p.uint8, "addedShares": p.uint120, "swept": p.uint120, "premiumOffsetRay": p.int200, "drawnShares": p.uint120, "premiumShares": p.uint120, "liquidityFee": p.uint16, "drawnIndex": p.uint120, "drawnRate": p.uint96, "lastUpdateTimestamp": p.uint40, "underlying": p.address, "irStrategy": p.address, "reinvestmentController": p.address, "feeReceiver": p.address, "deficitRay": p.uint200})),
    getAssetAccruedFees: viewFun("0xf51f1a35", "getAssetAccruedFees(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetConfig: viewFun("0xde31ea9f", "getAssetConfig(uint256)", {"assetId": p.uint256}, p.struct({"feeReceiver": p.address, "liquidityFee": p.uint16, "irStrategy": p.address, "reinvestmentController": p.address})),
    getAssetCount: viewFun("0xa0aead4d", "getAssetCount()", {}, p.uint256),
    getAssetDeficitRay: viewFun("0xd5d15a11", "getAssetDeficitRay(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetDrawnIndex: viewFun("0xb5f460c8", "getAssetDrawnIndex(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetDrawnRate: viewFun("0x8accc4a3", "getAssetDrawnRate(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetDrawnShares: viewFun("0x7658c644", "getAssetDrawnShares(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetId: viewFun("0xd6abe642", "getAssetId(address)", {"underlying": p.address}, p.uint256),
    getAssetLiquidity: viewFun("0x9f9b1990", "getAssetLiquidity(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetOwed: viewFun("0x152ee0d3", "getAssetOwed(uint256)", {"assetId": p.uint256}, {"_0": p.uint256, "_1": p.uint256}),
    getAssetPremiumData: viewFun("0x39921637", "getAssetPremiumData(uint256)", {"assetId": p.uint256}, {"_0": p.uint256, "_1": p.int256}),
    getAssetPremiumRay: viewFun("0x403d7778", "getAssetPremiumRay(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetSwept: viewFun("0x41a009eb", "getAssetSwept(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetTotalOwed: viewFun("0x0752c44c", "getAssetTotalOwed(uint256)", {"assetId": p.uint256}, p.uint256),
    getAssetUnderlyingAndDecimals: viewFun("0xde079b57", "getAssetUnderlyingAndDecimals(uint256)", {"assetId": p.uint256}, {"_0": p.address, "_1": p.uint8}),
    getSpoke: viewFun("0xfce56a0b", "getSpoke(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.struct({"drawnShares": p.uint120, "premiumShares": p.uint120, "premiumOffsetRay": p.int200, "addedShares": p.uint120, "addCap": p.uint40, "drawCap": p.uint40, "riskPremiumThreshold": p.uint24, "active": p.bool, "halted": p.bool, "deficitRay": p.uint200})),
    getSpokeAddedAssets: viewFun("0x9c7ee64f", "getSpokeAddedAssets(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.uint256),
    getSpokeAddedShares: viewFun("0xe5c92745", "getSpokeAddedShares(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.uint256),
    getSpokeAddress: viewFun("0x132a8bea", "getSpokeAddress(uint256,uint256)", {"assetId": p.uint256, "index": p.uint256}, p.address),
    getSpokeConfig: viewFun("0xf701f06e", "getSpokeConfig(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.struct({"addCap": p.uint40, "drawCap": p.uint40, "riskPremiumThreshold": p.uint24, "active": p.bool, "halted": p.bool})),
    getSpokeCount: viewFun("0x58a54078", "getSpokeCount(uint256)", {"assetId": p.uint256}, p.uint256),
    getSpokeDeficitRay: viewFun("0x21a3bebc", "getSpokeDeficitRay(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.uint256),
    getSpokeDrawnShares: viewFun("0x5ff1c482", "getSpokeDrawnShares(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.uint256),
    getSpokeOwed: viewFun("0x3c9a9ee5", "getSpokeOwed(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    getSpokePremiumData: viewFun("0xc435e928", "getSpokePremiumData(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, {"_0": p.uint256, "_1": p.int256}),
    getSpokePremiumRay: viewFun("0xd3c6a11d", "getSpokePremiumRay(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.uint256),
    getSpokeTotalOwed: viewFun("0xefdba7c0", "getSpokeTotalOwed(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.uint256),
    initialize: fun("0xc4d66de8", "initialize(address)", {"authority": p.address}, ),
    isConsumingScheduledOp: viewFun("0x8fb36037", "isConsumingScheduledOp()", {}, p.bytes4),
    isSpokeListed: viewFun("0x1901057d", "isSpokeListed(uint256,address)", {"assetId": p.uint256, "spoke": p.address}, p.bool),
    isUnderlyingListed: viewFun("0x0c90e7fe", "isUnderlyingListed(address)", {"underlying": p.address}, p.bool),
    mintFeeShares: fun("0x033a0695", "mintFeeShares(uint256)", {"assetId": p.uint256}, p.uint256),
    payFeeShares: fun("0x83e4bcb7", "payFeeShares(uint256,uint256)", {"assetId": p.uint256, "shares": p.uint256}, ),
    previewAddByAssets: viewFun("0xceb233b3", "previewAddByAssets(uint256,uint256)", {"assetId": p.uint256, "assets": p.uint256}, p.uint256),
    previewAddByShares: viewFun("0x80c099f4", "previewAddByShares(uint256,uint256)", {"assetId": p.uint256, "shares": p.uint256}, p.uint256),
    previewDrawByAssets: viewFun("0x228e731f", "previewDrawByAssets(uint256,uint256)", {"assetId": p.uint256, "assets": p.uint256}, p.uint256),
    previewDrawByShares: viewFun("0x3a445c4e", "previewDrawByShares(uint256,uint256)", {"assetId": p.uint256, "shares": p.uint256}, p.uint256),
    previewRemoveByAssets: viewFun("0xf8447aaf", "previewRemoveByAssets(uint256,uint256)", {"assetId": p.uint256, "assets": p.uint256}, p.uint256),
    previewRemoveByShares: viewFun("0xc04d164e", "previewRemoveByShares(uint256,uint256)", {"assetId": p.uint256, "shares": p.uint256}, p.uint256),
    previewRestoreByAssets: viewFun("0xaab9eb07", "previewRestoreByAssets(uint256,uint256)", {"assetId": p.uint256, "assets": p.uint256}, p.uint256),
    previewRestoreByShares: viewFun("0x5e39616d", "previewRestoreByShares(uint256,uint256)", {"assetId": p.uint256, "shares": p.uint256}, p.uint256),
    reclaim: fun("0x7333a3b4", "reclaim(uint256,uint256)", {"assetId": p.uint256, "amount": p.uint256}, ),
    refreshPremium: fun("0x341f7dcf", "refreshPremium(uint256,(int256,int256,uint256))", {"assetId": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}, ),
    remove: fun("0xe840427d", "remove(uint256,uint256,address)", {"assetId": p.uint256, "amount": p.uint256, "to": p.address}, p.uint256),
    reportDeficit: fun("0xcc0e1c1c", "reportDeficit(uint256,uint256,(int256,int256,uint256))", {"assetId": p.uint256, "drawnAmount": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}, {"_0": p.uint256, "_1": p.uint256}),
    restore: fun("0x2a5b3803", "restore(uint256,uint256,(int256,int256,uint256))", {"assetId": p.uint256, "drawnAmount": p.uint256, "premiumDelta": p.struct({"sharesDelta": p.int256, "offsetRayDelta": p.int256, "restoredPremiumRay": p.uint256})}, p.uint256),
    setAuthority: fun("0x7a9e5e4b", "setAuthority(address)", {"newAuthority": p.address}, ),
    setInterestRateData: fun("0xa467cc59", "setInterestRateData(uint256,bytes)", {"assetId": p.uint256, "irData": p.bytes}, ),
    sweep: fun("0x066dd830", "sweep(uint256,uint256)", {"assetId": p.uint256, "amount": p.uint256}, ),
    transferShares: fun("0x87a7dc77", "transferShares(uint256,uint256,address)", {"assetId": p.uint256, "shares": p.uint256, "toSpoke": p.address}, ),
    updateAssetConfig: fun("0x24e4c1af", "updateAssetConfig(uint256,(address,uint16,address,address),bytes)", {"assetId": p.uint256, "config": p.struct({"feeReceiver": p.address, "liquidityFee": p.uint16, "irStrategy": p.address, "reinvestmentController": p.address}), "irData": p.bytes}, ),
    updateSpokeConfig: fun("0xa2763d29", "updateSpokeConfig(uint256,address,(uint40,uint40,uint24,bool,bool))", {"assetId": p.uint256, "spoke": p.address, "config": p.struct({"addCap": p.uint40, "drawCap": p.uint40, "riskPremiumThreshold": p.uint24, "active": p.bool, "halted": p.bool})}, ),
}

export class Contract extends ContractBase {

    HUB_REVISION() {
        return this.eth_call(functions.HUB_REVISION, {})
    }

    MAX_ALLOWED_SPOKE_CAP() {
        return this.eth_call(functions.MAX_ALLOWED_SPOKE_CAP, {})
    }

    MAX_ALLOWED_UNDERLYING_DECIMALS() {
        return this.eth_call(functions.MAX_ALLOWED_UNDERLYING_DECIMALS, {})
    }

    MAX_RISK_PREMIUM_THRESHOLD() {
        return this.eth_call(functions.MAX_RISK_PREMIUM_THRESHOLD, {})
    }

    MIN_ALLOWED_UNDERLYING_DECIMALS() {
        return this.eth_call(functions.MIN_ALLOWED_UNDERLYING_DECIMALS, {})
    }

    authority() {
        return this.eth_call(functions.authority, {})
    }

    getAddedAssets(assetId: GetAddedAssetsParams["assetId"]) {
        return this.eth_call(functions.getAddedAssets, {assetId})
    }

    getAddedShares(assetId: GetAddedSharesParams["assetId"]) {
        return this.eth_call(functions.getAddedShares, {assetId})
    }

    getAsset(assetId: GetAssetParams["assetId"]) {
        return this.eth_call(functions.getAsset, {assetId})
    }

    getAssetAccruedFees(assetId: GetAssetAccruedFeesParams["assetId"]) {
        return this.eth_call(functions.getAssetAccruedFees, {assetId})
    }

    getAssetConfig(assetId: GetAssetConfigParams["assetId"]) {
        return this.eth_call(functions.getAssetConfig, {assetId})
    }

    getAssetCount() {
        return this.eth_call(functions.getAssetCount, {})
    }

    getAssetDeficitRay(assetId: GetAssetDeficitRayParams["assetId"]) {
        return this.eth_call(functions.getAssetDeficitRay, {assetId})
    }

    getAssetDrawnIndex(assetId: GetAssetDrawnIndexParams["assetId"]) {
        return this.eth_call(functions.getAssetDrawnIndex, {assetId})
    }

    getAssetDrawnRate(assetId: GetAssetDrawnRateParams["assetId"]) {
        return this.eth_call(functions.getAssetDrawnRate, {assetId})
    }

    getAssetDrawnShares(assetId: GetAssetDrawnSharesParams["assetId"]) {
        return this.eth_call(functions.getAssetDrawnShares, {assetId})
    }

    getAssetId(underlying: GetAssetIdParams["underlying"]) {
        return this.eth_call(functions.getAssetId, {underlying})
    }

    getAssetLiquidity(assetId: GetAssetLiquidityParams["assetId"]) {
        return this.eth_call(functions.getAssetLiquidity, {assetId})
    }

    getAssetOwed(assetId: GetAssetOwedParams["assetId"]) {
        return this.eth_call(functions.getAssetOwed, {assetId})
    }

    getAssetPremiumData(assetId: GetAssetPremiumDataParams["assetId"]) {
        return this.eth_call(functions.getAssetPremiumData, {assetId})
    }

    getAssetPremiumRay(assetId: GetAssetPremiumRayParams["assetId"]) {
        return this.eth_call(functions.getAssetPremiumRay, {assetId})
    }

    getAssetSwept(assetId: GetAssetSweptParams["assetId"]) {
        return this.eth_call(functions.getAssetSwept, {assetId})
    }

    getAssetTotalOwed(assetId: GetAssetTotalOwedParams["assetId"]) {
        return this.eth_call(functions.getAssetTotalOwed, {assetId})
    }

    getAssetUnderlyingAndDecimals(assetId: GetAssetUnderlyingAndDecimalsParams["assetId"]) {
        return this.eth_call(functions.getAssetUnderlyingAndDecimals, {assetId})
    }

    getSpoke(assetId: GetSpokeParams["assetId"], spoke: GetSpokeParams["spoke"]) {
        return this.eth_call(functions.getSpoke, {assetId, spoke})
    }

    getSpokeAddedAssets(assetId: GetSpokeAddedAssetsParams["assetId"], spoke: GetSpokeAddedAssetsParams["spoke"]) {
        return this.eth_call(functions.getSpokeAddedAssets, {assetId, spoke})
    }

    getSpokeAddedShares(assetId: GetSpokeAddedSharesParams["assetId"], spoke: GetSpokeAddedSharesParams["spoke"]) {
        return this.eth_call(functions.getSpokeAddedShares, {assetId, spoke})
    }

    getSpokeAddress(assetId: GetSpokeAddressParams["assetId"], index: GetSpokeAddressParams["index"]) {
        return this.eth_call(functions.getSpokeAddress, {assetId, index})
    }

    getSpokeConfig(assetId: GetSpokeConfigParams["assetId"], spoke: GetSpokeConfigParams["spoke"]) {
        return this.eth_call(functions.getSpokeConfig, {assetId, spoke})
    }

    getSpokeCount(assetId: GetSpokeCountParams["assetId"]) {
        return this.eth_call(functions.getSpokeCount, {assetId})
    }

    getSpokeDeficitRay(assetId: GetSpokeDeficitRayParams["assetId"], spoke: GetSpokeDeficitRayParams["spoke"]) {
        return this.eth_call(functions.getSpokeDeficitRay, {assetId, spoke})
    }

    getSpokeDrawnShares(assetId: GetSpokeDrawnSharesParams["assetId"], spoke: GetSpokeDrawnSharesParams["spoke"]) {
        return this.eth_call(functions.getSpokeDrawnShares, {assetId, spoke})
    }

    getSpokeOwed(assetId: GetSpokeOwedParams["assetId"], spoke: GetSpokeOwedParams["spoke"]) {
        return this.eth_call(functions.getSpokeOwed, {assetId, spoke})
    }

    getSpokePremiumData(assetId: GetSpokePremiumDataParams["assetId"], spoke: GetSpokePremiumDataParams["spoke"]) {
        return this.eth_call(functions.getSpokePremiumData, {assetId, spoke})
    }

    getSpokePremiumRay(assetId: GetSpokePremiumRayParams["assetId"], spoke: GetSpokePremiumRayParams["spoke"]) {
        return this.eth_call(functions.getSpokePremiumRay, {assetId, spoke})
    }

    getSpokeTotalOwed(assetId: GetSpokeTotalOwedParams["assetId"], spoke: GetSpokeTotalOwedParams["spoke"]) {
        return this.eth_call(functions.getSpokeTotalOwed, {assetId, spoke})
    }

    isConsumingScheduledOp() {
        return this.eth_call(functions.isConsumingScheduledOp, {})
    }

    isSpokeListed(assetId: IsSpokeListedParams["assetId"], spoke: IsSpokeListedParams["spoke"]) {
        return this.eth_call(functions.isSpokeListed, {assetId, spoke})
    }

    isUnderlyingListed(underlying: IsUnderlyingListedParams["underlying"]) {
        return this.eth_call(functions.isUnderlyingListed, {underlying})
    }

    previewAddByAssets(assetId: PreviewAddByAssetsParams["assetId"], assets: PreviewAddByAssetsParams["assets"]) {
        return this.eth_call(functions.previewAddByAssets, {assetId, assets})
    }

    previewAddByShares(assetId: PreviewAddBySharesParams["assetId"], shares: PreviewAddBySharesParams["shares"]) {
        return this.eth_call(functions.previewAddByShares, {assetId, shares})
    }

    previewDrawByAssets(assetId: PreviewDrawByAssetsParams["assetId"], assets: PreviewDrawByAssetsParams["assets"]) {
        return this.eth_call(functions.previewDrawByAssets, {assetId, assets})
    }

    previewDrawByShares(assetId: PreviewDrawBySharesParams["assetId"], shares: PreviewDrawBySharesParams["shares"]) {
        return this.eth_call(functions.previewDrawByShares, {assetId, shares})
    }

    previewRemoveByAssets(assetId: PreviewRemoveByAssetsParams["assetId"], assets: PreviewRemoveByAssetsParams["assets"]) {
        return this.eth_call(functions.previewRemoveByAssets, {assetId, assets})
    }

    previewRemoveByShares(assetId: PreviewRemoveBySharesParams["assetId"], shares: PreviewRemoveBySharesParams["shares"]) {
        return this.eth_call(functions.previewRemoveByShares, {assetId, shares})
    }

    previewRestoreByAssets(assetId: PreviewRestoreByAssetsParams["assetId"], assets: PreviewRestoreByAssetsParams["assets"]) {
        return this.eth_call(functions.previewRestoreByAssets, {assetId, assets})
    }

    previewRestoreByShares(assetId: PreviewRestoreBySharesParams["assetId"], shares: PreviewRestoreBySharesParams["shares"]) {
        return this.eth_call(functions.previewRestoreByShares, {assetId, shares})
    }
}

/// Event types
export type AddEventArgs = EParams<typeof events.Add>
export type AddAssetEventArgs = EParams<typeof events.AddAsset>
export type AddSpokeEventArgs = EParams<typeof events.AddSpoke>
export type AuthorityUpdatedEventArgs = EParams<typeof events.AuthorityUpdated>
export type DrawEventArgs = EParams<typeof events.Draw>
export type EliminateDeficitEventArgs = EParams<typeof events.EliminateDeficit>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type MintFeeSharesEventArgs = EParams<typeof events.MintFeeShares>
export type ReclaimEventArgs = EParams<typeof events.Reclaim>
export type RefreshPremiumEventArgs = EParams<typeof events.RefreshPremium>
export type RemoveEventArgs = EParams<typeof events.Remove>
export type ReportDeficitEventArgs = EParams<typeof events.ReportDeficit>
export type RestoreEventArgs = EParams<typeof events.Restore>
export type SweepEventArgs = EParams<typeof events.Sweep>
export type TransferSharesEventArgs = EParams<typeof events.TransferShares>
export type UpdateAssetEventArgs = EParams<typeof events.UpdateAsset>
export type UpdateAssetConfigEventArgs = EParams<typeof events.UpdateAssetConfig>
export type UpdateSpokeConfigEventArgs = EParams<typeof events.UpdateSpokeConfig>

/// Function types
export type HUB_REVISIONParams = FunctionArguments<typeof functions.HUB_REVISION>
export type HUB_REVISIONReturn = FunctionReturn<typeof functions.HUB_REVISION>

export type MAX_ALLOWED_SPOKE_CAPParams = FunctionArguments<typeof functions.MAX_ALLOWED_SPOKE_CAP>
export type MAX_ALLOWED_SPOKE_CAPReturn = FunctionReturn<typeof functions.MAX_ALLOWED_SPOKE_CAP>

export type MAX_ALLOWED_UNDERLYING_DECIMALSParams = FunctionArguments<typeof functions.MAX_ALLOWED_UNDERLYING_DECIMALS>
export type MAX_ALLOWED_UNDERLYING_DECIMALSReturn = FunctionReturn<typeof functions.MAX_ALLOWED_UNDERLYING_DECIMALS>

export type MAX_RISK_PREMIUM_THRESHOLDParams = FunctionArguments<typeof functions.MAX_RISK_PREMIUM_THRESHOLD>
export type MAX_RISK_PREMIUM_THRESHOLDReturn = FunctionReturn<typeof functions.MAX_RISK_PREMIUM_THRESHOLD>

export type MIN_ALLOWED_UNDERLYING_DECIMALSParams = FunctionArguments<typeof functions.MIN_ALLOWED_UNDERLYING_DECIMALS>
export type MIN_ALLOWED_UNDERLYING_DECIMALSReturn = FunctionReturn<typeof functions.MIN_ALLOWED_UNDERLYING_DECIMALS>

export type AddParams = FunctionArguments<typeof functions.add>
export type AddReturn = FunctionReturn<typeof functions.add>

export type AddAssetParams = FunctionArguments<typeof functions.addAsset>
export type AddAssetReturn = FunctionReturn<typeof functions.addAsset>

export type AddSpokeParams = FunctionArguments<typeof functions.addSpoke>
export type AddSpokeReturn = FunctionReturn<typeof functions.addSpoke>

export type AuthorityParams = FunctionArguments<typeof functions.authority>
export type AuthorityReturn = FunctionReturn<typeof functions.authority>

export type DrawParams = FunctionArguments<typeof functions.draw>
export type DrawReturn = FunctionReturn<typeof functions.draw>

export type EliminateDeficitParams = FunctionArguments<typeof functions.eliminateDeficit>
export type EliminateDeficitReturn = FunctionReturn<typeof functions.eliminateDeficit>

export type GetAddedAssetsParams = FunctionArguments<typeof functions.getAddedAssets>
export type GetAddedAssetsReturn = FunctionReturn<typeof functions.getAddedAssets>

export type GetAddedSharesParams = FunctionArguments<typeof functions.getAddedShares>
export type GetAddedSharesReturn = FunctionReturn<typeof functions.getAddedShares>

export type GetAssetParams = FunctionArguments<typeof functions.getAsset>
export type GetAssetReturn = FunctionReturn<typeof functions.getAsset>

export type GetAssetAccruedFeesParams = FunctionArguments<typeof functions.getAssetAccruedFees>
export type GetAssetAccruedFeesReturn = FunctionReturn<typeof functions.getAssetAccruedFees>

export type GetAssetConfigParams = FunctionArguments<typeof functions.getAssetConfig>
export type GetAssetConfigReturn = FunctionReturn<typeof functions.getAssetConfig>

export type GetAssetCountParams = FunctionArguments<typeof functions.getAssetCount>
export type GetAssetCountReturn = FunctionReturn<typeof functions.getAssetCount>

export type GetAssetDeficitRayParams = FunctionArguments<typeof functions.getAssetDeficitRay>
export type GetAssetDeficitRayReturn = FunctionReturn<typeof functions.getAssetDeficitRay>

export type GetAssetDrawnIndexParams = FunctionArguments<typeof functions.getAssetDrawnIndex>
export type GetAssetDrawnIndexReturn = FunctionReturn<typeof functions.getAssetDrawnIndex>

export type GetAssetDrawnRateParams = FunctionArguments<typeof functions.getAssetDrawnRate>
export type GetAssetDrawnRateReturn = FunctionReturn<typeof functions.getAssetDrawnRate>

export type GetAssetDrawnSharesParams = FunctionArguments<typeof functions.getAssetDrawnShares>
export type GetAssetDrawnSharesReturn = FunctionReturn<typeof functions.getAssetDrawnShares>

export type GetAssetIdParams = FunctionArguments<typeof functions.getAssetId>
export type GetAssetIdReturn = FunctionReturn<typeof functions.getAssetId>

export type GetAssetLiquidityParams = FunctionArguments<typeof functions.getAssetLiquidity>
export type GetAssetLiquidityReturn = FunctionReturn<typeof functions.getAssetLiquidity>

export type GetAssetOwedParams = FunctionArguments<typeof functions.getAssetOwed>
export type GetAssetOwedReturn = FunctionReturn<typeof functions.getAssetOwed>

export type GetAssetPremiumDataParams = FunctionArguments<typeof functions.getAssetPremiumData>
export type GetAssetPremiumDataReturn = FunctionReturn<typeof functions.getAssetPremiumData>

export type GetAssetPremiumRayParams = FunctionArguments<typeof functions.getAssetPremiumRay>
export type GetAssetPremiumRayReturn = FunctionReturn<typeof functions.getAssetPremiumRay>

export type GetAssetSweptParams = FunctionArguments<typeof functions.getAssetSwept>
export type GetAssetSweptReturn = FunctionReturn<typeof functions.getAssetSwept>

export type GetAssetTotalOwedParams = FunctionArguments<typeof functions.getAssetTotalOwed>
export type GetAssetTotalOwedReturn = FunctionReturn<typeof functions.getAssetTotalOwed>

export type GetAssetUnderlyingAndDecimalsParams = FunctionArguments<typeof functions.getAssetUnderlyingAndDecimals>
export type GetAssetUnderlyingAndDecimalsReturn = FunctionReturn<typeof functions.getAssetUnderlyingAndDecimals>

export type GetSpokeParams = FunctionArguments<typeof functions.getSpoke>
export type GetSpokeReturn = FunctionReturn<typeof functions.getSpoke>

export type GetSpokeAddedAssetsParams = FunctionArguments<typeof functions.getSpokeAddedAssets>
export type GetSpokeAddedAssetsReturn = FunctionReturn<typeof functions.getSpokeAddedAssets>

export type GetSpokeAddedSharesParams = FunctionArguments<typeof functions.getSpokeAddedShares>
export type GetSpokeAddedSharesReturn = FunctionReturn<typeof functions.getSpokeAddedShares>

export type GetSpokeAddressParams = FunctionArguments<typeof functions.getSpokeAddress>
export type GetSpokeAddressReturn = FunctionReturn<typeof functions.getSpokeAddress>

export type GetSpokeConfigParams = FunctionArguments<typeof functions.getSpokeConfig>
export type GetSpokeConfigReturn = FunctionReturn<typeof functions.getSpokeConfig>

export type GetSpokeCountParams = FunctionArguments<typeof functions.getSpokeCount>
export type GetSpokeCountReturn = FunctionReturn<typeof functions.getSpokeCount>

export type GetSpokeDeficitRayParams = FunctionArguments<typeof functions.getSpokeDeficitRay>
export type GetSpokeDeficitRayReturn = FunctionReturn<typeof functions.getSpokeDeficitRay>

export type GetSpokeDrawnSharesParams = FunctionArguments<typeof functions.getSpokeDrawnShares>
export type GetSpokeDrawnSharesReturn = FunctionReturn<typeof functions.getSpokeDrawnShares>

export type GetSpokeOwedParams = FunctionArguments<typeof functions.getSpokeOwed>
export type GetSpokeOwedReturn = FunctionReturn<typeof functions.getSpokeOwed>

export type GetSpokePremiumDataParams = FunctionArguments<typeof functions.getSpokePremiumData>
export type GetSpokePremiumDataReturn = FunctionReturn<typeof functions.getSpokePremiumData>

export type GetSpokePremiumRayParams = FunctionArguments<typeof functions.getSpokePremiumRay>
export type GetSpokePremiumRayReturn = FunctionReturn<typeof functions.getSpokePremiumRay>

export type GetSpokeTotalOwedParams = FunctionArguments<typeof functions.getSpokeTotalOwed>
export type GetSpokeTotalOwedReturn = FunctionReturn<typeof functions.getSpokeTotalOwed>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsConsumingScheduledOpParams = FunctionArguments<typeof functions.isConsumingScheduledOp>
export type IsConsumingScheduledOpReturn = FunctionReturn<typeof functions.isConsumingScheduledOp>

export type IsSpokeListedParams = FunctionArguments<typeof functions.isSpokeListed>
export type IsSpokeListedReturn = FunctionReturn<typeof functions.isSpokeListed>

export type IsUnderlyingListedParams = FunctionArguments<typeof functions.isUnderlyingListed>
export type IsUnderlyingListedReturn = FunctionReturn<typeof functions.isUnderlyingListed>

export type MintFeeSharesParams = FunctionArguments<typeof functions.mintFeeShares>
export type MintFeeSharesReturn = FunctionReturn<typeof functions.mintFeeShares>

export type PayFeeSharesParams = FunctionArguments<typeof functions.payFeeShares>
export type PayFeeSharesReturn = FunctionReturn<typeof functions.payFeeShares>

export type PreviewAddByAssetsParams = FunctionArguments<typeof functions.previewAddByAssets>
export type PreviewAddByAssetsReturn = FunctionReturn<typeof functions.previewAddByAssets>

export type PreviewAddBySharesParams = FunctionArguments<typeof functions.previewAddByShares>
export type PreviewAddBySharesReturn = FunctionReturn<typeof functions.previewAddByShares>

export type PreviewDrawByAssetsParams = FunctionArguments<typeof functions.previewDrawByAssets>
export type PreviewDrawByAssetsReturn = FunctionReturn<typeof functions.previewDrawByAssets>

export type PreviewDrawBySharesParams = FunctionArguments<typeof functions.previewDrawByShares>
export type PreviewDrawBySharesReturn = FunctionReturn<typeof functions.previewDrawByShares>

export type PreviewRemoveByAssetsParams = FunctionArguments<typeof functions.previewRemoveByAssets>
export type PreviewRemoveByAssetsReturn = FunctionReturn<typeof functions.previewRemoveByAssets>

export type PreviewRemoveBySharesParams = FunctionArguments<typeof functions.previewRemoveByShares>
export type PreviewRemoveBySharesReturn = FunctionReturn<typeof functions.previewRemoveByShares>

export type PreviewRestoreByAssetsParams = FunctionArguments<typeof functions.previewRestoreByAssets>
export type PreviewRestoreByAssetsReturn = FunctionReturn<typeof functions.previewRestoreByAssets>

export type PreviewRestoreBySharesParams = FunctionArguments<typeof functions.previewRestoreByShares>
export type PreviewRestoreBySharesReturn = FunctionReturn<typeof functions.previewRestoreByShares>

export type ReclaimParams = FunctionArguments<typeof functions.reclaim>
export type ReclaimReturn = FunctionReturn<typeof functions.reclaim>

export type RefreshPremiumParams = FunctionArguments<typeof functions.refreshPremium>
export type RefreshPremiumReturn = FunctionReturn<typeof functions.refreshPremium>

export type RemoveParams = FunctionArguments<typeof functions.remove>
export type RemoveReturn = FunctionReturn<typeof functions.remove>

export type ReportDeficitParams = FunctionArguments<typeof functions.reportDeficit>
export type ReportDeficitReturn = FunctionReturn<typeof functions.reportDeficit>

export type RestoreParams = FunctionArguments<typeof functions.restore>
export type RestoreReturn = FunctionReturn<typeof functions.restore>

export type SetAuthorityParams = FunctionArguments<typeof functions.setAuthority>
export type SetAuthorityReturn = FunctionReturn<typeof functions.setAuthority>

export type SetInterestRateDataParams = FunctionArguments<typeof functions.setInterestRateData>
export type SetInterestRateDataReturn = FunctionReturn<typeof functions.setInterestRateData>

export type SweepParams = FunctionArguments<typeof functions.sweep>
export type SweepReturn = FunctionReturn<typeof functions.sweep>

export type TransferSharesParams = FunctionArguments<typeof functions.transferShares>
export type TransferSharesReturn = FunctionReturn<typeof functions.transferShares>

export type UpdateAssetConfigParams = FunctionArguments<typeof functions.updateAssetConfig>
export type UpdateAssetConfigReturn = FunctionReturn<typeof functions.updateAssetConfig>

export type UpdateSpokeConfigParams = FunctionArguments<typeof functions.updateSpokeConfig>
export type UpdateSpokeConfigReturn = FunctionReturn<typeof functions.updateSpokeConfig>

