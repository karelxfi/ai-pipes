import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AccountStatusCheck: event("0x889a4d4628b31342e420737e2aeb45387087570710d26239aa8a5f13d3e829d4", "AccountStatusCheck(address,address)", {"account": indexed(p.address), "controller": indexed(p.address)}),
    CallWithContext: event("0x6e9738e5aa38fe1517adbb480351ec386ece82947737b18badbcad1e911133ec", "CallWithContext(address,bytes19,address,address,bytes4)", {"caller": indexed(p.address), "onBehalfOfAddressPrefix": indexed(p.bytes19), "onBehalfOfAccount": p.address, "targetContract": indexed(p.address), "selector": p.bytes4}),
    CollateralStatus: event("0xf022705c827017c972043d1984cfddc7958c9f4685b4d9ce8bd68696f4381cd2", "CollateralStatus(address,address,bool)", {"account": indexed(p.address), "collateral": indexed(p.address), "enabled": p.bool}),
    ControllerStatus: event("0x9919d437ee612d4ec7bba88a7d9bc4fc36a0a23608ad6259252711a46b708af9", "ControllerStatus(address,address,bool)", {"account": indexed(p.address), "controller": indexed(p.address), "enabled": p.bool}),
    LockdownModeStatus: event("0xaf5120bc58372f0063d8362c9bba9070c462c07ae24c24082d080a426432798b", "LockdownModeStatus(bytes19,bool)", {"addressPrefix": indexed(p.bytes19), "enabled": p.bool}),
    NonceStatus: event("0x3b8510174a91acb36200f7427c1889f934941fd89ed86faf390749b4c2b46337", "NonceStatus(bytes19,uint256,uint256,uint256)", {"addressPrefix": indexed(p.bytes19), "nonceNamespace": indexed(p.uint256), "oldNonce": p.uint256, "newNonce": p.uint256}),
    NonceUsed: event("0xb0dcec731e48090736be6db10ad9f9581d0ec5fc0f1925a8e267b64b614b08d6", "NonceUsed(bytes19,uint256,uint256)", {"addressPrefix": indexed(p.bytes19), "nonceNamespace": indexed(p.uint256), "nonce": p.uint256}),
    OperatorStatus: event("0x7ba31654d8467e98b6bd4fc56ddde246de9ade831cf860c7ac695579aecb9564", "OperatorStatus(bytes19,address,uint256)", {"addressPrefix": indexed(p.bytes19), "operator": indexed(p.address), "accountOperatorAuthorized": p.uint256}),
    OwnerRegistered: event("0x67cb2734834e775d6db886bf16ac03d7273b290223ee5363354b385ec5b643b0", "OwnerRegistered(bytes19,address)", {"addressPrefix": indexed(p.bytes19), "owner": indexed(p.address)}),
    PermitDisabledModeStatus: event("0x6321df4e44267d425279195e7488fadba1a42d5cce9e84f596d5cf696f4449cd", "PermitDisabledModeStatus(bytes19,bool)", {"addressPrefix": indexed(p.bytes19), "enabled": p.bool}),
    VaultStatusCheck: event("0xaea973cfb51ea8ca328767d72f105b5b9d2360c65f5ac4110a2c4470434471c9", "VaultStatusCheck(address)", {"vault": indexed(p.address)}),
}

