import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    NewVault: event("0x4241302c393c713e690702c4a45a57e93cef59aa8c6e2358495853b3420551d8", "NewVault(address,address)", {"vault_address": indexed(p.address), "asset": indexed(p.address)}),
    UpdateProtocolFeeBps: event("0x678d2b2fe79c193f6c2c18d7515e339afcbd73fcfb360b1d0fbadae07342e051", "UpdateProtocolFeeBps(uint16,uint16)", {"old_fee_bps": p.uint16, "new_fee_bps": p.uint16}),
    UpdateProtocolFeeRecipient: event("0x6af4e38beb02e4b110090dd85c5adfb341e2278b905068773762fe4666e5db7a", "UpdateProtocolFeeRecipient(address,address)", {"old_fee_recipient": indexed(p.address), "new_fee_recipient": indexed(p.address)}),
    UpdateCustomProtocolFee: event("0x96d6cc624354ffe5a7207dc2dcc152e58e23ac8df9c96943f3cfb10ea4c140ac", "UpdateCustomProtocolFee(address,uint16)", {"vault": indexed(p.address), "new_custom_protocol_fee": p.uint16}),
    RemovedCustomProtocolFee: event("0x39612c4f13d7a058dece05cf6730e3322fd9a11d6f055a5eacdde49191f45f1f", "RemovedCustomProtocolFee(address)", {"vault": indexed(p.address)}),
    FactoryShutdown: event("0xc643193a97fc0e18d69c95e1c034b91f51fa164ba8ea68dfb6dd98568b9bc96b", "FactoryShutdown()", {}),
    GovernanceTransferred: event("0x5f56bee8cffbe9a78652a74a60705edede02af10b0bbb888ca44b79a0d42ce80", "GovernanceTransferred(address,address)", {"previousGovernance": indexed(p.address), "newGovernance": indexed(p.address)}),
    UpdatePendingGovernance: event("0xa443b483867b0f9db5b03913474dd21935ac5ba70fa6c94e3423ba9be157c44b", "UpdatePendingGovernance(address)", {"newPendingGovernance": indexed(p.address)}),
}

export const functions = {
    deploy_new_vault: fun("0xb4aeee77", "deploy_new_vault(address,string,string,address,uint256)", {"asset": p.address, "name": p.string, "symbol": p.string, "role_manager": p.address, "profit_max_unlock_time": p.uint256}, p.address),
    vault_original: viewFun("0xf71bf70d", "vault_original()", {}, p.address),
    apiVersion: viewFun("0x25829410", "apiVersion()", {}, p.string),
    'protocol_fee_config()': viewFun("0x5153b199", "protocol_fee_config()", {}, {"_0": p.uint16, "_1": p.address}),
    'protocol_fee_config(address)': viewFun("0x6556424b", "protocol_fee_config(address)", {"vault": p.address}, {"_0": p.uint16, "_1": p.address}),
    use_custom_protocol_fee: viewFun("0xe94860d8", "use_custom_protocol_fee(address)", {"vault": p.address}, p.bool),
    set_protocol_fee_bps: fun("0x62fbf603", "set_protocol_fee_bps(uint16)", {"new_protocol_fee_bps": p.uint16}, ),
    set_protocol_fee_recipient: fun("0xf8ebccea", "set_protocol_fee_recipient(address)", {"new_protocol_fee_recipient": p.address}, ),
    set_custom_protocol_fee_bps: fun("0xb5a71e07", "set_custom_protocol_fee_bps(address,uint16)", {"vault": p.address, "new_custom_protocol_fee": p.uint16}, ),
    remove_custom_protocol_fee: fun("0x11a3a434", "remove_custom_protocol_fee(address)", {"vault": p.address}, ),
    shutdown_factory: fun("0x365adba6", "shutdown_factory()", {}, ),
    transferGovernance: fun("0xd38bfff4", "transferGovernance(address)", {"new_governance": p.address}, ),
    acceptGovernance: fun("0x238efcbc", "acceptGovernance()", {}, ),
    shutdown: viewFun("0xfc0e74d1", "shutdown()", {}, p.bool),
    governance: viewFun("0x5aa6e675", "governance()", {}, p.address),
    pendingGovernance: viewFun("0xf39c38a0", "pendingGovernance()", {}, p.address),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
}

export class Contract extends ContractBase {

    vault_original() {
        return this.eth_call(functions.vault_original, {})
    }

    apiVersion() {
        return this.eth_call(functions.apiVersion, {})
    }

    'protocol_fee_config()'() {
        return this.eth_call(functions['protocol_fee_config()'], {})
    }

