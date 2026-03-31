import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AddToken: event("0xdbf34b45b47a653cf4940cccbec765f72d4d63de3237306905bfc0ee28832362", "AddToken(address,address)", {"asBnb": indexed(p.address), "token": indexed(p.address)}),
    AsBnbBurned: event("0xaa5365e70e35ac0430a743a2d1ea62eae7e2ded652dca247005ea6a9d9a89ed6", "AsBnbBurned(address,uint256,uint256)", {"user": indexed(p.address), "amountToBurn": p.uint256, "releaseTokenAmount": p.uint256}),
    AsBnbMinted: event("0x85997415bd3414b806458681ef3ae6f42455f982932d9fcf6b4519755a7f6e0d", "AsBnbMinted(address,uint256,uint256)", {"user": indexed(p.address), "amountIn": p.uint256, "amountOut": p.uint256}),
    AsBnbOFTAdapterUpdated: event("0x5b1d826fd7e7f12fa45125328dfff125c797345f1d4ab6e733d233eeb6285e7d", "AsBnbOFTAdapterUpdated(uint32,address)", {"eid": indexed(p.uint32), "adapter": p.address}),
    CanDepositUpdated: event("0x45abe80e1ccfdfb2be4680ea7a5d3a3a210f24b5e10dc89ea8c4eed1506e6b47", "CanDepositUpdated(address,bool)", {"sender": indexed(p.address), "canDeposit": p.bool}),
    CanWithdrawUpdated: event("0x9749b84f2ef83e4723b9c02b2957ee738f95576e915e0d99c1ff9991729c08fb", "CanWithdrawUpdated(address,bool)", {"sender": indexed(p.address), "canWithdraw": p.bool}),
    FeeRateUpdated: event("0x41987a4dd100e0dea1147b3834730a8a9862a99c887bda5c606ff0b85dfc41eb", "FeeRateUpdated(address,uint256,uint256)", {"sender": indexed(p.address), "oldFeeRate": p.uint256, "newFeeRate": p.uint256}),
    FeeWithdrawn: event("0x00ed5939179dc194223f0edd1517ecee2210b22da7f82c8e4b1795e93b9f06aa", "FeeWithdrawn(address,address,uint256)", {"sender": indexed(p.address), "recipient": p.address, "amount": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    MinMintAmountUpdated: event("0x09a73c8fe1a67a06f2a422be618a926728d2ef638543716b17fd77801d3eea34", "MinMintAmountUpdated(address,uint256,uint256)", {"sender": indexed(p.address), "oldMinMintAmount": p.uint256, "newMinMintAmount": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    RewardsCompounded: event("0x3f49f3b24a9f74ee36ca0198167b495c188b73e08c7e5754302b97c33bbc8442", "RewardsCompounded(address,uint256,uint256,uint256)", {"sender": indexed(p.address), "amountIn": p.uint256, "lockAmount": p.uint256, "fee": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    TokenMintReqCancelled: event("0xacec20606267f4013e2a5269f8a7e64d82bb5d31dda275d267e55ecaae7b1c58", "TokenMintReqCancelled(uint256,address,uint256)", {"index": indexed(p.uint256), "user": indexed(p.address), "amountOut": p.uint256}),
    TokenMintReqProcessed: event("0xdab5d37eed6f043a680b5789c6af5afbb16231fa0d1f54fc087129e0b5eee1d7", "TokenMintReqProcessed(uint256,address,uint256,uint256)", {"index": indexed(p.uint256), "user": indexed(p.address), "amountIn": p.uint256, "amountToMint": p.uint256}),
    TokenMintReqQueued: event("0x2ef1c913ea52422566670cf24875ff59bd82fd354a5c6656a1090d87a6de3dff", "TokenMintReqQueued(uint256,address,uint256)", {"index": indexed(p.uint256), "user": indexed(p.address), "amountIn": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    WithdrawalFee: event("0x78218b0264705ffc55d5d90ef489f17bfc4791b7314660e867f94f2f0b3a5924", "WithdrawalFee(address,address,uint256)", {"sender": indexed(p.address), "recipient": p.address, "amount": p.uint256}),
    WithdrawalFeeRateUpdated: event("0x0aaf8f72cb88085427eb25bd3024823761b95f2dedf4bc447bcfa2da6d9df1ab", "WithdrawalFeeRateUpdated(address,uint256,uint256)", {"sender": indexed(p.address), "oldWithdrawalFeeRate": p.uint256, "newWithdrawalFeeRate": p.uint256}),
}

export const functions = {
    BOT: viewFun("0x486277f6", "BOT()", {}, p.bytes32),
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    DENOMINATOR: viewFun("0x918f8674", "DENOMINATOR()", {}, p.uint256),
    MANAGER: viewFun("0x1b2df850", "MANAGER()", {}, p.bytes32),
    PAUSER: viewFun("0xd9dc8694", "PAUSER()", {}, p.bytes32),
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    WITHDRAWAL_FEE_RATE_UPPER_BOUND: viewFun("0x2932c639", "WITHDRAWAL_FEE_RATE_UPPER_BOUND()", {}, p.uint256),
    WITHDRAW_HELPER: viewFun("0x16ce8775", "WITHDRAW_HELPER()", {}, p.bytes32),
    asBnb: viewFun("0xee51d074", "asBnb()", {}, p.address),
    asBnbOFTAdapters: viewFun("0xd9bd8eac", "asBnbOFTAdapters(uint32)", {"_0": p.uint32}, p.address),
    burnAsBnb: fun("0xe03b6dbc", "burnAsBnb(uint256)", {"amountToBurn": p.uint256}, p.uint256),
    canDeposit: viewFun("0xe78a5875", "canDeposit()", {}, p.bool),
    canWithdraw: viewFun("0xb51459fe", "canWithdraw()", {}, p.bool),
    cancelMintRequests: fun("0x2b08a8c2", "cancelMintRequests(uint256[])", {"indexes": p.array(p.uint256)}, ),
    collectWithdrawalFee: fun("0x82a927a9", "collectWithdrawalFee(address,uint256)", {"recipient": p.address, "withdrawAmount": p.uint256}, ),
    compoundRewards: fun("0x656c579f", "compoundRewards(uint256)", {"amountIn": p.uint256}, ),
    convertToAsBnb: viewFun("0xcda31248", "convertToAsBnb(uint256)", {"tokens": p.uint256}, p.uint256),
    convertToTokens: viewFun("0x85906256", "convertToTokens(uint256)", {"asBnbAmt": p.uint256}, p.uint256),
    feeAvailable: viewFun("0xbdf070b6", "feeAvailable()", {}, p.uint256),
    feeRate: viewFun("0x978bbdb9", "feeRate()", {}, p.uint256),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0x35876476", "initialize(address,address,address,address,address,address,address)", {"_admin": p.address, "_manager": p.address, "_pauser": p.address, "_bot": p.address, "_token": p.address, "_asBnb": p.address, "_yieldProxy": p.address}, ),
    minMintAmount: viewFun("0x01e9d757", "minMintAmount()", {}, p.uint256),
    'mintAsBnb(uint256)': fun("0x0d88a1eb", "mintAsBnb(uint256)", {"amountIn": p.uint256}, p.uint256),
    'mintAsBnb()': fun("0x0eb78661", "mintAsBnb()", {}, p.uint256),
    'mintAsBnbFor(address)': fun("0x7b6751dd", "mintAsBnbFor(address)", {"forAddr": p.address}, p.uint256),
    'mintAsBnbFor(uint256,address)': fun("0xfe26c5b1", "mintAsBnbFor(uint256,address)", {"amountIn": p.uint256, "forAddr": p.address}, p.uint256),
    'mintAsBnbToChain((uint32,bytes32,uint256,uint256,bytes,bytes,bytes))': fun("0x50f816d8", "mintAsBnbToChain((uint32,bytes32,uint256,uint256,bytes,bytes,bytes))", {"sendParam": p.struct({"dstEid": p.uint32, "to": p.bytes32, "amountLD": p.uint256, "minAmountLD": p.uint256, "extraOptions": p.bytes, "composeMsg": p.bytes, "oftCmd": p.bytes})}, p.uint256),
    'mintAsBnbToChain(uint256,(uint32,bytes32,uint256,uint256,bytes,bytes,bytes))': fun("0xaffa88ad", "mintAsBnbToChain(uint256,(uint32,bytes32,uint256,uint256,bytes,bytes,bytes))", {"amountIn": p.uint256, "sendParam": p.struct({"dstEid": p.uint32, "to": p.bytes32, "amountLD": p.uint256, "minAmountLD": p.uint256, "extraOptions": p.bytes, "composeMsg": p.bytes, "oftCmd": p.bytes})}, p.uint256),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    processMintQueue: fun("0xc45d238f", "processMintQueue(uint256)", {"batchSize": p.uint256}, ),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    queueFront: viewFun("0x60dde4c2", "queueFront()", {}, p.uint256),
    queueRear: viewFun("0xf665064d", "queueRear()", {}, p.uint256),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setAsBnbOFTAdapter: fun("0x82b123f8", "setAsBnbOFTAdapter(uint32,address)", {"eid": p.uint32, "adapter": p.address}, ),
    setFeeRate: fun("0x45596e2e", "setFeeRate(uint256)", {"_feeRate": p.uint256}, ),
    setMinMintAmount: fun("0x1d85d796", "setMinMintAmount(uint256)", {"_minMintAmount": p.uint256}, ),
    setWithdrawalFeeRate: fun("0x9d5b9f65", "setWithdrawalFeeRate(uint256)", {"_withdrawalFeeRate": p.uint256}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    toggleCanDeposit: fun("0x2d18a7bb", "toggleCanDeposit()", {}, ),
    toggleCanWithdraw: fun("0xc4cfc197", "toggleCanWithdraw()", {}, ),
    token: viewFun("0xfc0c546a", "token()", {}, p.address),
    tokenMintReqQueue: viewFun("0xa813ba2e", "tokenMintReqQueue(uint256)", {"_0": p.uint256}, {"user": p.address, "amountIn": p.uint256}),
    totalTokens: viewFun("0x7e1c0c09", "totalTokens()", {}, p.uint256),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
    withdrawFee: fun("0xfd9be522", "withdrawFee(address,uint256)", {"recipient": p.address, "withdrawAmount": p.uint256}, ),
    withdrawalFeeAvailable: viewFun("0x6aee386a", "withdrawalFeeAvailable()", {}, p.uint256),
    withdrawalFeeRate: viewFun("0xa223f821", "withdrawalFeeRate()", {}, p.uint256),
    yieldProxy: viewFun("0xa325deac", "yieldProxy()", {}, p.address),
}

export class Contract extends ContractBase {

    BOT() {
        return this.eth_call(functions.BOT, {})
    }

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    DENOMINATOR() {
        return this.eth_call(functions.DENOMINATOR, {})
    }

    MANAGER() {
        return this.eth_call(functions.MANAGER, {})
    }

    PAUSER() {
        return this.eth_call(functions.PAUSER, {})
    }

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    WITHDRAWAL_FEE_RATE_UPPER_BOUND() {
        return this.eth_call(functions.WITHDRAWAL_FEE_RATE_UPPER_BOUND, {})
    }

    WITHDRAW_HELPER() {
        return this.eth_call(functions.WITHDRAW_HELPER, {})
    }

    asBnb() {
        return this.eth_call(functions.asBnb, {})
    }

    asBnbOFTAdapters(_0: AsBnbOFTAdaptersParams["_0"]) {
        return this.eth_call(functions.asBnbOFTAdapters, {_0})
    }

    canDeposit() {
        return this.eth_call(functions.canDeposit, {})
    }

    canWithdraw() {
        return this.eth_call(functions.canWithdraw, {})
    }

    convertToAsBnb(tokens: ConvertToAsBnbParams["tokens"]) {
        return this.eth_call(functions.convertToAsBnb, {tokens})
    }

    convertToTokens(asBnbAmt: ConvertToTokensParams["asBnbAmt"]) {
        return this.eth_call(functions.convertToTokens, {asBnbAmt})
    }

    feeAvailable() {
        return this.eth_call(functions.feeAvailable, {})
    }

    feeRate() {
        return this.eth_call(functions.feeRate, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    minMintAmount() {
        return this.eth_call(functions.minMintAmount, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    queueFront() {
        return this.eth_call(functions.queueFront, {})
    }

    queueRear() {
        return this.eth_call(functions.queueRear, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    token() {
        return this.eth_call(functions.token, {})
    }

    tokenMintReqQueue(_0: TokenMintReqQueueParams["_0"]) {
        return this.eth_call(functions.tokenMintReqQueue, {_0})
    }

    totalTokens() {
        return this.eth_call(functions.totalTokens, {})
    }

    withdrawalFeeAvailable() {
        return this.eth_call(functions.withdrawalFeeAvailable, {})
    }

    withdrawalFeeRate() {
        return this.eth_call(functions.withdrawalFeeRate, {})
    }

    yieldProxy() {
        return this.eth_call(functions.yieldProxy, {})
    }
}

/// Event types
export type AddTokenEventArgs = EParams<typeof events.AddToken>
export type AsBnbBurnedEventArgs = EParams<typeof events.AsBnbBurned>
export type AsBnbMintedEventArgs = EParams<typeof events.AsBnbMinted>
export type AsBnbOFTAdapterUpdatedEventArgs = EParams<typeof events.AsBnbOFTAdapterUpdated>
export type CanDepositUpdatedEventArgs = EParams<typeof events.CanDepositUpdated>
export type CanWithdrawUpdatedEventArgs = EParams<typeof events.CanWithdrawUpdated>
export type FeeRateUpdatedEventArgs = EParams<typeof events.FeeRateUpdated>
export type FeeWithdrawnEventArgs = EParams<typeof events.FeeWithdrawn>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type MinMintAmountUpdatedEventArgs = EParams<typeof events.MinMintAmountUpdated>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RewardsCompoundedEventArgs = EParams<typeof events.RewardsCompounded>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type TokenMintReqCancelledEventArgs = EParams<typeof events.TokenMintReqCancelled>
export type TokenMintReqProcessedEventArgs = EParams<typeof events.TokenMintReqProcessed>
export type TokenMintReqQueuedEventArgs = EParams<typeof events.TokenMintReqQueued>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WithdrawalFeeEventArgs = EParams<typeof events.WithdrawalFee>
export type WithdrawalFeeRateUpdatedEventArgs = EParams<typeof events.WithdrawalFeeRateUpdated>

/// Function types
export type BOTParams = FunctionArguments<typeof functions.BOT>
export type BOTReturn = FunctionReturn<typeof functions.BOT>

export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type DENOMINATORParams = FunctionArguments<typeof functions.DENOMINATOR>
export type DENOMINATORReturn = FunctionReturn<typeof functions.DENOMINATOR>

export type MANAGERParams = FunctionArguments<typeof functions.MANAGER>
export type MANAGERReturn = FunctionReturn<typeof functions.MANAGER>

export type PAUSERParams = FunctionArguments<typeof functions.PAUSER>
export type PAUSERReturn = FunctionReturn<typeof functions.PAUSER>

export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type WITHDRAWAL_FEE_RATE_UPPER_BOUNDParams = FunctionArguments<typeof functions.WITHDRAWAL_FEE_RATE_UPPER_BOUND>
export type WITHDRAWAL_FEE_RATE_UPPER_BOUNDReturn = FunctionReturn<typeof functions.WITHDRAWAL_FEE_RATE_UPPER_BOUND>

export type WITHDRAW_HELPERParams = FunctionArguments<typeof functions.WITHDRAW_HELPER>
export type WITHDRAW_HELPERReturn = FunctionReturn<typeof functions.WITHDRAW_HELPER>

export type AsBnbParams = FunctionArguments<typeof functions.asBnb>
export type AsBnbReturn = FunctionReturn<typeof functions.asBnb>

export type AsBnbOFTAdaptersParams = FunctionArguments<typeof functions.asBnbOFTAdapters>
export type AsBnbOFTAdaptersReturn = FunctionReturn<typeof functions.asBnbOFTAdapters>

export type BurnAsBnbParams = FunctionArguments<typeof functions.burnAsBnb>
export type BurnAsBnbReturn = FunctionReturn<typeof functions.burnAsBnb>

export type CanDepositParams = FunctionArguments<typeof functions.canDeposit>
export type CanDepositReturn = FunctionReturn<typeof functions.canDeposit>

export type CanWithdrawParams = FunctionArguments<typeof functions.canWithdraw>
export type CanWithdrawReturn = FunctionReturn<typeof functions.canWithdraw>

export type CancelMintRequestsParams = FunctionArguments<typeof functions.cancelMintRequests>
export type CancelMintRequestsReturn = FunctionReturn<typeof functions.cancelMintRequests>

export type CollectWithdrawalFeeParams = FunctionArguments<typeof functions.collectWithdrawalFee>
export type CollectWithdrawalFeeReturn = FunctionReturn<typeof functions.collectWithdrawalFee>

export type CompoundRewardsParams = FunctionArguments<typeof functions.compoundRewards>
export type CompoundRewardsReturn = FunctionReturn<typeof functions.compoundRewards>

export type ConvertToAsBnbParams = FunctionArguments<typeof functions.convertToAsBnb>
export type ConvertToAsBnbReturn = FunctionReturn<typeof functions.convertToAsBnb>

export type ConvertToTokensParams = FunctionArguments<typeof functions.convertToTokens>
export type ConvertToTokensReturn = FunctionReturn<typeof functions.convertToTokens>

export type FeeAvailableParams = FunctionArguments<typeof functions.feeAvailable>
export type FeeAvailableReturn = FunctionReturn<typeof functions.feeAvailable>

export type FeeRateParams = FunctionArguments<typeof functions.feeRate>
export type FeeRateReturn = FunctionReturn<typeof functions.feeRate>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type MinMintAmountParams = FunctionArguments<typeof functions.minMintAmount>
export type MinMintAmountReturn = FunctionReturn<typeof functions.minMintAmount>

export type MintAsBnbParams_0 = FunctionArguments<typeof functions['mintAsBnb(uint256)']>
export type MintAsBnbReturn_0 = FunctionReturn<typeof functions['mintAsBnb(uint256)']>

export type MintAsBnbParams_1 = FunctionArguments<typeof functions['mintAsBnb()']>
export type MintAsBnbReturn_1 = FunctionReturn<typeof functions['mintAsBnb()']>

export type MintAsBnbForParams_0 = FunctionArguments<typeof functions['mintAsBnbFor(address)']>
export type MintAsBnbForReturn_0 = FunctionReturn<typeof functions['mintAsBnbFor(address)']>

export type MintAsBnbForParams_1 = FunctionArguments<typeof functions['mintAsBnbFor(uint256,address)']>
export type MintAsBnbForReturn_1 = FunctionReturn<typeof functions['mintAsBnbFor(uint256,address)']>

export type MintAsBnbToChainParams_0 = FunctionArguments<typeof functions['mintAsBnbToChain((uint32,bytes32,uint256,uint256,bytes,bytes,bytes))']>
export type MintAsBnbToChainReturn_0 = FunctionReturn<typeof functions['mintAsBnbToChain((uint32,bytes32,uint256,uint256,bytes,bytes,bytes))']>

export type MintAsBnbToChainParams_1 = FunctionArguments<typeof functions['mintAsBnbToChain(uint256,(uint32,bytes32,uint256,uint256,bytes,bytes,bytes))']>
export type MintAsBnbToChainReturn_1 = FunctionReturn<typeof functions['mintAsBnbToChain(uint256,(uint32,bytes32,uint256,uint256,bytes,bytes,bytes))']>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type ProcessMintQueueParams = FunctionArguments<typeof functions.processMintQueue>
export type ProcessMintQueueReturn = FunctionReturn<typeof functions.processMintQueue>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type QueueFrontParams = FunctionArguments<typeof functions.queueFront>
export type QueueFrontReturn = FunctionReturn<typeof functions.queueFront>

export type QueueRearParams = FunctionArguments<typeof functions.queueRear>
export type QueueRearReturn = FunctionReturn<typeof functions.queueRear>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetAsBnbOFTAdapterParams = FunctionArguments<typeof functions.setAsBnbOFTAdapter>
export type SetAsBnbOFTAdapterReturn = FunctionReturn<typeof functions.setAsBnbOFTAdapter>

export type SetFeeRateParams = FunctionArguments<typeof functions.setFeeRate>
export type SetFeeRateReturn = FunctionReturn<typeof functions.setFeeRate>

export type SetMinMintAmountParams = FunctionArguments<typeof functions.setMinMintAmount>
export type SetMinMintAmountReturn = FunctionReturn<typeof functions.setMinMintAmount>

export type SetWithdrawalFeeRateParams = FunctionArguments<typeof functions.setWithdrawalFeeRate>
export type SetWithdrawalFeeRateReturn = FunctionReturn<typeof functions.setWithdrawalFeeRate>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type ToggleCanDepositParams = FunctionArguments<typeof functions.toggleCanDeposit>
export type ToggleCanDepositReturn = FunctionReturn<typeof functions.toggleCanDeposit>

export type ToggleCanWithdrawParams = FunctionArguments<typeof functions.toggleCanWithdraw>
export type ToggleCanWithdrawReturn = FunctionReturn<typeof functions.toggleCanWithdraw>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type TokenMintReqQueueParams = FunctionArguments<typeof functions.tokenMintReqQueue>
export type TokenMintReqQueueReturn = FunctionReturn<typeof functions.tokenMintReqQueue>

export type TotalTokensParams = FunctionArguments<typeof functions.totalTokens>
export type TotalTokensReturn = FunctionReturn<typeof functions.totalTokens>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type WithdrawFeeParams = FunctionArguments<typeof functions.withdrawFee>
export type WithdrawFeeReturn = FunctionReturn<typeof functions.withdrawFee>

export type WithdrawalFeeAvailableParams = FunctionArguments<typeof functions.withdrawalFeeAvailable>
export type WithdrawalFeeAvailableReturn = FunctionReturn<typeof functions.withdrawalFeeAvailable>

export type WithdrawalFeeRateParams = FunctionArguments<typeof functions.withdrawalFeeRate>
export type WithdrawalFeeRateReturn = FunctionReturn<typeof functions.withdrawalFeeRate>

export type YieldProxyParams = FunctionArguments<typeof functions.yieldProxy>
export type YieldProxyReturn = FunctionReturn<typeof functions.yieldProxy>

