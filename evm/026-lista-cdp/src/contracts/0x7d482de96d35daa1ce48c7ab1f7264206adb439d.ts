import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuctionFinished: event("0x88a732d7774b0799e041c44ae40c27a8616dd75d611a9be3cf1d082c759a0f8e", "AuctionFinished(address,address,uint256)", {"token": indexed(p.address), "keeper": p.address, "amount": p.uint256}),
    AuctionStarted: event("0xa39454816a8e1e974f3d7de0cc0ba57840ba7d4cf111f280726b1f687e91d42b", "AuctionStarted(address,address,uint256,uint256)", {"token": indexed(p.address), "user": p.address, "amount": p.uint256, "price": p.uint256}),
    Borrow: event("0x10a0132d3bf8c82a7fb93a86160f3074ca5c3e5706fa2bcdf0e2b5fd495af09b", "Borrow(address,address,uint256,uint256,uint256)", {"user": indexed(p.address), "collateral": p.address, "collateralAmount": p.uint256, "amount": p.uint256, "liquidationPrice": p.uint256}),
    CollateralDisabled: event("0x9fc793554ab8af2084d6005e4d61d847f73406e2f552476dfb2a0d4987ef4fa0", "CollateralDisabled(address,bytes32)", {"token": p.address, "ilk": p.bytes32}),
    CollateralEnabled: event("0x5d8d8db1d1b082fc4f893dcf587266b61ac1079e3f5e959cd6e76cfe84274f47", "CollateralEnabled(address,bytes32)", {"token": p.address, "ilk": p.bytes32}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"user": indexed(p.address), "collateral": p.address, "amount": p.uint256, "totalAmount": p.uint256}),
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", "Initialized(uint8)", {"version": p.uint8}),
    Liquidation: event("0x4ecae3269f800df64b16cb9f6f8b0b507018888521d1cff0841823e44bc0b00d", "Liquidation(address,address,uint256,uint256)", {"user": indexed(p.address), "collateral": indexed(p.address), "amount": p.uint256, "leftover": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Payback: event("0xee7777293f0d992d01f7d63f6f0e7762ee0df9d22267140e41090174a70e6f72", "Payback(address,address,uint256,uint256,uint256)", {"user": indexed(p.address), "collateral": p.address, "amount": p.uint256, "debt": p.uint256, "liquidationPrice": p.uint256}),
    Withdraw: event("0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364", "Withdraw(address,uint256)", {"user": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    addToAuctionWhitelist: fun("0xf746d8f4", "addToAuctionWhitelist(address[])", {"usrs": p.array(p.address)}, ),
    addToBlacklist: fun("0x935eb35f", "addToBlacklist(address[])", {"tokens": p.array(p.address)}, ),
    addToWhitelist: fun("0x7f649783", "addToWhitelist(address[])", {"usrs": p.array(p.address)}, ),
    auctionWhitelist: viewFun("0x9e068764", "auctionWhitelist(address)", {"_0": p.address}, p.uint256),
    auctionWhitelistMode: viewFun("0x1e9990ff", "auctionWhitelistMode()", {}, p.uint256),
    availableToBorrow: viewFun("0xdc7e91dd", "availableToBorrow(address,address)", {"token": p.address, "usr": p.address}, p.int256),
    borrow: fun("0x4b8a3529", "borrow(address,uint256)", {"token": p.address, "hayAmount": p.uint256}, p.uint256),
    borrowApr: viewFun("0x9fecc37d", "borrowApr(address)", {"token": p.address}, p.uint256),
    borrowLisUSDListaDistributor: viewFun("0xe68d57cf", "borrowLisUSDListaDistributor()", {}, p.address),
    borrowed: viewFun("0xb0a02abe", "borrowed(address,address)", {"token": p.address, "usr": p.address}, p.uint256),
    buyFromAuction: fun("0xe5ff2f8e", "buyFromAuction(address,uint256,uint256,uint256,address,bytes)", {"token": p.address, "auctionId": p.uint256, "collateralAmount": p.uint256, "maxPrice": p.uint256, "receiverAddress": p.address, "data": p.bytes}, ),
    collateralPrice: viewFun("0x08b1cb23", "collateralPrice(address)", {"token": p.address}, p.uint256),
    collateralRate: viewFun("0x72c8fef0", "collateralRate(address)", {"token": p.address}, p.uint256),
    collateralTVL: viewFun("0x4eb3048a", "collateralTVL(address)", {"token": p.address}, p.uint256),
    collaterals: viewFun("0xeeb97d3b", "collaterals(address)", {"_0": p.address}, {"gem": p.address, "ilk": p.bytes32, "live": p.uint32, "clip": p.address}),
    currentLiquidationPrice: viewFun("0xfc085c11", "currentLiquidationPrice(address,address)", {"token": p.address, "usr": p.address}, p.uint256),
    deny: fun("0x9c52a7f1", "deny(address)", {"usr": p.address}, ),
    deposit: fun("0x8340f549", "deposit(address,address,uint256)", {"participant": p.address, "token": p.address, "dink": p.uint256}, p.uint256),
    depositTVL: viewFun("0x89a283b9", "depositTVL(address)", {"token": p.address}, p.uint256),
    deposits: viewFun("0xfc7e286d", "deposits(address)", {"token": p.address}, p.uint256),
    depositsDeprecated: viewFun("0xe57fc302", "depositsDeprecated(address)", {"_0": p.address}, p.uint256),
    disableAuctionWhitelist: fun("0x2ad12d87", "disableAuctionWhitelist()", {}, ),
    disableWhitelist: fun("0xd6b0f484", "disableWhitelist()", {}, ),
    dog: viewFun("0xc3b3ad7f", "dog()", {}, p.address),
    drip: fun("0x67a5cd06", "drip(address)", {"token": p.address}, ),
    dutyCalculator: viewFun("0xebb95c5d", "dutyCalculator()", {}, p.address),
    enableAuctionWhitelist: fun("0x75dd94ec", "enableAuctionWhitelist()", {}, ),
    enableWhitelist: fun("0xcdfb2b4e", "enableWhitelist()", {}, ),
    free: viewFun("0xc5cafb88", "free(address,address)", {"token": p.address, "usr": p.address}, p.uint256),
    getAllActiveAuctionsForToken: viewFun("0x5c49b500", "getAllActiveAuctionsForToken(address)", {"token": p.address}, p.array(p.struct({"pos": p.uint256, "tab": p.uint256, "lot": p.uint256, "usr": p.address, "tic": p.uint96, "top": p.uint256}))),
    getAuctionStatus: viewFun("0xf8a206fa", "getAuctionStatus(address,uint256)", {"token": p.address, "auctionId": p.uint256}, {"_0": p.bool, "_1": p.uint256, "_2": p.uint256, "_3": p.uint256}),
    hay: viewFun("0xb02d1e9e", "hay()", {}, p.address),
    hayJoin: viewFun("0x4d608102", "hayJoin()", {}, p.address),
    hayPrice: viewFun("0xdddca8af", "hayPrice(address)", {"token": p.address}, p.uint256),
    helioProviders: viewFun("0x1ef0bb94", "helioProviders(address)", {"_0": p.address}, p.address),
    helioRewards: viewFun("0xff4e65f3", "helioRewards()", {}, p.address),
    initialize: fun("0xcc2a9a5b", "initialize(address,address,address,address,address,address)", {"vat_": p.address, "spot_": p.address, "hay_": p.address, "hayJoin_": p.address, "jug_": p.address, "dog_": p.address}, ),
    jug: viewFun("0x84718d89", "jug()", {}, p.address),
    locked: viewFun("0xdb20266f", "locked(address,address)", {"token": p.address, "usr": p.address}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    payback: fun("0x35ed8ab8", "payback(address,uint256)", {"token": p.address, "hayAmount": p.uint256}, p.int256),
    paybackFor: fun("0x3b862af1", "paybackFor(address,uint256,address)", {"token": p.address, "hayAmount": p.uint256, "borrower": p.address}, p.int256),
    poke: fun("0xb1a997ac", "poke(address)", {"token": p.address}, ),
    providerCompatibilityMode: viewFun("0xe107f49b", "providerCompatibilityMode(address)", {"_0": p.address}, p.bool),
    rely: fun("0x65fae35e", "rely(address)", {"usr": p.address}, ),
    removeCollateralType: fun("0xcba315bd", "removeCollateralType(address)", {"token": p.address}, ),
    removeFromAuctionWhitelist: fun("0x0d2095ac", "removeFromAuctionWhitelist(address[])", {"usrs": p.array(p.address)}, ),
    removeFromBlacklist: fun("0x89daf799", "removeFromBlacklist(address[])", {"tokens": p.array(p.address)}, ),
    removeFromWhitelist: fun("0x548db174", "removeFromWhitelist(address[])", {"usrs": p.array(p.address)}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    resetAuction: fun("0x07251016", "resetAuction(address,uint256,address)", {"token": p.address, "auctionId": p.uint256, "keeper": p.address}, ),
    setCollateralDuty: fun("0x06fbed54", "setCollateralDuty(address,uint256)", {"token": p.address, "duty": p.uint256}, ),
    setCollateralType: fun("0x2049ad8e", "setCollateralType(address,address,bytes32,address,uint256)", {"token": p.address, "gemJoin": p.address, "ilk": p.bytes32, "clip": p.address, "mat": p.uint256}, ),
    setHelioProvider: fun("0x7b7a4137", "setHelioProvider(address,address,bool)", {"token": p.address, "helioProvider": p.address, "compatibilityMode": p.bool}, ),
    setListaDistributor: fun("0x823a6c79", "setListaDistributor(address)", {"distributor": p.address}, ),
    setWhitelistOperator: fun("0xeddaa0e9", "setWhitelistOperator(address)", {"usr": p.address}, ),
    spotter: viewFun("0x2e77468d", "spotter()", {}, p.address),
    startAuction: fun("0x953790b1", "startAuction(address,address,address)", {"token": p.address, "user": p.address, "keeper": p.address}, p.uint256),
    syncSnapshot: fun("0x0bce4a76", "syncSnapshot(address,address)", {"token": p.address, "user": p.address}, ),
    tokensBlacklist: viewFun("0x293e10ad", "tokensBlacklist(address)", {"_0": p.address}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    vat: viewFun("0x36569e77", "vat()", {}, p.address),
    wards: viewFun("0xbf353dbb", "wards(address)", {"_0": p.address}, p.uint256),
    whitelist: viewFun("0x9b19251a", "whitelist(address)", {"_0": p.address}, p.uint256),
    whitelistMode: viewFun("0x70c757ec", "whitelistMode()", {}, p.uint256),
    whitelistOperator: viewFun("0x44c43782", "whitelistOperator()", {}, p.address),
    willBorrow: viewFun("0xaa592eee", "willBorrow(address,address,int256)", {"token": p.address, "usr": p.address, "amount": p.int256}, p.int256),
    withdraw: fun("0xd9caed12", "withdraw(address,address,uint256)", {"participant": p.address, "token": p.address, "dink": p.uint256}, p.uint256),
}

export class Contract extends ContractBase {

    auctionWhitelist(_0: AuctionWhitelistParams["_0"]) {
        return this.eth_call(functions.auctionWhitelist, {_0})
    }

    auctionWhitelistMode() {
        return this.eth_call(functions.auctionWhitelistMode, {})
    }

    availableToBorrow(token: AvailableToBorrowParams["token"], usr: AvailableToBorrowParams["usr"]) {
        return this.eth_call(functions.availableToBorrow, {token, usr})
    }

    borrowApr(token: BorrowAprParams["token"]) {
        return this.eth_call(functions.borrowApr, {token})
    }

    borrowLisUSDListaDistributor() {
        return this.eth_call(functions.borrowLisUSDListaDistributor, {})
    }

    borrowed(token: BorrowedParams["token"], usr: BorrowedParams["usr"]) {
        return this.eth_call(functions.borrowed, {token, usr})
    }

    collateralPrice(token: CollateralPriceParams["token"]) {
        return this.eth_call(functions.collateralPrice, {token})
    }

    collateralRate(token: CollateralRateParams["token"]) {
        return this.eth_call(functions.collateralRate, {token})
    }

    collateralTVL(token: CollateralTVLParams["token"]) {
        return this.eth_call(functions.collateralTVL, {token})
    }

    collaterals(_0: CollateralsParams["_0"]) {
        return this.eth_call(functions.collaterals, {_0})
    }

    currentLiquidationPrice(token: CurrentLiquidationPriceParams["token"], usr: CurrentLiquidationPriceParams["usr"]) {
        return this.eth_call(functions.currentLiquidationPrice, {token, usr})
    }

    depositTVL(token: DepositTVLParams["token"]) {
        return this.eth_call(functions.depositTVL, {token})
    }

    deposits(token: DepositsParams["token"]) {
        return this.eth_call(functions.deposits, {token})
    }

    depositsDeprecated(_0: DepositsDeprecatedParams["_0"]) {
        return this.eth_call(functions.depositsDeprecated, {_0})
    }

    dog() {
        return this.eth_call(functions.dog, {})
    }

    dutyCalculator() {
        return this.eth_call(functions.dutyCalculator, {})
    }

    free(token: FreeParams["token"], usr: FreeParams["usr"]) {
        return this.eth_call(functions.free, {token, usr})
    }

    getAllActiveAuctionsForToken(token: GetAllActiveAuctionsForTokenParams["token"]) {
        return this.eth_call(functions.getAllActiveAuctionsForToken, {token})
    }

    getAuctionStatus(token: GetAuctionStatusParams["token"], auctionId: GetAuctionStatusParams["auctionId"]) {
        return this.eth_call(functions.getAuctionStatus, {token, auctionId})
    }

    hay() {
        return this.eth_call(functions.hay, {})
    }

    hayJoin() {
        return this.eth_call(functions.hayJoin, {})
    }

    hayPrice(token: HayPriceParams["token"]) {
        return this.eth_call(functions.hayPrice, {token})
    }

    helioProviders(_0: HelioProvidersParams["_0"]) {
        return this.eth_call(functions.helioProviders, {_0})
    }

    helioRewards() {
        return this.eth_call(functions.helioRewards, {})
    }

    jug() {
        return this.eth_call(functions.jug, {})
    }

    locked(token: LockedParams["token"], usr: LockedParams["usr"]) {
        return this.eth_call(functions.locked, {token, usr})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    providerCompatibilityMode(_0: ProviderCompatibilityModeParams["_0"]) {
        return this.eth_call(functions.providerCompatibilityMode, {_0})
    }

    spotter() {
        return this.eth_call(functions.spotter, {})
    }

    tokensBlacklist(_0: TokensBlacklistParams["_0"]) {
        return this.eth_call(functions.tokensBlacklist, {_0})
    }

    vat() {
        return this.eth_call(functions.vat, {})
    }

    wards(_0: WardsParams["_0"]) {
        return this.eth_call(functions.wards, {_0})
    }

    whitelist(_0: WhitelistParams["_0"]) {
        return this.eth_call(functions.whitelist, {_0})
    }

    whitelistMode() {
        return this.eth_call(functions.whitelistMode, {})
    }

    whitelistOperator() {
        return this.eth_call(functions.whitelistOperator, {})
    }

    willBorrow(token: WillBorrowParams["token"], usr: WillBorrowParams["usr"], amount: WillBorrowParams["amount"]) {
        return this.eth_call(functions.willBorrow, {token, usr, amount})
    }
}

/// Event types
export type AuctionFinishedEventArgs = EParams<typeof events.AuctionFinished>
export type AuctionStartedEventArgs = EParams<typeof events.AuctionStarted>
export type BorrowEventArgs = EParams<typeof events.Borrow>
export type CollateralDisabledEventArgs = EParams<typeof events.CollateralDisabled>
export type CollateralEnabledEventArgs = EParams<typeof events.CollateralEnabled>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LiquidationEventArgs = EParams<typeof events.Liquidation>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PaybackEventArgs = EParams<typeof events.Payback>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type AddToAuctionWhitelistParams = FunctionArguments<typeof functions.addToAuctionWhitelist>
export type AddToAuctionWhitelistReturn = FunctionReturn<typeof functions.addToAuctionWhitelist>

export type AddToBlacklistParams = FunctionArguments<typeof functions.addToBlacklist>
export type AddToBlacklistReturn = FunctionReturn<typeof functions.addToBlacklist>

export type AddToWhitelistParams = FunctionArguments<typeof functions.addToWhitelist>
export type AddToWhitelistReturn = FunctionReturn<typeof functions.addToWhitelist>

export type AuctionWhitelistParams = FunctionArguments<typeof functions.auctionWhitelist>
export type AuctionWhitelistReturn = FunctionReturn<typeof functions.auctionWhitelist>

export type AuctionWhitelistModeParams = FunctionArguments<typeof functions.auctionWhitelistMode>
export type AuctionWhitelistModeReturn = FunctionReturn<typeof functions.auctionWhitelistMode>

export type AvailableToBorrowParams = FunctionArguments<typeof functions.availableToBorrow>
export type AvailableToBorrowReturn = FunctionReturn<typeof functions.availableToBorrow>

export type BorrowParams = FunctionArguments<typeof functions.borrow>
export type BorrowReturn = FunctionReturn<typeof functions.borrow>

export type BorrowAprParams = FunctionArguments<typeof functions.borrowApr>
export type BorrowAprReturn = FunctionReturn<typeof functions.borrowApr>

export type BorrowLisUSDListaDistributorParams = FunctionArguments<typeof functions.borrowLisUSDListaDistributor>
export type BorrowLisUSDListaDistributorReturn = FunctionReturn<typeof functions.borrowLisUSDListaDistributor>

export type BorrowedParams = FunctionArguments<typeof functions.borrowed>
export type BorrowedReturn = FunctionReturn<typeof functions.borrowed>

export type BuyFromAuctionParams = FunctionArguments<typeof functions.buyFromAuction>
export type BuyFromAuctionReturn = FunctionReturn<typeof functions.buyFromAuction>

export type CollateralPriceParams = FunctionArguments<typeof functions.collateralPrice>
export type CollateralPriceReturn = FunctionReturn<typeof functions.collateralPrice>

export type CollateralRateParams = FunctionArguments<typeof functions.collateralRate>
export type CollateralRateReturn = FunctionReturn<typeof functions.collateralRate>

export type CollateralTVLParams = FunctionArguments<typeof functions.collateralTVL>
export type CollateralTVLReturn = FunctionReturn<typeof functions.collateralTVL>

export type CollateralsParams = FunctionArguments<typeof functions.collaterals>
export type CollateralsReturn = FunctionReturn<typeof functions.collaterals>

export type CurrentLiquidationPriceParams = FunctionArguments<typeof functions.currentLiquidationPrice>
export type CurrentLiquidationPriceReturn = FunctionReturn<typeof functions.currentLiquidationPrice>

export type DenyParams = FunctionArguments<typeof functions.deny>
export type DenyReturn = FunctionReturn<typeof functions.deny>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositTVLParams = FunctionArguments<typeof functions.depositTVL>
export type DepositTVLReturn = FunctionReturn<typeof functions.depositTVL>

export type DepositsParams = FunctionArguments<typeof functions.deposits>
export type DepositsReturn = FunctionReturn<typeof functions.deposits>

export type DepositsDeprecatedParams = FunctionArguments<typeof functions.depositsDeprecated>
export type DepositsDeprecatedReturn = FunctionReturn<typeof functions.depositsDeprecated>

export type DisableAuctionWhitelistParams = FunctionArguments<typeof functions.disableAuctionWhitelist>
export type DisableAuctionWhitelistReturn = FunctionReturn<typeof functions.disableAuctionWhitelist>

export type DisableWhitelistParams = FunctionArguments<typeof functions.disableWhitelist>
export type DisableWhitelistReturn = FunctionReturn<typeof functions.disableWhitelist>

export type DogParams = FunctionArguments<typeof functions.dog>
export type DogReturn = FunctionReturn<typeof functions.dog>

export type DripParams = FunctionArguments<typeof functions.drip>
export type DripReturn = FunctionReturn<typeof functions.drip>

export type DutyCalculatorParams = FunctionArguments<typeof functions.dutyCalculator>
export type DutyCalculatorReturn = FunctionReturn<typeof functions.dutyCalculator>

export type EnableAuctionWhitelistParams = FunctionArguments<typeof functions.enableAuctionWhitelist>
export type EnableAuctionWhitelistReturn = FunctionReturn<typeof functions.enableAuctionWhitelist>

export type EnableWhitelistParams = FunctionArguments<typeof functions.enableWhitelist>
export type EnableWhitelistReturn = FunctionReturn<typeof functions.enableWhitelist>

export type FreeParams = FunctionArguments<typeof functions.free>
export type FreeReturn = FunctionReturn<typeof functions.free>

export type GetAllActiveAuctionsForTokenParams = FunctionArguments<typeof functions.getAllActiveAuctionsForToken>
export type GetAllActiveAuctionsForTokenReturn = FunctionReturn<typeof functions.getAllActiveAuctionsForToken>

export type GetAuctionStatusParams = FunctionArguments<typeof functions.getAuctionStatus>
export type GetAuctionStatusReturn = FunctionReturn<typeof functions.getAuctionStatus>

export type HayParams = FunctionArguments<typeof functions.hay>
export type HayReturn = FunctionReturn<typeof functions.hay>

export type HayJoinParams = FunctionArguments<typeof functions.hayJoin>
export type HayJoinReturn = FunctionReturn<typeof functions.hayJoin>

export type HayPriceParams = FunctionArguments<typeof functions.hayPrice>
export type HayPriceReturn = FunctionReturn<typeof functions.hayPrice>

export type HelioProvidersParams = FunctionArguments<typeof functions.helioProviders>
export type HelioProvidersReturn = FunctionReturn<typeof functions.helioProviders>

export type HelioRewardsParams = FunctionArguments<typeof functions.helioRewards>
export type HelioRewardsReturn = FunctionReturn<typeof functions.helioRewards>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type JugParams = FunctionArguments<typeof functions.jug>
export type JugReturn = FunctionReturn<typeof functions.jug>

export type LockedParams = FunctionArguments<typeof functions.locked>
export type LockedReturn = FunctionReturn<typeof functions.locked>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PaybackParams = FunctionArguments<typeof functions.payback>
export type PaybackReturn = FunctionReturn<typeof functions.payback>

export type PaybackForParams = FunctionArguments<typeof functions.paybackFor>
export type PaybackForReturn = FunctionReturn<typeof functions.paybackFor>

export type PokeParams = FunctionArguments<typeof functions.poke>
export type PokeReturn = FunctionReturn<typeof functions.poke>

export type ProviderCompatibilityModeParams = FunctionArguments<typeof functions.providerCompatibilityMode>
export type ProviderCompatibilityModeReturn = FunctionReturn<typeof functions.providerCompatibilityMode>

export type RelyParams = FunctionArguments<typeof functions.rely>
export type RelyReturn = FunctionReturn<typeof functions.rely>

export type RemoveCollateralTypeParams = FunctionArguments<typeof functions.removeCollateralType>
export type RemoveCollateralTypeReturn = FunctionReturn<typeof functions.removeCollateralType>

export type RemoveFromAuctionWhitelistParams = FunctionArguments<typeof functions.removeFromAuctionWhitelist>
export type RemoveFromAuctionWhitelistReturn = FunctionReturn<typeof functions.removeFromAuctionWhitelist>

export type RemoveFromBlacklistParams = FunctionArguments<typeof functions.removeFromBlacklist>
export type RemoveFromBlacklistReturn = FunctionReturn<typeof functions.removeFromBlacklist>

export type RemoveFromWhitelistParams = FunctionArguments<typeof functions.removeFromWhitelist>
export type RemoveFromWhitelistReturn = FunctionReturn<typeof functions.removeFromWhitelist>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type ResetAuctionParams = FunctionArguments<typeof functions.resetAuction>
export type ResetAuctionReturn = FunctionReturn<typeof functions.resetAuction>

export type SetCollateralDutyParams = FunctionArguments<typeof functions.setCollateralDuty>
export type SetCollateralDutyReturn = FunctionReturn<typeof functions.setCollateralDuty>

export type SetCollateralTypeParams = FunctionArguments<typeof functions.setCollateralType>
export type SetCollateralTypeReturn = FunctionReturn<typeof functions.setCollateralType>

export type SetHelioProviderParams = FunctionArguments<typeof functions.setHelioProvider>
export type SetHelioProviderReturn = FunctionReturn<typeof functions.setHelioProvider>

export type SetListaDistributorParams = FunctionArguments<typeof functions.setListaDistributor>
export type SetListaDistributorReturn = FunctionReturn<typeof functions.setListaDistributor>

export type SetWhitelistOperatorParams = FunctionArguments<typeof functions.setWhitelistOperator>
export type SetWhitelistOperatorReturn = FunctionReturn<typeof functions.setWhitelistOperator>

export type SpotterParams = FunctionArguments<typeof functions.spotter>
export type SpotterReturn = FunctionReturn<typeof functions.spotter>

export type StartAuctionParams = FunctionArguments<typeof functions.startAuction>
export type StartAuctionReturn = FunctionReturn<typeof functions.startAuction>

export type SyncSnapshotParams = FunctionArguments<typeof functions.syncSnapshot>
export type SyncSnapshotReturn = FunctionReturn<typeof functions.syncSnapshot>

export type TokensBlacklistParams = FunctionArguments<typeof functions.tokensBlacklist>
export type TokensBlacklistReturn = FunctionReturn<typeof functions.tokensBlacklist>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type VatParams = FunctionArguments<typeof functions.vat>
export type VatReturn = FunctionReturn<typeof functions.vat>

export type WardsParams = FunctionArguments<typeof functions.wards>
export type WardsReturn = FunctionReturn<typeof functions.wards>

export type WhitelistParams = FunctionArguments<typeof functions.whitelist>
export type WhitelistReturn = FunctionReturn<typeof functions.whitelist>

export type WhitelistModeParams = FunctionArguments<typeof functions.whitelistMode>
export type WhitelistModeReturn = FunctionReturn<typeof functions.whitelistMode>

export type WhitelistOperatorParams = FunctionArguments<typeof functions.whitelistOperator>
export type WhitelistOperatorReturn = FunctionReturn<typeof functions.whitelistOperator>

export type WillBorrowParams = FunctionArguments<typeof functions.willBorrow>
export type WillBorrowReturn = FunctionReturn<typeof functions.willBorrow>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