    'protocol_fee_config(address)'(vault: Protocol_fee_configParams_1["vault"]) {
        return this.eth_call(functions['protocol_fee_config(address)'], {vault})
    }

    use_custom_protocol_fee(vault: Use_custom_protocol_feeParams["vault"]) {
        return this.eth_call(functions.use_custom_protocol_fee, {vault})
    }

    shutdown() {
        return this.eth_call(functions.shutdown, {})
    }

    governance() {
        return this.eth_call(functions.governance, {})
    }

    pendingGovernance() {
        return this.eth_call(functions.pendingGovernance, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }
}

/// Event types
export type NewVaultEventArgs = EParams<typeof events.NewVault>
export type UpdateProtocolFeeBpsEventArgs = EParams<typeof events.UpdateProtocolFeeBps>
export type UpdateProtocolFeeRecipientEventArgs = EParams<typeof events.UpdateProtocolFeeRecipient>
export type UpdateCustomProtocolFeeEventArgs = EParams<typeof events.UpdateCustomProtocolFee>
export type RemovedCustomProtocolFeeEventArgs = EParams<typeof events.RemovedCustomProtocolFee>
export type FactoryShutdownEventArgs = EParams<typeof events.FactoryShutdown>
export type GovernanceTransferredEventArgs = EParams<typeof events.GovernanceTransferred>
export type UpdatePendingGovernanceEventArgs = EParams<typeof events.UpdatePendingGovernance>

/// Function types
export type Deploy_new_vaultParams = FunctionArguments<typeof functions.deploy_new_vault>
export type Deploy_new_vaultReturn = FunctionReturn<typeof functions.deploy_new_vault>

export type Vault_originalParams = FunctionArguments<typeof functions.vault_original>
export type Vault_originalReturn = FunctionReturn<typeof functions.vault_original>

export type ApiVersionParams = FunctionArguments<typeof functions.apiVersion>
export type ApiVersionReturn = FunctionReturn<typeof functions.apiVersion>

export type Protocol_fee_configParams_0 = FunctionArguments<typeof functions['protocol_fee_config()']>
export type Protocol_fee_configReturn_0 = FunctionReturn<typeof functions['protocol_fee_config()']>

export type Protocol_fee_configParams_1 = FunctionArguments<typeof functions['protocol_fee_config(address)']>
export type Protocol_fee_configReturn_1 = FunctionReturn<typeof functions['protocol_fee_config(address)']>

export type Use_custom_protocol_feeParams = FunctionArguments<typeof functions.use_custom_protocol_fee>
export type Use_custom_protocol_feeReturn = FunctionReturn<typeof functions.use_custom_protocol_fee>

export type Set_protocol_fee_bpsParams = FunctionArguments<typeof functions.set_protocol_fee_bps>
export type Set_protocol_fee_bpsReturn = FunctionReturn<typeof functions.set_protocol_fee_bps>

export type Set_protocol_fee_recipientParams = FunctionArguments<typeof functions.set_protocol_fee_recipient>
export type Set_protocol_fee_recipientReturn = FunctionReturn<typeof functions.set_protocol_fee_recipient>

export type Set_custom_protocol_fee_bpsParams = FunctionArguments<typeof functions.set_custom_protocol_fee_bps>
export type Set_custom_protocol_fee_bpsReturn = FunctionReturn<typeof functions.set_custom_protocol_fee_bps>

export type Remove_custom_protocol_feeParams = FunctionArguments<typeof functions.remove_custom_protocol_fee>
export type Remove_custom_protocol_feeReturn = FunctionReturn<typeof functions.remove_custom_protocol_fee>

export type Shutdown_factoryParams = FunctionArguments<typeof functions.shutdown_factory>
export type Shutdown_factoryReturn = FunctionReturn<typeof functions.shutdown_factory>

export type TransferGovernanceParams = FunctionArguments<typeof functions.transferGovernance>
export type TransferGovernanceReturn = FunctionReturn<typeof functions.transferGovernance>

export type AcceptGovernanceParams = FunctionArguments<typeof functions.acceptGovernance>
export type AcceptGovernanceReturn = FunctionReturn<typeof functions.acceptGovernance>

export type ShutdownParams = FunctionArguments<typeof functions.shutdown>
export type ShutdownReturn = FunctionReturn<typeof functions.shutdown>

export type GovernanceParams = FunctionArguments<typeof functions.governance>
export type GovernanceReturn = FunctionReturn<typeof functions.governance>

export type PendingGovernanceParams = FunctionArguments<typeof functions.pendingGovernance>
export type PendingGovernanceReturn = FunctionReturn<typeof functions.pendingGovernance>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

