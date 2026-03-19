import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccrueInterest: event("0x9d9bd501d0657d7dfe415f779a620a62b78bc508ddc0891fbbd8b7ac0f8fce87", "AccrueInterest(bytes32,uint256,uint256,uint256)", {"id": indexed(p.bytes32), "prevBorrowRate": p.uint256, "interest": p.uint256, "feeShares": p.uint256}),
    AddLiquidationWhitelist: event("0x8c16c1b380f1ee4f48cffce541cb2a31322e35491b5c18fbb4e01e1c048c9d4f", "AddLiquidationWhitelist(bytes32,address)", {"id": indexed(p.bytes32), "account": indexed(p.address)}),
    AddProvider: event("0x618a463b3fb7f87438225fc638bb7c845a91f0d5acb6dcdf130ab42602a9cd3a", "AddProvider(bytes32,address,address)", {"id": p.bytes32, "token": p.address, "provider": p.address}),
    AddWhiteList: event("0x502fdcc5a5194ac94b5d7933962827d32baa2cb041816c5af824b2b378434d27", "AddWhiteList(bytes32,address)", {"id": indexed(p.bytes32), "account": indexed(p.address)}),
    Borrow: event("0x570954540bed6b1304a87dfe815a5eda4a648f7097a16240dcd85c9b5fd42a43", "Borrow(bytes32,address,address,address,uint256,uint256)", {"id": indexed(p.bytes32), "caller": p.address, "onBehalf": indexed(p.address), "receiver": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    CreateMarket: event("0xac4b2400f169220b0c0afdde7a0b32e775ba727ea1cb30b35f935cdaab8683ac", "CreateMarket(bytes32,(address,address,address,address,uint256))", {"id": indexed(p.bytes32), "marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256})}),
    EnableIrm: event("0x590e04cdebeccba40f566186b9746ad295a4cd358ea4fefaaea6ce79630d96c0", "EnableIrm(address)", {"irm": indexed(p.address)}),
    EnableLltv: event("0x297b80e7a896fad470c630f6575072d609bde997260ff3db851939405ec29139", "EnableLltv(uint256)", {"lltv": p.uint256}),
    FlashLoan: event("0xc76f1b4fe4396ac07a9fa55a415d4ca430e72651d37d3401f3bed7cb13fc4f12", "FlashLoan(address,address,uint256)", {"caller": indexed(p.address), "token": indexed(p.address), "assets": p.uint256}),
    IncrementNonce: event("0xa58af1a0c70dba0c7aa60d1a1a147ebd61000d1690a968828ac718bca927f2c7", "IncrementNonce(address,address,uint256)", {"caller": indexed(p.address), "authorizer": indexed(p.address), "usedNonce": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    Liquidate: event("0xa4946ede45d0c6f06a0f5ce92c9ad3b4751452d2fe0e25010783bcab57a67e41", "Liquidate(bytes32,address,address,uint256,uint256,uint256,uint256,uint256)", {"id": indexed(p.bytes32), "caller": indexed(p.address), "borrower": indexed(p.address), "repaidAssets": p.uint256, "repaidShares": p.uint256, "seizedAssets": p.uint256, "badDebtAssets": p.uint256, "badDebtShares": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    RemoveLiquidationWhitelist: event("0x7da4876a6261512daeda3787842e1c79aa5a4a08d24885232df66de269b2ba9b", "RemoveLiquidationWhitelist(bytes32,address)", {"id": indexed(p.bytes32), "account": indexed(p.address)}),
    RemoveProvider: event("0x947f6c8867611e8a0d1b077012313862254b705d036b946b69ea602ebea3ed52", "RemoveProvider(bytes32,address,address)", {"id": p.bytes32, "token": p.address, "provider": p.address}),
    RemoveWhiteList: event("0x00611819c8a8f672425f1d1e75adbd82e944f9a7ecc5286e2dee456551ec7069", "RemoveWhiteList(bytes32,address)", {"id": indexed(p.bytes32), "account": indexed(p.address)}),
    Repay: event("0x52acb05cebbd3cd39715469f22afbf5a17496295ef3bc9bb5944056c63ccaa09", "Repay(bytes32,address,address,uint256,uint256)", {"id": indexed(p.bytes32), "caller": indexed(p.address), "onBehalf": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    SetAuthorization: event("0xd5e969f01efe921d3f766bdebad25f0a05e3f237311f56482bf132d0326309c0", "SetAuthorization(address,address,address,bool)", {"caller": indexed(p.address), "authorizer": indexed(p.address), "authorized": indexed(p.address), "newIsAuthorized": p.bool}),
    SetDefaultMarketFee: event("0x0e32e30bf106776f9d968623763cd13174ee9fce430d6f2a63dc20d1aaaba160", "SetDefaultMarketFee(uint256)", {"fee": p.uint256}),
    SetFee: event("0x139d6f58e9a127229667c8e3b36e88890a66cfc8ab1024ddc513e189e125b75b", "SetFee(bytes32,uint256)", {"id": indexed(p.bytes32), "newFee": p.uint256}),
    SetFeeRecipient: event("0x2e979f80fe4d43055c584cf4a8467c55875ea36728fc37176c05acd784eb7a73", "SetFeeRecipient(address)", {"newFeeRecipient": indexed(p.address)}),
    SetFlashLoanTokenBlacklist: event("0xbf952d6d04f8e2574f1ec8a6d04da2a270d0e9fd3735bb7dcdb25472153b1ae8", "SetFlashLoanTokenBlacklist(address,bool)", {"token": indexed(p.address), "isBlacklisted": p.bool}),
    SetMarketBroker: event("0x940f83c8b6b893567b5c9801752a42eb34c837bd16bad7d8c8346755dbb66a37", "SetMarketBroker(bytes32,address,bool)", {"id": indexed(p.bytes32), "broker": indexed(p.address), "isAddition": p.bool}),
    SetMinLoanValue: event("0xac8f76827181d17440c15c03795bb054795ef387844bbdfec8bdf227e10bd792", "SetMinLoanValue(uint256)", {"minLoan": p.uint256}),
    SetVaultBlacklist: event("0x9ac1cf1e7272f8cd1a9556f6091b6d4bb0d8a8c08503ffb93474d468fae9a755", "SetVaultBlacklist(address,bool)", {"account": indexed(p.address), "isBlacklisted": p.bool}),
    Supply: event("0xedf8870433c83823eb071d3df1caa8d008f12f6440918c20d75a3602cda30fe0", "Supply(bytes32,address,address,uint256,uint256)", {"id": indexed(p.bytes32), "caller": indexed(p.address), "onBehalf": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    SupplyCollateral: event("0xa3b9472a1399e17e123f3c2e6586c23e504184d504de59cdaa2b375e880c6184", "SupplyCollateral(bytes32,address,address,uint256)", {"id": indexed(p.bytes32), "caller": indexed(p.address), "onBehalf": indexed(p.address), "assets": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    Withdraw: event("0xa56fc0ad5702ec05ce63666221f796fb62437c32db1aa1aa075fc6484cf58fbf", "Withdraw(bytes32,address,address,address,uint256,uint256)", {"id": indexed(p.bytes32), "caller": p.address, "onBehalf": indexed(p.address), "receiver": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    WithdrawCollateral: event("0xe80ebd7cc9223d7382aab2e0d1d6155c65651f83d53c8b9b06901d167e321142", "WithdrawCollateral(bytes32,address,address,address,uint256)", {"id": indexed(p.bytes32), "caller": p.address, "onBehalf": indexed(p.address), "receiver": indexed(p.address), "assets": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    MANAGER: viewFun("0x1b2df850", "MANAGER()", {}, p.bytes32),
    OPERATOR: viewFun("0x983d2737", "OPERATOR()", {}, p.bytes32),
    PAUSER: viewFun("0xd9dc8694", "PAUSER()", {}, p.bytes32),
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    _getPrice: viewFun("0x4b6cfbc3", "_getPrice((address,address,address,address,uint256),address)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "user": p.address}, p.uint256),
    accrueInterest: fun("0x151c1ade", "accrueInterest((address,address,address,address,uint256))", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256})}, ),
    batchToggleLiquidationWhitelist: fun("0x3a746bec", "batchToggleLiquidationWhitelist(bytes32[],address[][],bool)", {"ids": p.array(p.bytes32), "accounts": p.array(p.array(p.address)), "isAddition": p.bool}, ),
    borrow: fun("0x50d8cd4b", "borrow((address,address,address,address,uint256),uint256,uint256,address,address)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "assets": p.uint256, "shares": p.uint256, "onBehalf": p.address, "receiver": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    brokers: viewFun("0x2b9a878a", "brokers(bytes32)", {"_0": p.bytes32}, p.address),
    createMarket: fun("0x8c1358a2", "createMarket((address,address,address,address,uint256))", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256})}, ),
    defaultMarketFee: viewFun("0xaebad6fb", "defaultMarketFee()", {}, p.uint256),
    domainSeparator: viewFun("0xf698da25", "domainSeparator()", {}, p.bytes32),
    enableIrm: fun("0x5a64f51e", "enableIrm(address)", {"irm": p.address}, ),
    enableLltv: fun("0x4d98a93b", "enableLltv(uint256)", {"lltv": p.uint256}, ),
    feeRecipient: viewFun("0x46904840", "feeRecipient()", {}, p.address),
    flashLoan: fun("0xe0232b42", "flashLoan(address,uint256,bytes)", {"token": p.address, "assets": p.uint256, "data": p.bytes}, ),
    flashLoanTokenBlacklist: viewFun("0x02c48ef6", "flashLoanTokenBlacklist(address)", {"_0": p.address}, p.bool),
    getLiquidationWhitelist: viewFun("0x50523f63", "getLiquidationWhitelist(bytes32)", {"id": p.bytes32}, p.array(p.address)),
    getPrice: viewFun("0x15a45656", "getPrice((address,address,address,address,uint256))", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256})}, p.uint256),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    getRoleMember: viewFun("0x9010d07c", "getRoleMember(bytes32,uint256)", {"role": p.bytes32, "index": p.uint256}, p.address),
    getRoleMemberCount: viewFun("0xca15c873", "getRoleMemberCount(bytes32)", {"role": p.bytes32}, p.uint256),
    getRoleMembers: viewFun("0xa3246ad3", "getRoleMembers(bytes32)", {"role": p.bytes32}, p.array(p.address)),
    getWhiteList: viewFun("0xc10f7b39", "getWhiteList(bytes32)", {"id": p.bytes32}, p.array(p.address)),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    idToMarketParams: viewFun("0x2c3c9157", "idToMarketParams(bytes32)", {"_0": p.bytes32}, {"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}),
    initialize: fun("0xcf756fdf", "initialize(address,address,address,uint256)", {"admin": p.address, "manager": p.address, "pauser": p.address, "_minLoanValue": p.uint256}, ),
    isAuthorized: viewFun("0x65e4ad9e", "isAuthorized(address,address)", {"_0": p.address, "_1": p.address}, p.bool),
    isHealthy: viewFun("0x2c2c904f", "isHealthy((address,address,address,address,uint256),bytes32,address)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "id": p.bytes32, "borrower": p.address}, p.bool),
    isIrmEnabled: viewFun("0xf2b863ce", "isIrmEnabled(address)", {"_0": p.address}, p.bool),
    isLiquidationWhitelist: viewFun("0x294935d9", "isLiquidationWhitelist(bytes32,address)", {"id": p.bytes32, "account": p.address}, p.bool),
    isLltvEnabled: viewFun("0xb485f3b8", "isLltvEnabled(uint256)", {"_0": p.uint256}, p.bool),
    isWhiteList: viewFun("0xd657177d", "isWhiteList(bytes32,address)", {"id": p.bytes32, "account": p.address}, p.bool),
    liquidate: fun("0xd8eabcb8", "liquidate((address,address,address,address,uint256),address,uint256,uint256,bytes)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "borrower": p.address, "seizedAssets": p.uint256, "repaidShares": p.uint256, "data": p.bytes}, {"_0": p.uint256, "_1": p.uint256}),
    market: viewFun("0x5c60e39a", "market(bytes32)", {"_0": p.bytes32}, {"totalSupplyAssets": p.uint128, "totalSupplyShares": p.uint128, "totalBorrowAssets": p.uint128, "totalBorrowShares": p.uint128, "lastUpdate": p.uint128, "fee": p.uint128}),
    minLoan: viewFun("0x282b870e", "minLoan((address,address,address,address,uint256))", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256})}, p.uint256),
    minLoanValue: viewFun("0x3d50fde2", "minLoanValue()", {}, p.uint256),
    nonce: viewFun("0x70ae92d2", "nonce(address)", {"_0": p.address}, p.uint256),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    position: viewFun("0x93c52062", "position(bytes32,address)", {"_0": p.bytes32, "_1": p.address}, {"supplyShares": p.uint256, "borrowShares": p.uint128, "collateral": p.uint128}),
    providers: viewFun("0x1e6189b4", "providers(bytes32,address)", {"_0": p.bytes32, "_1": p.address}, p.address),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    repay: fun("0x20b76e81", "repay((address,address,address,address,uint256),uint256,uint256,address,bytes)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "assets": p.uint256, "shares": p.uint256, "onBehalf": p.address, "data": p.bytes}, {"_0": p.uint256, "_1": p.uint256}),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setAuthorization: fun("0xeecea000", "setAuthorization(address,bool)", {"authorized": p.address, "newIsAuthorized": p.bool}, ),
    setAuthorizationWithSig: fun("0x8069218f", "setAuthorizationWithSig((address,address,bool,uint256,uint256),(uint8,bytes32,bytes32))", {"authorization": p.struct({"authorizer": p.address, "authorized": p.address, "isAuthorized": p.bool, "nonce": p.uint256, "deadline": p.uint256}), "signature": p.struct({"v": p.uint8, "r": p.bytes32, "s": p.bytes32})}, ),
    setDefaultMarketFee: fun("0x7a315e77", "setDefaultMarketFee(uint256)", {"newFee": p.uint256}, ),
    setFee: fun("0x2b4f013c", "setFee((address,address,address,address,uint256),uint256)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "newFee": p.uint256}, ),
    setFeeRecipient: fun("0xe74b981b", "setFeeRecipient(address)", {"newFeeRecipient": p.address}, ),
    setFlashLoanTokenBlacklist: fun("0x8d493096", "setFlashLoanTokenBlacklist(address,bool)", {"token": p.address, "isBlacklisted": p.bool}, ),
    setMarketBroker: fun("0x4d7dd360", "setMarketBroker(bytes32,address,bool)", {"id": p.bytes32, "broker": p.address, "isAddition": p.bool}, ),
    setMinLoanValue: fun("0x45b21a55", "setMinLoanValue(uint256)", {"_minLoanValue": p.uint256}, ),
    setProvider: fun("0x26fce440", "setProvider(bytes32,address,bool)", {"id": p.bytes32, "provider": p.address, "isAddition": p.bool}, ),
    setVaultBlacklist: fun("0x3c39cb81", "setVaultBlacklist(address,bool)", {"account": p.address, "isBlacklisted": p.bool}, ),
    setWhiteList: fun("0xfaf50e65", "setWhiteList(bytes32,address,bool)", {"id": p.bytes32, "account": p.address, "isAddition": p.bool}, ),
    supply: fun("0xa99aad89", "supply((address,address,address,address,uint256),uint256,uint256,address,bytes)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "assets": p.uint256, "shares": p.uint256, "onBehalf": p.address, "data": p.bytes}, {"_0": p.uint256, "_1": p.uint256}),
    supplyCollateral: fun("0x238d6579", "supplyCollateral((address,address,address,address,uint256),uint256,address,bytes)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "assets": p.uint256, "onBehalf": p.address, "data": p.bytes}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
    vaultBlacklist: viewFun("0xd09e2692", "vaultBlacklist(address)", {"_0": p.address}, p.bool),
    withdraw: fun("0x5c2bea49", "withdraw((address,address,address,address,uint256),uint256,uint256,address,address)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "assets": p.uint256, "shares": p.uint256, "onBehalf": p.address, "receiver": p.address}, {"_0": p.uint256, "_1": p.uint256}),
    withdrawCollateral: fun("0x8720316d", "withdrawCollateral((address,address,address,address,uint256),uint256,address,address)", {"marketParams": p.struct({"loanToken": p.address, "collateralToken": p.address, "oracle": p.address, "irm": p.address, "lltv": p.uint256}), "assets": p.uint256, "onBehalf": p.address, "receiver": p.address}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    MANAGER() {
        return this.eth_call(functions.MANAGER, {})
    }

    OPERATOR() {
        return this.eth_call(functions.OPERATOR, {})
    }

    PAUSER() {
        return this.eth_call(functions.PAUSER, {})
    }

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    _getPrice(marketParams: _getPriceParams["marketParams"], user: _getPriceParams["user"]) {
        return this.eth_call(functions._getPrice, {marketParams, user})
    }

    brokers(_0: BrokersParams["_0"]) {
        return this.eth_call(functions.brokers, {_0})
    }

    defaultMarketFee() {
        return this.eth_call(functions.defaultMarketFee, {})
    }

    domainSeparator() {
        return this.eth_call(functions.domainSeparator, {})
    }

    feeRecipient() {
        return this.eth_call(functions.feeRecipient, {})
    }

    flashLoanTokenBlacklist(_0: FlashLoanTokenBlacklistParams["_0"]) {
        return this.eth_call(functions.flashLoanTokenBlacklist, {_0})
    }

    getLiquidationWhitelist(id: GetLiquidationWhitelistParams["id"]) {
        return this.eth_call(functions.getLiquidationWhitelist, {id})
    }

    getPrice(marketParams: GetPriceParams["marketParams"]) {
        return this.eth_call(functions.getPrice, {marketParams})
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

    getRoleMembers(role: GetRoleMembersParams["role"]) {
        return this.eth_call(functions.getRoleMembers, {role})
    }

    getWhiteList(id: GetWhiteListParams["id"]) {
        return this.eth_call(functions.getWhiteList, {id})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    idToMarketParams(_0: IdToMarketParamsParams["_0"]) {
        return this.eth_call(functions.idToMarketParams, {_0})
    }

    isAuthorized(_0: IsAuthorizedParams["_0"], _1: IsAuthorizedParams["_1"]) {
        return this.eth_call(functions.isAuthorized, {_0, _1})
    }

    isHealthy(marketParams: IsHealthyParams["marketParams"], id: IsHealthyParams["id"], borrower: IsHealthyParams["borrower"]) {
        return this.eth_call(functions.isHealthy, {marketParams, id, borrower})
    }

    isIrmEnabled(_0: IsIrmEnabledParams["_0"]) {
        return this.eth_call(functions.isIrmEnabled, {_0})
    }

    isLiquidationWhitelist(id: IsLiquidationWhitelistParams["id"], account: IsLiquidationWhitelistParams["account"]) {
        return this.eth_call(functions.isLiquidationWhitelist, {id, account})
    }

    isLltvEnabled(_0: IsLltvEnabledParams["_0"]) {
        return this.eth_call(functions.isLltvEnabled, {_0})
    }

    isWhiteList(id: IsWhiteListParams["id"], account: IsWhiteListParams["account"]) {
        return this.eth_call(functions.isWhiteList, {id, account})
    }

    market(_0: MarketParams["_0"]) {
        return this.eth_call(functions.market, {_0})
    }

    minLoan(marketParams: MinLoanParams["marketParams"]) {
        return this.eth_call(functions.minLoan, {marketParams})
    }

    minLoanValue() {
        return this.eth_call(functions.minLoanValue, {})
    }

    nonce(_0: NonceParams["_0"]) {
        return this.eth_call(functions.nonce, {_0})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    position(_0: PositionParams["_0"], _1: PositionParams["_1"]) {
        return this.eth_call(functions.position, {_0, _1})
    }

    providers(_0: ProvidersParams["_0"], _1: ProvidersParams["_1"]) {
        return this.eth_call(functions.providers, {_0, _1})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    vaultBlacklist(_0: VaultBlacklistParams["_0"]) {
        return this.eth_call(functions.vaultBlacklist, {_0})
    }
}

/// Event types
export type AccrueInterestEventArgs = EParams<typeof events.AccrueInterest>
export type AddLiquidationWhitelistEventArgs = EParams<typeof events.AddLiquidationWhitelist>
export type AddProviderEventArgs = EParams<typeof events.AddProvider>
export type AddWhiteListEventArgs = EParams<typeof events.AddWhiteList>
export type BorrowEventArgs = EParams<typeof events.Borrow>
export type CreateMarketEventArgs = EParams<typeof events.CreateMarket>
export type EnableIrmEventArgs = EParams<typeof events.EnableIrm>
export type EnableLltvEventArgs = EParams<typeof events.EnableLltv>
export type FlashLoanEventArgs = EParams<typeof events.FlashLoan>
export type IncrementNonceEventArgs = EParams<typeof events.IncrementNonce>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LiquidateEventArgs = EParams<typeof events.Liquidate>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RemoveLiquidationWhitelistEventArgs = EParams<typeof events.RemoveLiquidationWhitelist>
export type RemoveProviderEventArgs = EParams<typeof events.RemoveProvider>
export type RemoveWhiteListEventArgs = EParams<typeof events.RemoveWhiteList>
export type RepayEventArgs = EParams<typeof events.Repay>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type SetAuthorizationEventArgs = EParams<typeof events.SetAuthorization>
export type SetDefaultMarketFeeEventArgs = EParams<typeof events.SetDefaultMarketFee>
export type SetFeeEventArgs = EParams<typeof events.SetFee>
export type SetFeeRecipientEventArgs = EParams<typeof events.SetFeeRecipient>
export type SetFlashLoanTokenBlacklistEventArgs = EParams<typeof events.SetFlashLoanTokenBlacklist>
export type SetMarketBrokerEventArgs = EParams<typeof events.SetMarketBroker>
export type SetMinLoanValueEventArgs = EParams<typeof events.SetMinLoanValue>
export type SetVaultBlacklistEventArgs = EParams<typeof events.SetVaultBlacklist>
export type SupplyEventArgs = EParams<typeof events.Supply>
export type SupplyCollateralEventArgs = EParams<typeof events.SupplyCollateral>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>
export type WithdrawCollateralEventArgs = EParams<typeof events.WithdrawCollateral>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type MANAGERParams = FunctionArguments<typeof functions.MANAGER>
export type MANAGERReturn = FunctionReturn<typeof functions.MANAGER>

export type OPERATORParams = FunctionArguments<typeof functions.OPERATOR>
export type OPERATORReturn = FunctionReturn<typeof functions.OPERATOR>

export type PAUSERParams = FunctionArguments<typeof functions.PAUSER>
export type PAUSERReturn = FunctionReturn<typeof functions.PAUSER>

export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type _getPriceParams = FunctionArguments<typeof functions._getPrice>
export type _getPriceReturn = FunctionReturn<typeof functions._getPrice>

export type AccrueInterestParams = FunctionArguments<typeof functions.accrueInterest>
export type AccrueInterestReturn = FunctionReturn<typeof functions.accrueInterest>

export type BatchToggleLiquidationWhitelistParams = FunctionArguments<typeof functions.batchToggleLiquidationWhitelist>
export type BatchToggleLiquidationWhitelistReturn = FunctionReturn<typeof functions.batchToggleLiquidationWhitelist>

export type BorrowParams = FunctionArguments<typeof functions.borrow>
export type BorrowReturn = FunctionReturn<typeof functions.borrow>

export type BrokersParams = FunctionArguments<typeof functions.brokers>
export type BrokersReturn = FunctionReturn<typeof functions.brokers>

export type CreateMarketParams = FunctionArguments<typeof functions.createMarket>
export type CreateMarketReturn = FunctionReturn<typeof functions.createMarket>

export type DefaultMarketFeeParams = FunctionArguments<typeof functions.defaultMarketFee>
export type DefaultMarketFeeReturn = FunctionReturn<typeof functions.defaultMarketFee>

export type DomainSeparatorParams = FunctionArguments<typeof functions.domainSeparator>
export type DomainSeparatorReturn = FunctionReturn<typeof functions.domainSeparator>

export type EnableIrmParams = FunctionArguments<typeof functions.enableIrm>
export type EnableIrmReturn = FunctionReturn<typeof functions.enableIrm>

export type EnableLltvParams = FunctionArguments<typeof functions.enableLltv>
export type EnableLltvReturn = FunctionReturn<typeof functions.enableLltv>

export type FeeRecipientParams = FunctionArguments<typeof functions.feeRecipient>
export type FeeRecipientReturn = FunctionReturn<typeof functions.feeRecipient>

export type FlashLoanParams = FunctionArguments<typeof functions.flashLoan>
export type FlashLoanReturn = FunctionReturn<typeof functions.flashLoan>

export type FlashLoanTokenBlacklistParams = FunctionArguments<typeof functions.flashLoanTokenBlacklist>
export type FlashLoanTokenBlacklistReturn = FunctionReturn<typeof functions.flashLoanTokenBlacklist>

export type GetLiquidationWhitelistParams = FunctionArguments<typeof functions.getLiquidationWhitelist>
export type GetLiquidationWhitelistReturn = FunctionReturn<typeof functions.getLiquidationWhitelist>

export type GetPriceParams = FunctionArguments<typeof functions.getPrice>
export type GetPriceReturn = FunctionReturn<typeof functions.getPrice>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetRoleMemberParams = FunctionArguments<typeof functions.getRoleMember>
export type GetRoleMemberReturn = FunctionReturn<typeof functions.getRoleMember>

export type GetRoleMemberCountParams = FunctionArguments<typeof functions.getRoleMemberCount>
export type GetRoleMemberCountReturn = FunctionReturn<typeof functions.getRoleMemberCount>

export type GetRoleMembersParams = FunctionArguments<typeof functions.getRoleMembers>
export type GetRoleMembersReturn = FunctionReturn<typeof functions.getRoleMembers>

export type GetWhiteListParams = FunctionArguments<typeof functions.getWhiteList>
export type GetWhiteListReturn = FunctionReturn<typeof functions.getWhiteList>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type IdToMarketParamsParams = FunctionArguments<typeof functions.idToMarketParams>
export type IdToMarketParamsReturn = FunctionReturn<typeof functions.idToMarketParams>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsAuthorizedParams = FunctionArguments<typeof functions.isAuthorized>
export type IsAuthorizedReturn = FunctionReturn<typeof functions.isAuthorized>

export type IsHealthyParams = FunctionArguments<typeof functions.isHealthy>
export type IsHealthyReturn = FunctionReturn<typeof functions.isHealthy>

export type IsIrmEnabledParams = FunctionArguments<typeof functions.isIrmEnabled>
export type IsIrmEnabledReturn = FunctionReturn<typeof functions.isIrmEnabled>

export type IsLiquidationWhitelistParams = FunctionArguments<typeof functions.isLiquidationWhitelist>
export type IsLiquidationWhitelistReturn = FunctionReturn<typeof functions.isLiquidationWhitelist>

export type IsLltvEnabledParams = FunctionArguments<typeof functions.isLltvEnabled>
export type IsLltvEnabledReturn = FunctionReturn<typeof functions.isLltvEnabled>

export type IsWhiteListParams = FunctionArguments<typeof functions.isWhiteList>
export type IsWhiteListReturn = FunctionReturn<typeof functions.isWhiteList>

export type LiquidateParams = FunctionArguments<typeof functions.liquidate>
export type LiquidateReturn = FunctionReturn<typeof functions.liquidate>

export type MarketParams = FunctionArguments<typeof functions.market>
export type MarketReturn = FunctionReturn<typeof functions.market>

export type MinLoanParams = FunctionArguments<typeof functions.minLoan>
export type MinLoanReturn = FunctionReturn<typeof functions.minLoan>

export type MinLoanValueParams = FunctionArguments<typeof functions.minLoanValue>
export type MinLoanValueReturn = FunctionReturn<typeof functions.minLoanValue>

export type NonceParams = FunctionArguments<typeof functions.nonce>
export type NonceReturn = FunctionReturn<typeof functions.nonce>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PositionParams = FunctionArguments<typeof functions.position>
export type PositionReturn = FunctionReturn<typeof functions.position>

export type ProvidersParams = FunctionArguments<typeof functions.providers>
export type ProvidersReturn = FunctionReturn<typeof functions.providers>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RepayParams = FunctionArguments<typeof functions.repay>
export type RepayReturn = FunctionReturn<typeof functions.repay>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetAuthorizationParams = FunctionArguments<typeof functions.setAuthorization>
export type SetAuthorizationReturn = FunctionReturn<typeof functions.setAuthorization>

export type SetAuthorizationWithSigParams = FunctionArguments<typeof functions.setAuthorizationWithSig>
export type SetAuthorizationWithSigReturn = FunctionReturn<typeof functions.setAuthorizationWithSig>

export type SetDefaultMarketFeeParams = FunctionArguments<typeof functions.setDefaultMarketFee>
export type SetDefaultMarketFeeReturn = FunctionReturn<typeof functions.setDefaultMarketFee>

export type SetFeeParams = FunctionArguments<typeof functions.setFee>
export type SetFeeReturn = FunctionReturn<typeof functions.setFee>

export type SetFeeRecipientParams = FunctionArguments<typeof functions.setFeeRecipient>
export type SetFeeRecipientReturn = FunctionReturn<typeof functions.setFeeRecipient>

export type SetFlashLoanTokenBlacklistParams = FunctionArguments<typeof functions.setFlashLoanTokenBlacklist>
export type SetFlashLoanTokenBlacklistReturn = FunctionReturn<typeof functions.setFlashLoanTokenBlacklist>

export type SetMarketBrokerParams = FunctionArguments<typeof functions.setMarketBroker>
export type SetMarketBrokerReturn = FunctionReturn<typeof functions.setMarketBroker>

export type SetMinLoanValueParams = FunctionArguments<typeof functions.setMinLoanValue>
export type SetMinLoanValueReturn = FunctionReturn<typeof functions.setMinLoanValue>

export type SetProviderParams = FunctionArguments<typeof functions.setProvider>
export type SetProviderReturn = FunctionReturn<typeof functions.setProvider>

export type SetVaultBlacklistParams = FunctionArguments<typeof functions.setVaultBlacklist>
export type SetVaultBlacklistReturn = FunctionReturn<typeof functions.setVaultBlacklist>

export type SetWhiteListParams = FunctionArguments<typeof functions.setWhiteList>
export type SetWhiteListReturn = FunctionReturn<typeof functions.setWhiteList>

export type SupplyParams = FunctionArguments<typeof functions.supply>
export type SupplyReturn = FunctionReturn<typeof functions.supply>

export type SupplyCollateralParams = FunctionArguments<typeof functions.supplyCollateral>
export type SupplyCollateralReturn = FunctionReturn<typeof functions.supplyCollateral>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type VaultBlacklistParams = FunctionArguments<typeof functions.vaultBlacklist>
export type VaultBlacklistReturn = FunctionReturn<typeof functions.vaultBlacklist>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawCollateralParams = FunctionArguments<typeof functions.withdrawCollateral>
export type WithdrawCollateralReturn = FunctionReturn<typeof functions.withdrawCollateral>

