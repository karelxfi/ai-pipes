import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuctionedEthReceived: event("0xffb49c9f940c060c51ce2a0b874b4fd4f5c0bc9cb4d60f0e9a333760dcb236ed", "AuctionedEthReceived(uint256)", {"amount": p.uint256}),
    DepositReferral: event("0x93e8717125380ada8257a121bc491ee690504d4d93610a2ed763d7d15d708aa8", "DepositReferral(address,address,uint256,uint256,string)", {"caller": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256, "referralId": p.string}),
    Deposited: event("0xf5681f9d0db1b911ac18ee83d515a1cf1051853a9eae418316a2fdf7dea427c5", "Deposited(address,address,uint256,uint256)", {"caller": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    ETHTransferredToPool: event("0x0f4ee8a1358b01e75e0b5291e986fa643035327081fc296a9bb60449257e988a", "ETHTransferredToPool(uint256,address,uint256)", {"poolId": indexed(p.uint256), "poolAddress": p.address, "validatorCount": p.uint256}),
    ExecutionLayerRewardsReceived: event("0xe2abdf52ca718fb2feac4ce491e7a4b908e49e318734391dfee4e03fc5acf4d6", "ExecutionLayerRewardsReceived(uint256)", {"amount": p.uint256}),
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", "Initialized(uint8)", {"version": p.uint8}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    ReceivedExcessEthFromPool: event("0x9d702bbfa67b9ff48c9c450576e1f53296afd8f7bf30211d771128708586f5b1", "ReceivedExcessEthFromPool(uint8)", {"poolId": indexed(p.uint8)}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    TransferredETHToUserWithdrawManager: event("0xfcf1373cbfb78832a864dcce3862324e51116876bd08423a61b5ed6d5c03f421", "TransferredETHToUserWithdrawManager(uint256)", {"amount": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    UpdatedExcessETHDepositCoolDown: event("0xdf91929e13446a67ab8b4f37b193a2650935a1ac5cd8f39586f386afd552b724", "UpdatedExcessETHDepositCoolDown(uint256)", {"excessETHDepositCoolDown": p.uint256}),
    UpdatedStaderConfig: event("0xdb2219043d7b197cb235f1af0cf6d782d77dee3de19e3f4fb6d39aae633b4485", "UpdatedStaderConfig(address)", {"staderConfig": p.address}),
    WithdrawVaultUserShareReceived: event("0x5569069b23fc6ce6fbe88bdd95e974a82fb3d433cc2ebcbe4dd70af6ac63f83b", "WithdrawVaultUserShareReceived(uint256)", {"amount": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"_shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"_assets": p.uint256}, p.uint256),
    'deposit(address,string)': fun("0xb7482509", "deposit(address,string)", {"_receiver": p.address, "_referralId": p.string}, p.uint256),
    'deposit(address)': fun("0xf340fa01", "deposit(address)", {"_receiver": p.address}, p.uint256),
    depositETHOverTargetWeight: fun("0xbf040ea1", "depositETHOverTargetWeight()", {}, ),
    excessETHDepositCoolDown: viewFun("0xfa43245f", "excessETHDepositCoolDown()", {}, p.uint256),
    getExchangeRate: viewFun("0xe6aa216c", "getExchangeRate()", {}, p.uint256),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0x485cc955", "initialize(address,address)", {"_admin": p.address, "_staderConfig": p.address}, ),
    isVaultHealthy: viewFun("0xd5c9cfb0", "isVaultHealthy()", {}, p.bool),
    lastExcessETHDepositBlock: viewFun("0x83770c74", "lastExcessETHDepositBlock()", {}, p.uint256),
    maxDeposit: viewFun("0x6083e59a", "maxDeposit()", {}, p.uint256),
    minDeposit: viewFun("0x41b3d185", "minDeposit()", {}, p.uint256),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"_assets": p.uint256}, p.uint256),
    previewWithdraw: viewFun("0x0a28a477", "previewWithdraw(uint256)", {"_shares": p.uint256}, p.uint256),
    receiveEthFromAuction: fun("0x6f3ca778", "receiveEthFromAuction()", {}, ),
    receiveExcessEthFromPool: fun("0xa55d3088", "receiveExcessEthFromPool(uint8)", {"_poolId": p.uint8}, ),
    receiveExecutionLayerRewards: fun("0x33cf0ef0", "receiveExecutionLayerRewards()", {}, ),
    receiveWithdrawVaultUserShare: fun("0x24477f11", "receiveWithdrawVaultUserShare()", {}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    staderConfig: viewFun("0x490ffa35", "staderConfig()", {}, p.address),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    transferETHToUserWithdrawManager: fun("0x1cdfeb8f", "transferETHToUserWithdrawManager(uint256)", {"_amount": p.uint256}, ),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    updateExcessETHDepositCoolDown: fun("0x7fafeb8e", "updateExcessETHDepositCoolDown(uint256)", {"_excessETHDepositCoolDown": p.uint256}, ),
    updateStaderConfig: fun("0x9ee804cb", "updateStaderConfig(address)", {"_staderConfig": p.address}, ),
    validatorBatchDeposit: fun("0x3e05b7dd", "validatorBatchDeposit(uint8)", {"_poolId": p.uint8}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    convertToAssets(_shares: ConvertToAssetsParams["_shares"]) {
        return this.eth_call(functions.convertToAssets, {_shares})
    }

    convertToShares(_assets: ConvertToSharesParams["_assets"]) {
        return this.eth_call(functions.convertToShares, {_assets})
    }

    excessETHDepositCoolDown() {
        return this.eth_call(functions.excessETHDepositCoolDown, {})
    }

    getExchangeRate() {
        return this.eth_call(functions.getExchangeRate, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isVaultHealthy() {
        return this.eth_call(functions.isVaultHealthy, {})
    }

    lastExcessETHDepositBlock() {
        return this.eth_call(functions.lastExcessETHDepositBlock, {})
    }

    maxDeposit() {
        return this.eth_call(functions.maxDeposit, {})
    }

    minDeposit() {
        return this.eth_call(functions.minDeposit, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    previewDeposit(_assets: PreviewDepositParams["_assets"]) {
        return this.eth_call(functions.previewDeposit, {_assets})
    }

    previewWithdraw(_shares: PreviewWithdrawParams["_shares"]) {
        return this.eth_call(functions.previewWithdraw, {_shares})
    }

    staderConfig() {
        return this.eth_call(functions.staderConfig, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }
}

/// Event types
export type AuctionedEthReceivedEventArgs = EParams<typeof events.AuctionedEthReceived>
export type DepositReferralEventArgs = EParams<typeof events.DepositReferral>
export type DepositedEventArgs = EParams<typeof events.Deposited>
export type ETHTransferredToPoolEventArgs = EParams<typeof events.ETHTransferredToPool>
export type ExecutionLayerRewardsReceivedEventArgs = EParams<typeof events.ExecutionLayerRewardsReceived>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type PausedEventArgs = EParams<typeof events.Paused>
export type ReceivedExcessEthFromPoolEventArgs = EParams<typeof events.ReceivedExcessEthFromPool>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type TransferredETHToUserWithdrawManagerEventArgs = EParams<typeof events.TransferredETHToUserWithdrawManager>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type UpdatedExcessETHDepositCoolDownEventArgs = EParams<typeof events.UpdatedExcessETHDepositCoolDown>
export type UpdatedStaderConfigEventArgs = EParams<typeof events.UpdatedStaderConfig>
export type WithdrawVaultUserShareReceivedEventArgs = EParams<typeof events.WithdrawVaultUserShareReceived>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type DepositParams_0 = FunctionArguments<typeof functions['deposit(address,string)']>
export type DepositReturn_0 = FunctionReturn<typeof functions['deposit(address,string)']>

export type DepositParams_1 = FunctionArguments<typeof functions['deposit(address)']>
export type DepositReturn_1 = FunctionReturn<typeof functions['deposit(address)']>

export type DepositETHOverTargetWeightParams = FunctionArguments<typeof functions.depositETHOverTargetWeight>
export type DepositETHOverTargetWeightReturn = FunctionReturn<typeof functions.depositETHOverTargetWeight>

export type ExcessETHDepositCoolDownParams = FunctionArguments<typeof functions.excessETHDepositCoolDown>
export type ExcessETHDepositCoolDownReturn = FunctionReturn<typeof functions.excessETHDepositCoolDown>

export type GetExchangeRateParams = FunctionArguments<typeof functions.getExchangeRate>
export type GetExchangeRateReturn = FunctionReturn<typeof functions.getExchangeRate>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsVaultHealthyParams = FunctionArguments<typeof functions.isVaultHealthy>
export type IsVaultHealthyReturn = FunctionReturn<typeof functions.isVaultHealthy>

export type LastExcessETHDepositBlockParams = FunctionArguments<typeof functions.lastExcessETHDepositBlock>
export type LastExcessETHDepositBlockReturn = FunctionReturn<typeof functions.lastExcessETHDepositBlock>

export type MaxDepositParams = FunctionArguments<typeof functions.maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof functions.maxDeposit>

export type MinDepositParams = FunctionArguments<typeof functions.minDeposit>
export type MinDepositReturn = FunctionReturn<typeof functions.minDeposit>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type ReceiveEthFromAuctionParams = FunctionArguments<typeof functions.receiveEthFromAuction>
export type ReceiveEthFromAuctionReturn = FunctionReturn<typeof functions.receiveEthFromAuction>

export type ReceiveExcessEthFromPoolParams = FunctionArguments<typeof functions.receiveExcessEthFromPool>
export type ReceiveExcessEthFromPoolReturn = FunctionReturn<typeof functions.receiveExcessEthFromPool>

export type ReceiveExecutionLayerRewardsParams = FunctionArguments<typeof functions.receiveExecutionLayerRewards>
export type ReceiveExecutionLayerRewardsReturn = FunctionReturn<typeof functions.receiveExecutionLayerRewards>

export type ReceiveWithdrawVaultUserShareParams = FunctionArguments<typeof functions.receiveWithdrawVaultUserShare>
export type ReceiveWithdrawVaultUserShareReturn = FunctionReturn<typeof functions.receiveWithdrawVaultUserShare>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type StaderConfigParams = FunctionArguments<typeof functions.staderConfig>
export type StaderConfigReturn = FunctionReturn<typeof functions.staderConfig>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TransferETHToUserWithdrawManagerParams = FunctionArguments<typeof functions.transferETHToUserWithdrawManager>
export type TransferETHToUserWithdrawManagerReturn = FunctionReturn<typeof functions.transferETHToUserWithdrawManager>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpdateExcessETHDepositCoolDownParams = FunctionArguments<typeof functions.updateExcessETHDepositCoolDown>
export type UpdateExcessETHDepositCoolDownReturn = FunctionReturn<typeof functions.updateExcessETHDepositCoolDown>

export type UpdateStaderConfigParams = FunctionArguments<typeof functions.updateStaderConfig>
export type UpdateStaderConfigReturn = FunctionReturn<typeof functions.updateStaderConfig>

export type ValidatorBatchDepositParams = FunctionArguments<typeof functions.validatorBatchDeposit>
export type ValidatorBatchDepositReturn = FunctionReturn<typeof functions.validatorBatchDeposit>