export const functions = {
    areChecksDeferred: viewFun("0x430292b3", "areChecksDeferred()", {}, p.bool),
    areChecksInProgress: viewFun("0xe21e537c", "areChecksInProgress()", {}, p.bool),
    batch: fun("0xc16ae7a4", "batch((address,address,uint256,bytes)[])", {"items": p.array(p.struct({"targetContract": p.address, "onBehalfOfAccount": p.address, "value": p.uint256, "data": p.bytes}))}, ),
    batchRevert: fun("0x7f5c92f3", "batchRevert((address,address,uint256,bytes)[])", {"items": p.array(p.struct({"targetContract": p.address, "onBehalfOfAccount": p.address, "value": p.uint256, "data": p.bytes}))}, ),
    batchSimulation: fun("0x7f17c377", "batchSimulation((address,address,uint256,bytes)[])", {"items": p.array(p.struct({"targetContract": p.address, "onBehalfOfAccount": p.address, "value": p.uint256, "data": p.bytes}))}, {"batchItemsResult": p.array(p.struct({"success": p.bool, "result": p.bytes})), "accountsStatusCheckResult": p.array(p.struct({"checkedAddress": p.address, "isValid": p.bool, "result": p.bytes})), "vaultsStatusCheckResult": p.array(p.struct({"checkedAddress": p.address, "isValid": p.bool, "result": p.bytes}))}),
    call: fun("0x1f8b5215", "call(address,address,uint256,bytes)", {"targetContract": p.address, "onBehalfOfAccount": p.address, "value": p.uint256, "data": p.bytes}, p.bytes),
    controlCollateral: fun("0xb9b70ff5", "controlCollateral(address,address,uint256,bytes)", {"targetCollateral": p.address, "onBehalfOfAccount": p.address, "value": p.uint256, "data": p.bytes}, p.bytes),
    disableCollateral: fun("0xe920e8e0", "disableCollateral(address,address)", {"account": p.address, "vault": p.address}, ),
    disableController: fun("0xf4fc3570", "disableController(address)", {"account": p.address}, ),
    enableCollateral: fun("0xd44fee5a", "enableCollateral(address,address)", {"account": p.address, "vault": p.address}, ),
    enableController: fun("0xc368516c", "enableController(address,address)", {"account": p.address, "vault": p.address}, ),
    forgiveAccountStatusCheck: fun("0x10a75198", "forgiveAccountStatusCheck(address)", {"account": p.address}, ),
    forgiveVaultStatusCheck: fun("0xebf1ea86", "forgiveVaultStatusCheck()", {}, ),
    getAccountOwner: viewFun("0x442b172c", "getAccountOwner(address)", {"account": p.address}, p.address),
    getAddressPrefix: viewFun("0x506d8c92", "getAddressPrefix(address)", {"account": p.address}, p.bytes19),
    getCollaterals: viewFun("0xa4d25d1e", "getCollaterals(address)", {"account": p.address}, p.array(p.address)),
    getControllers: viewFun("0xfd6046d7", "getControllers(address)", {"account": p.address}, p.array(p.address)),
    getCurrentOnBehalfOfAccount: viewFun("0x18503a1e", "getCurrentOnBehalfOfAccount(address)", {"controllerToCheck": p.address}, {"onBehalfOfAccount": p.address, "controllerEnabled": p.bool}),
    getLastAccountStatusCheckTimestamp: viewFun("0xdf7c1384", "getLastAccountStatusCheckTimestamp(address)", {"account": p.address}, p.uint256),
    getNonce: viewFun("0x12d6c936", "getNonce(bytes19,uint256)", {"addressPrefix": p.bytes19, "nonceNamespace": p.uint256}, p.uint256),
    getOperator: viewFun("0xb03c130d", "getOperator(bytes19,address)", {"addressPrefix": p.bytes19, "operator": p.address}, p.uint256),
    getRawExecutionContext: viewFun("0x3a1a3a1d", "getRawExecutionContext()", {}, p.uint256),
    haveCommonOwner: viewFun("0xc760d921", "haveCommonOwner(address,address)", {"account": p.address, "otherAccount": p.address}, p.bool),
    isAccountOperatorAuthorized: viewFun("0x1647292a", "isAccountOperatorAuthorized(address,address)", {"account": p.address, "operator": p.address}, p.bool),
    isAccountStatusCheckDeferred: viewFun("0x42e53499", "isAccountStatusCheckDeferred(address)", {"account": p.address}, p.bool),
    isCollateralEnabled: viewFun("0x9e716d58", "isCollateralEnabled(address,address)", {"account": p.address, "vault": p.address}, p.bool),
    isControlCollateralInProgress: viewFun("0x863789d7", "isControlCollateralInProgress()", {}, p.bool),
    isControllerEnabled: viewFun("0x47cfdac4", "isControllerEnabled(address,address)", {"account": p.address, "vault": p.address}, p.bool),
    isLockdownMode: viewFun("0x3b10f3ef", "isLockdownMode(bytes19)", {"addressPrefix": p.bytes19}, p.bool),
    isOperatorAuthenticated: viewFun("0x3b2416be", "isOperatorAuthenticated()", {}, p.bool),
    isPermitDisabledMode: viewFun("0xcb29955a", "isPermitDisabledMode(bytes19)", {"addressPrefix": p.bytes19}, p.bool),
    isSimulationInProgress: viewFun("0x92d2fc01", "isSimulationInProgress()", {}, p.bool),
    isVaultStatusCheckDeferred: viewFun("0xcdd8ea78", "isVaultStatusCheckDeferred(address)", {"vault": p.address}, p.bool),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    permit: fun("0x5bedd1cd", "permit(address,address,uint256,uint256,uint256,uint256,bytes,bytes)", {"signer": p.address, "sender": p.address, "nonceNamespace": p.uint256, "nonce": p.uint256, "deadline": p.uint256, "value": p.uint256, "data": p.bytes, "signature": p.bytes}, ),
    reorderCollaterals: fun("0x642ea23f", "reorderCollaterals(address,uint8,uint8)", {"account": p.address, "index1": p.uint8, "index2": p.uint8}, ),
    requireAccountAndVaultStatusCheck: fun("0x30f31667", "requireAccountAndVaultStatusCheck(address)", {"account": p.address}, ),
    requireAccountStatusCheck: fun("0x46591032", "requireAccountStatusCheck(address)", {"account": p.address}, ),
    requireVaultStatusCheck: fun("0xa37d54af", "requireVaultStatusCheck()", {}, ),
    setAccountOperator: fun("0x9f5c462a", "setAccountOperator(address,address,bool)", {"account": p.address, "operator": p.address, "authorized": p.bool}, ),
    setLockdownMode: fun("0x129d21a0", "setLockdownMode(bytes19,bool)", {"addressPrefix": p.bytes19, "enabled": p.bool}, ),
    setNonce: fun("0xa829aaf5", "setNonce(bytes19,uint256,uint256)", {"addressPrefix": p.bytes19, "nonceNamespace": p.uint256, "nonce": p.uint256}, ),
    setOperator: fun("0xc14c11bf", "setOperator(bytes19,address,uint256)", {"addressPrefix": p.bytes19, "operator": p.address, "operatorBitField": p.uint256}, ),
    setPermitDisabledMode: fun("0x116d0e93", "setPermitDisabledMode(bytes19,bool)", {"addressPrefix": p.bytes19, "enabled": p.bool}, ),
}

