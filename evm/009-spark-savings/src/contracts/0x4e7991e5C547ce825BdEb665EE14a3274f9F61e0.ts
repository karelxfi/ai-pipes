import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    Deny: event("0x184450df2e323acec0ed3b5c7531b81f9b4cdef7914dfd4c0a4317416bb5251b", "Deny(address)", {"usr": indexed(p.address)}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"sender": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    Drip: event("0xad1e8a53178522eb68a9d94d862bf30c841f709d2115f743eb6b34528751c79f", "Drip(uint256,uint256)", {"chi": p.uint256, "diff": p.uint256}),
    File: event("0xe986e40cc8c151830d4f61050f4fb2e4add8567caad2d5f5496f9158e91fe4c7", "File(bytes32,uint256)", {"what": indexed(p.bytes32), "data": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    Referral: event("0xb30a03a0e2a407f18ae0e83491331dc069d1521e292feffb071e61c8f7f40636", "Referral(uint16,address,uint256,uint256)", {"referral": indexed(p.uint16), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    Rely: event("0xdd0e34038ac38b2a1ce960229778ac48a8719bc900b6c4f8d0475c6e8b385a60", "Rely(address)", {"usr": indexed(p.address)}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", "Withdraw(address,address,address,uint256,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
}

export const functions = {
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    PERMIT_TYPEHASH: viewFun("0x30adf81f", "PERMIT_TYPEHASH()", {}, p.bytes32),
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"_0": p.address, "_1": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "value": p.uint256}, p.bool),
    asset: viewFun("0x38d52e0f", "asset()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"_0": p.address}, p.uint256),
    chi: viewFun("0xc92aecc4", "chi()", {}, p.uint192),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets": p.uint256}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    deny: fun("0x9c52a7f1", "deny(address)", {"usr": p.address}, ),
    'deposit(uint256,address)': fun("0x6e553f65", "deposit(uint256,address)", {"assets": p.uint256, "receiver": p.address}, p.uint256),
    'deposit(uint256,address,uint16)': fun("0x9b8d6d38", "deposit(uint256,address,uint16)", {"assets": p.uint256, "receiver": p.address, "referral": p.uint16}, p.uint256),
    drip: fun("0x9f678cca", "drip()", {}, p.uint256),
    file: fun("0x29ae8114", "file(bytes32,uint256)", {"what": p.bytes32, "data": p.uint256}, ),
    getImplementation: viewFun("0xaaf10f42", "getImplementation()", {}, p.address),
    initialize: fun("0x8129fc1c", "initialize()", {}, ),
    maxDeposit: viewFun("0x402d267d", "maxDeposit(address)", {"_0": p.address}, p.uint256),
    maxMint: viewFun("0xc63d75b6", "maxMint(address)", {"_0": p.address}, p.uint256),
    maxRedeem: viewFun("0xd905777e", "maxRedeem(address)", {"owner": p.address}, p.uint256),
    maxWithdraw: viewFun("0xce96cb77", "maxWithdraw(address)", {"owner": p.address}, p.uint256),
    'mint(uint256,address,uint16)': fun("0x216740a0", "mint(uint256,address,uint16)", {"shares": p.uint256, "receiver": p.address, "referral": p.uint16}, p.uint256),
    'mint(uint256,address)': fun("0x94bf804d", "mint(uint256,address)", {"shares": p.uint256, "receiver": p.address}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"_0": p.address}, p.uint256),
    'permit(address,address,uint256,uint256,bytes)': fun("0x9fd5a6cf", "permit(address,address,uint256,uint256,bytes)", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "signature": p.bytes}, ),
    'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)': fun("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {"owner": p.address, "spender": p.address, "value": p.uint256, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, ),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"assets": p.uint256}, p.uint256),
    previewMint: viewFun("0xb3d7f6b9", "previewMint(uint256)", {"shares": p.uint256}, p.uint256),
    previewRedeem: viewFun("0x4cdad506", "previewRedeem(uint256)", {"shares": p.uint256}, p.uint256),
    previewWithdraw: viewFun("0x0a28a477", "previewWithdraw(uint256)", {"assets": p.uint256}, p.uint256),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    redeem: fun("0xba087652", "redeem(uint256,address,address)", {"shares": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
    rely: fun("0x65fae35e", "rely(address)", {"usr": p.address}, ),
    rho: viewFun("0x20aba08b", "rho()", {}, p.uint64),
    ssr: viewFun("0x03607ceb", "ssr()", {}, p.uint256),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"to": p.address, "value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "value": p.uint256}, p.bool),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
    usds: viewFun("0x4cf282fb", "usds()", {}, p.address),
    usdsJoin: viewFun("0xfa1e2e86", "usdsJoin()", {}, p.address),
    vat: viewFun("0x36569e77", "vat()", {}, p.address),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
    vow: viewFun("0x626cb3c5", "vow()", {}, p.address),
    wards: viewFun("0xbf353dbb", "wards(address)", {"_0": p.address}, p.uint256),
    withdraw: fun("0xb460af94", "withdraw(uint256,address,address)", {"assets": p.uint256, "receiver": p.address, "owner": p.address}, p.uint256),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }

    PERMIT_TYPEHASH() {
        return this.eth_call(functions.PERMIT_TYPEHASH, {})
    }

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    allowance(_0: AllowanceParams["_0"], _1: AllowanceParams["_1"]) {
        return this.eth_call(functions.allowance, {_0, _1})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(_0: BalanceOfParams["_0"]) {
        return this.eth_call(functions.balanceOf, {_0})
    }

    chi() {
        return this.eth_call(functions.chi, {})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getImplementation() {
        return this.eth_call(functions.getImplementation, {})
    }

    maxDeposit(_0: MaxDepositParams["_0"]) {
        return this.eth_call(functions.maxDeposit, {_0})
    }

    maxMint(_0: MaxMintParams["_0"]) {
        return this.eth_call(functions.maxMint, {_0})
    }

    maxRedeem(owner: MaxRedeemParams["owner"]) {
        return this.eth_call(functions.maxRedeem, {owner})
    }

    maxWithdraw(owner: MaxWithdrawParams["owner"]) {
        return this.eth_call(functions.maxWithdraw, {owner})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    nonces(_0: NoncesParams["_0"]) {
        return this.eth_call(functions.nonces, {_0})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(functions.previewDeposit, {assets})
    }

    previewMint(shares: PreviewMintParams["shares"]) {
        return this.eth_call(functions.previewMint, {shares})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(functions.previewRedeem, {shares})
    }

    previewWithdraw(assets: PreviewWithdrawParams["assets"]) {
        return this.eth_call(functions.previewWithdraw, {assets})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    rho() {
        return this.eth_call(functions.rho, {})
    }

    ssr() {
        return this.eth_call(functions.ssr, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    usds() {
        return this.eth_call(functions.usds, {})
    }

    usdsJoin() {
        return this.eth_call(functions.usdsJoin, {})
    }

    vat() {
        return this.eth_call(functions.vat, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }

    vow() {
        return this.eth_call(functions.vow, {})
    }

    wards(_0: WardsParams["_0"]) {
        return this.eth_call(functions.wards, {_0})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DenyEventArgs = EParams<typeof events.Deny>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type DripEventArgs = EParams<typeof events.Drip>
export type FileEventArgs = EParams<typeof events.File>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type ReferralEventArgs = EParams<typeof events.Referral>
export type RelyEventArgs = EParams<typeof events.Rely>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

export type PERMIT_TYPEHASHParams = FunctionArguments<typeof functions.PERMIT_TYPEHASH>
export type PERMIT_TYPEHASHReturn = FunctionReturn<typeof functions.PERMIT_TYPEHASH>

export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssetParams = FunctionArguments<typeof functions.asset>
export type AssetReturn = FunctionReturn<typeof functions.asset>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ChiParams = FunctionArguments<typeof functions.chi>
export type ChiReturn = FunctionReturn<typeof functions.chi>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DenyParams = FunctionArguments<typeof functions.deny>
export type DenyReturn = FunctionReturn<typeof functions.deny>

export type DepositParams_0 = FunctionArguments<typeof functions['deposit(uint256,address)']>
export type DepositReturn_0 = FunctionReturn<typeof functions['deposit(uint256,address)']>

export type DepositParams_1 = FunctionArguments<typeof functions['deposit(uint256,address,uint16)']>
export type DepositReturn_1 = FunctionReturn<typeof functions['deposit(uint256,address,uint16)']>

export type DripParams = FunctionArguments<typeof functions.drip>
export type DripReturn = FunctionReturn<typeof functions.drip>

export type FileParams = FunctionArguments<typeof functions.file>
export type FileReturn = FunctionReturn<typeof functions.file>

export type GetImplementationParams = FunctionArguments<typeof functions.getImplementation>
export type GetImplementationReturn = FunctionReturn<typeof functions.getImplementation>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type MaxDepositParams = FunctionArguments<typeof functions.maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof functions.maxDeposit>

export type MaxMintParams = FunctionArguments<typeof functions.maxMint>
export type MaxMintReturn = FunctionReturn<typeof functions.maxMint>

export type MaxRedeemParams = FunctionArguments<typeof functions.maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof functions.maxRedeem>

export type MaxWithdrawParams = FunctionArguments<typeof functions.maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof functions.maxWithdraw>

export type MintParams_0 = FunctionArguments<typeof functions['mint(uint256,address,uint16)']>
export type MintReturn_0 = FunctionReturn<typeof functions['mint(uint256,address,uint16)']>

export type MintParams_1 = FunctionArguments<typeof functions['mint(uint256,address)']>
export type MintReturn_1 = FunctionReturn<typeof functions['mint(uint256,address)']>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type PermitParams_0 = FunctionArguments<typeof functions['permit(address,address,uint256,uint256,bytes)']>
export type PermitReturn_0 = FunctionReturn<typeof functions['permit(address,address,uint256,uint256,bytes)']>

export type PermitParams_1 = FunctionArguments<typeof functions['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)']>
export type PermitReturn_1 = FunctionReturn<typeof functions['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)']>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewMintParams = FunctionArguments<typeof functions.previewMint>
export type PreviewMintReturn = FunctionReturn<typeof functions.previewMint>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RelyParams = FunctionArguments<typeof functions.rely>
export type RelyReturn = FunctionReturn<typeof functions.rely>

export type RhoParams = FunctionArguments<typeof functions.rho>
export type RhoReturn = FunctionReturn<typeof functions.rho>

export type SsrParams = FunctionArguments<typeof functions.ssr>
export type SsrReturn = FunctionReturn<typeof functions.ssr>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type UsdsParams = FunctionArguments<typeof functions.usds>
export type UsdsReturn = FunctionReturn<typeof functions.usds>

export type UsdsJoinParams = FunctionArguments<typeof functions.usdsJoin>
export type UsdsJoinReturn = FunctionReturn<typeof functions.usdsJoin>

export type VatParams = FunctionArguments<typeof functions.vat>
export type VatReturn = FunctionReturn<typeof functions.vat>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type VowParams = FunctionArguments<typeof functions.vow>
export type VowReturn = FunctionReturn<typeof functions.vow>

export type WardsParams = FunctionArguments<typeof functions.wards>
export type WardsReturn = FunctionReturn<typeof functions.wards>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

