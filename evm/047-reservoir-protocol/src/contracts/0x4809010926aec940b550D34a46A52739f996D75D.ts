import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Allocate: event("0xe2a6fbb55be829f7f41ce6980e5fc3057544b2788af2e168fbf7a3db02284e7b", "Allocate(address,uint256,uint256)", {"signer": indexed(p.address), "amount": p.uint256, "timestamp": p.uint256}),
    Mint: event("0x2f00e3cdd69a77be7ed215ec7b2a36784dd158f921fca79ac29deffa353fe6ee", "Mint(address,address,uint256,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "amount": p.uint256, "timestamp": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    Redeem: event("0x3f693fff038bb8a046aa76d9516190ac7444f7d69cf952c4cbdc086fdef2d6fc", "Redeem(address,address,uint256,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "amount": p.uint256, "timestamp": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    UnderlyingRiskWeightUpdate: event("0xb0234275d06a5d9055875d8c18951c51d6e449058d44424be5986ba5fb00ae04", "UnderlyingRiskWeightUpdate(uint256,uint256)", {"riskWeight": p.uint256, "timestamp": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    Withdraw: event("0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568", "Withdraw(address,uint256,uint256)", {"signer": indexed(p.address), "amount": p.uint256, "timestamp": p.uint256}),
}

export const functions = {
    CONTROLLER: viewFun("0xee0fc121", "CONTROLLER()", {}, p.bytes32),
    DECIMAL_FACTOR: viewFun("0x33fdbbe5", "DECIMAL_FACTOR()", {}, p.uint8),
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    MANAGER: viewFun("0x1b2df850", "MANAGER()", {}, p.bytes32),
    SUPERVISOR: viewFun("0x7b3ba717", "SUPERVISOR()", {}, p.bytes32),
    allocate: fun("0x90ca796b", "allocate(uint256)", {"amount": p.uint256}, ),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    mint: fun("0xc6c3bbe6", "mint(address,address,uint256)", {"from": p.address, "to": p.address, "amount": p.uint256}, ),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    'redeem(address,uint256)': fun("0x1e9a6950", "redeem(address,uint256)", {"to": p.address, "amount": p.uint256}, ),
    'redeem(uint256)': fun("0xdb006a75", "redeem(uint256)", {"amount": p.uint256}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    rusd: viewFun("0xa5a4dcf7", "rusd()", {}, p.address),
    setUnderlyingRiskWeight: fun("0xe5118d1a", "setUnderlyingRiskWeight(uint256)", {"riskWeight": p.uint256}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    totalRiskValue: viewFun("0x265a3a2a", "totalRiskValue()", {}, p.uint256),
    totalValue: viewFun("0xd4c3eea0", "totalValue()", {}, p.uint256),
    underlying: viewFun("0x6f307dc3", "underlying()", {}, p.address),
    underlyingBalance: viewFun("0x59356c5c", "underlyingBalance()", {}, p.uint256),
    underlyingPriceOracle: viewFun("0x07285dc6", "underlyingPriceOracle()", {}, p.address),
    underlyingRiskValue: viewFun("0xda842cb7", "underlyingRiskValue(uint256)", {"amount": p.uint256}, p.uint256),
    underlyingRiskWeight: viewFun("0xe68eb989", "underlyingRiskWeight()", {}, p.uint256),
    underlyingTotalRiskValue: viewFun("0xd82933ee", "underlyingTotalRiskValue()", {}, p.uint256),
    underlyingTotalValue: viewFun("0xd522af4e", "underlyingTotalValue()", {}, p.uint256),
    underlyingValue: viewFun("0xee0ded62", "underlyingValue(uint256)", {"amount": p.uint256}, p.uint256),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    withdraw: fun("0x2e1a7d4d", "withdraw(uint256)", {"amount": p.uint256}, ),
}

export class Contract extends ContractBase {

    CONTROLLER() {
        return this.eth_call(functions.CONTROLLER, {})
    }

    DECIMAL_FACTOR() {
        return this.eth_call(functions.DECIMAL_FACTOR, {})
    }

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    MANAGER() {
        return this.eth_call(functions.MANAGER, {})
    }

    SUPERVISOR() {
        return this.eth_call(functions.SUPERVISOR, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    rusd() {
        return this.eth_call(functions.rusd, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    totalRiskValue() {
        return this.eth_call(functions.totalRiskValue, {})
    }

    totalValue() {
        return this.eth_call(functions.totalValue, {})
    }

    underlying() {
        return this.eth_call(functions.underlying, {})
    }

    underlyingBalance() {
        return this.eth_call(functions.underlyingBalance, {})
    }

    underlyingPriceOracle() {
        return this.eth_call(functions.underlyingPriceOracle, {})
    }

    underlyingRiskValue(amount: UnderlyingRiskValueParams["amount"]) {
        return this.eth_call(functions.underlyingRiskValue, {amount})
    }

    underlyingRiskWeight() {
        return this.eth_call(functions.underlyingRiskWeight, {})
    }

    underlyingTotalRiskValue() {
        return this.eth_call(functions.underlyingTotalRiskValue, {})
    }

    underlyingTotalValue() {
        return this.eth_call(functions.underlyingTotalValue, {})
    }

    underlyingValue(amount: UnderlyingValueParams["amount"]) {
        return this.eth_call(functions.underlyingValue, {amount})
    }
}

/// Event types
export type AllocateEventArgs = EParams<typeof events.Allocate>
export type MintEventArgs = EParams<typeof events.Mint>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RedeemEventArgs = EParams<typeof events.Redeem>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type UnderlyingRiskWeightUpdateEventArgs = EParams<typeof events.UnderlyingRiskWeightUpdate>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type CONTROLLERParams = FunctionArguments<typeof functions.CONTROLLER>
export type CONTROLLERReturn = FunctionReturn<typeof functions.CONTROLLER>

export type DECIMAL_FACTORParams = FunctionArguments<typeof functions.DECIMAL_FACTOR>
export type DECIMAL_FACTORReturn = FunctionReturn<typeof functions.DECIMAL_FACTOR>

export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type MANAGERParams = FunctionArguments<typeof functions.MANAGER>
export type MANAGERReturn = FunctionReturn<typeof functions.MANAGER>

export type SUPERVISORParams = FunctionArguments<typeof functions.SUPERVISOR>
export type SUPERVISORReturn = FunctionReturn<typeof functions.SUPERVISOR>

export type AllocateParams = FunctionArguments<typeof functions.allocate>
export type AllocateReturn = FunctionReturn<typeof functions.allocate>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RedeemParams_0 = FunctionArguments<typeof functions['redeem(address,uint256)']>
export type RedeemReturn_0 = FunctionReturn<typeof functions['redeem(address,uint256)']>

export type RedeemParams_1 = FunctionArguments<typeof functions['redeem(uint256)']>
export type RedeemReturn_1 = FunctionReturn<typeof functions['redeem(uint256)']>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RusdParams = FunctionArguments<typeof functions.rusd>
export type RusdReturn = FunctionReturn<typeof functions.rusd>

export type SetUnderlyingRiskWeightParams = FunctionArguments<typeof functions.setUnderlyingRiskWeight>
export type SetUnderlyingRiskWeightReturn = FunctionReturn<typeof functions.setUnderlyingRiskWeight>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TotalRiskValueParams = FunctionArguments<typeof functions.totalRiskValue>
export type TotalRiskValueReturn = FunctionReturn<typeof functions.totalRiskValue>

export type TotalValueParams = FunctionArguments<typeof functions.totalValue>
export type TotalValueReturn = FunctionReturn<typeof functions.totalValue>

export type UnderlyingParams = FunctionArguments<typeof functions.underlying>
export type UnderlyingReturn = FunctionReturn<typeof functions.underlying>

export type UnderlyingBalanceParams = FunctionArguments<typeof functions.underlyingBalance>
export type UnderlyingBalanceReturn = FunctionReturn<typeof functions.underlyingBalance>

export type UnderlyingPriceOracleParams = FunctionArguments<typeof functions.underlyingPriceOracle>
export type UnderlyingPriceOracleReturn = FunctionReturn<typeof functions.underlyingPriceOracle>

export type UnderlyingRiskValueParams = FunctionArguments<typeof functions.underlyingRiskValue>
export type UnderlyingRiskValueReturn = FunctionReturn<typeof functions.underlyingRiskValue>

export type UnderlyingRiskWeightParams = FunctionArguments<typeof functions.underlyingRiskWeight>
export type UnderlyingRiskWeightReturn = FunctionReturn<typeof functions.underlyingRiskWeight>

export type UnderlyingTotalRiskValueParams = FunctionArguments<typeof functions.underlyingTotalRiskValue>
export type UnderlyingTotalRiskValueReturn = FunctionReturn<typeof functions.underlyingTotalRiskValue>

export type UnderlyingTotalValueParams = FunctionArguments<typeof functions.underlyingTotalValue>
export type UnderlyingTotalValueReturn = FunctionReturn<typeof functions.underlyingTotalValue>

export type UnderlyingValueParams = FunctionArguments<typeof functions.underlyingValue>
export type UnderlyingValueReturn = FunctionReturn<typeof functions.underlyingValue>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