export class Contract extends ContractBase {

    areChecksDeferred() {
        return this.eth_call(functions.areChecksDeferred, {})
    }

    areChecksInProgress() {
        return this.eth_call(functions.areChecksInProgress, {})
    }

    getAccountOwner(account: GetAccountOwnerParams["account"]) {
        return this.eth_call(functions.getAccountOwner, {account})
    }

    getAddressPrefix(account: GetAddressPrefixParams["account"]) {
        return this.eth_call(functions.getAddressPrefix, {account})
    }

    getCollaterals(account: GetCollateralsParams["account"]) {
        return this.eth_call(functions.getCollaterals, {account})
    }

    getControllers(account: GetControllersParams["account"]) {
        return this.eth_call(functions.getControllers, {account})
    }

    getCurrentOnBehalfOfAccount(controllerToCheck: GetCurrentOnBehalfOfAccountParams["controllerToCheck"]) {
        return this.eth_call(functions.getCurrentOnBehalfOfAccount, {controllerToCheck})
    }

    getLastAccountStatusCheckTimestamp(account: GetLastAccountStatusCheckTimestampParams["account"]) {
        return this.eth_call(functions.getLastAccountStatusCheckTimestamp, {account})
    }

    getNonce(addressPrefix: GetNonceParams["addressPrefix"], nonceNamespace: GetNonceParams["nonceNamespace"]) {
        return this.eth_call(functions.getNonce, {addressPrefix, nonceNamespace})
    }

    getOperator(addressPrefix: GetOperatorParams["addressPrefix"], operator: GetOperatorParams["operator"]) {
        return this.eth_call(functions.getOperator, {addressPrefix, operator})
    }

    getRawExecutionContext() {
        return this.eth_call(functions.getRawExecutionContext, {})
    }

    haveCommonOwner(account: HaveCommonOwnerParams["account"], otherAccount: HaveCommonOwnerParams["otherAccount"]) {
        return this.eth_call(functions.haveCommonOwner, {account, otherAccount})
    }

    isAccountOperatorAuthorized(account: IsAccountOperatorAuthorizedParams["account"], operator: IsAccountOperatorAuthorizedParams["operator"]) {
        return this.eth_call(functions.isAccountOperatorAuthorized, {account, operator})
    }

    isAccountStatusCheckDeferred(account: IsAccountStatusCheckDeferredParams["account"]) {
        return this.eth_call(functions.isAccountStatusCheckDeferred, {account})
    }

    isCollateralEnabled(account: IsCollateralEnabledParams["account"], vault: IsCollateralEnabledParams["vault"]) {
        return this.eth_call(functions.isCollateralEnabled, {account, vault})
    }

    isControlCollateralInProgress() {
        return this.eth_call(functions.isControlCollateralInProgress, {})
    }

    isControllerEnabled(account: IsControllerEnabledParams["account"], vault: IsControllerEnabledParams["vault"]) {
        return this.eth_call(functions.isControllerEnabled, {account, vault})
    }

    isLockdownMode(addressPrefix: IsLockdownModeParams["addressPrefix"]) {
        return this.eth_call(functions.isLockdownMode, {addressPrefix})
    }

    isOperatorAuthenticated() {
        return this.eth_call(functions.isOperatorAuthenticated, {})
    }

    isPermitDisabledMode(addressPrefix: IsPermitDisabledModeParams["addressPrefix"]) {
        return this.eth_call(functions.isPermitDisabledMode, {addressPrefix})
    }

    isSimulationInProgress() {
        return this.eth_call(functions.isSimulationInProgress, {})
    }

    isVaultStatusCheckDeferred(vault: IsVaultStatusCheckDeferredParams["vault"]) {
        return this.eth_call(functions.isVaultStatusCheckDeferred, {vault})
    }

    name() {
        return this.eth_call(functions.name, {})
    }
}

/// Event types
export type AccountStatusCheckEventArgs = EParams<typeof events.AccountStatusCheck>
export type CallWithContextEventArgs = EParams<typeof events.CallWithContext>
export type CollateralStatusEventArgs = EParams<typeof events.CollateralStatus>
export type ControllerStatusEventArgs = EParams<typeof events.ControllerStatus>
export type LockdownModeStatusEventArgs = EParams<typeof events.LockdownModeStatus>
export type NonceStatusEventArgs = EParams<typeof events.NonceStatus>
export type NonceUsedEventArgs = EParams<typeof events.NonceUsed>
export type OperatorStatusEventArgs = EParams<typeof events.OperatorStatus>
export type OwnerRegisteredEventArgs = EParams<typeof events.OwnerRegistered>
export type PermitDisabledModeStatusEventArgs = EParams<typeof events.PermitDisabledModeStatus>
export type VaultStatusCheckEventArgs = EParams<typeof events.VaultStatusCheck>

/// Function types
export type AreChecksDeferredParams = FunctionArguments<typeof functions.areChecksDeferred>
export type AreChecksDeferredReturn = FunctionReturn<typeof functions.areChecksDeferred>

export type AreChecksInProgressParams = FunctionArguments<typeof functions.areChecksInProgress>
export type AreChecksInProgressReturn = FunctionReturn<typeof functions.areChecksInProgress>

export type BatchParams = FunctionArguments<typeof functions.batch>
export type BatchReturn = FunctionReturn<typeof functions.batch>

export type BatchRevertParams = FunctionArguments<typeof functions.batchRevert>
export type BatchRevertReturn = FunctionReturn<typeof functions.batchRevert>

export type BatchSimulationParams = FunctionArguments<typeof functions.batchSimulation>
export type BatchSimulationReturn = FunctionReturn<typeof functions.batchSimulation>

export type CallParams = FunctionArguments<typeof functions.call>
export type CallReturn = FunctionReturn<typeof functions.call>

export type ControlCollateralParams = FunctionArguments<typeof functions.controlCollateral>
export type ControlCollateralReturn = FunctionReturn<typeof functions.controlCollateral>

export type DisableCollateralParams = FunctionArguments<typeof functions.disableCollateral>
export type DisableCollateralReturn = FunctionReturn<typeof functions.disableCollateral>

export type DisableControllerParams = FunctionArguments<typeof functions.disableController>
export type DisableControllerReturn = FunctionReturn<typeof functions.disableController>

export type EnableCollateralParams = FunctionArguments<typeof functions.enableCollateral>
export type EnableCollateralReturn = FunctionReturn<typeof functions.enableCollateral>

export type EnableControllerParams = FunctionArguments<typeof functions.enableController>
export type EnableControllerReturn = FunctionReturn<typeof functions.enableController>

export type ForgiveAccountStatusCheckParams = FunctionArguments<typeof functions.forgiveAccountStatusCheck>
export type ForgiveAccountStatusCheckReturn = FunctionReturn<typeof functions.forgiveAccountStatusCheck>

export type ForgiveVaultStatusCheckParams = FunctionArguments<typeof functions.forgiveVaultStatusCheck>
export type ForgiveVaultStatusCheckReturn = FunctionReturn<typeof functions.forgiveVaultStatusCheck>

export type GetAccountOwnerParams = FunctionArguments<typeof functions.getAccountOwner>
export type GetAccountOwnerReturn = FunctionReturn<typeof functions.getAccountOwner>

export type GetAddressPrefixParams = FunctionArguments<typeof functions.getAddressPrefix>
export type GetAddressPrefixReturn = FunctionReturn<typeof functions.getAddressPrefix>

export type GetCollateralsParams = FunctionArguments<typeof functions.getCollaterals>
export type GetCollateralsReturn = FunctionReturn<typeof functions.getCollaterals>

export type GetControllersParams = FunctionArguments<typeof functions.getControllers>
export type GetControllersReturn = FunctionReturn<typeof functions.getControllers>

export type GetCurrentOnBehalfOfAccountParams = FunctionArguments<typeof functions.getCurrentOnBehalfOfAccount>
export type GetCurrentOnBehalfOfAccountReturn = FunctionReturn<typeof functions.getCurrentOnBehalfOfAccount>

export type GetLastAccountStatusCheckTimestampParams = FunctionArguments<typeof functions.getLastAccountStatusCheckTimestamp>
export type GetLastAccountStatusCheckTimestampReturn = FunctionReturn<typeof functions.getLastAccountStatusCheckTimestamp>

export type GetNonceParams = FunctionArguments<typeof functions.getNonce>
export type GetNonceReturn = FunctionReturn<typeof functions.getNonce>

export type GetOperatorParams = FunctionArguments<typeof functions.getOperator>
export type GetOperatorReturn = FunctionReturn<typeof functions.getOperator>

export type GetRawExecutionContextParams = FunctionArguments<typeof functions.getRawExecutionContext>
export type GetRawExecutionContextReturn = FunctionReturn<typeof functions.getRawExecutionContext>

export type HaveCommonOwnerParams = FunctionArguments<typeof functions.haveCommonOwner>
export type HaveCommonOwnerReturn = FunctionReturn<typeof functions.haveCommonOwner>

export type IsAccountOperatorAuthorizedParams = FunctionArguments<typeof functions.isAccountOperatorAuthorized>
export type IsAccountOperatorAuthorizedReturn = FunctionReturn<typeof functions.isAccountOperatorAuthorized>

export type IsAccountStatusCheckDeferredParams = FunctionArguments<typeof functions.isAccountStatusCheckDeferred>
export type IsAccountStatusCheckDeferredReturn = FunctionReturn<typeof functions.isAccountStatusCheckDeferred>

export type IsCollateralEnabledParams = FunctionArguments<typeof functions.isCollateralEnabled>
export type IsCollateralEnabledReturn = FunctionReturn<typeof functions.isCollateralEnabled>

export type IsControlCollateralInProgressParams = FunctionArguments<typeof functions.isControlCollateralInProgress>
export type IsControlCollateralInProgressReturn = FunctionReturn<typeof functions.isControlCollateralInProgress>

export type IsControllerEnabledParams = FunctionArguments<typeof functions.isControllerEnabled>
export type IsControllerEnabledReturn = FunctionReturn<typeof functions.isControllerEnabled>

export type IsLockdownModeParams = FunctionArguments<typeof functions.isLockdownMode>
export type IsLockdownModeReturn = FunctionReturn<typeof functions.isLockdownMode>

export type IsOperatorAuthenticatedParams = FunctionArguments<typeof functions.isOperatorAuthenticated>
export type IsOperatorAuthenticatedReturn = FunctionReturn<typeof functions.isOperatorAuthenticated>

export type IsPermitDisabledModeParams = FunctionArguments<typeof functions.isPermitDisabledMode>
export type IsPermitDisabledModeReturn = FunctionReturn<typeof functions.isPermitDisabledMode>

export type IsSimulationInProgressParams = FunctionArguments<typeof functions.isSimulationInProgress>
export type IsSimulationInProgressReturn = FunctionReturn<typeof functions.isSimulationInProgress>

export type IsVaultStatusCheckDeferredParams = FunctionArguments<typeof functions.isVaultStatusCheckDeferred>
export type IsVaultStatusCheckDeferredReturn = FunctionReturn<typeof functions.isVaultStatusCheckDeferred>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type ReorderCollateralsParams = FunctionArguments<typeof functions.reorderCollaterals>
export type ReorderCollateralsReturn = FunctionReturn<typeof functions.reorderCollaterals>

export type RequireAccountAndVaultStatusCheckParams = FunctionArguments<typeof functions.requireAccountAndVaultStatusCheck>
export type RequireAccountAndVaultStatusCheckReturn = FunctionReturn<typeof functions.requireAccountAndVaultStatusCheck>

export type RequireAccountStatusCheckParams = FunctionArguments<typeof functions.requireAccountStatusCheck>
export type RequireAccountStatusCheckReturn = FunctionReturn<typeof functions.requireAccountStatusCheck>

export type RequireVaultStatusCheckParams = FunctionArguments<typeof functions.requireVaultStatusCheck>
export type RequireVaultStatusCheckReturn = FunctionReturn<typeof functions.requireVaultStatusCheck>

export type SetAccountOperatorParams = FunctionArguments<typeof functions.setAccountOperator>
export type SetAccountOperatorReturn = FunctionReturn<typeof functions.setAccountOperator>

export type SetLockdownModeParams = FunctionArguments<typeof functions.setLockdownMode>
export type SetLockdownModeReturn = FunctionReturn<typeof functions.setLockdownMode>

export type SetNonceParams = FunctionArguments<typeof functions.setNonce>
export type SetNonceReturn = FunctionReturn<typeof functions.setNonce>

export type SetOperatorParams = FunctionArguments<typeof functions.setOperator>
export type SetOperatorReturn = FunctionReturn<typeof functions.setOperator>

export type SetPermitDisabledModeParams = FunctionArguments<typeof functions.setPermitDisabledMode>
export type SetPermitDisabledModeReturn = FunctionReturn<typeof functions.setPermitDisabledMode>

