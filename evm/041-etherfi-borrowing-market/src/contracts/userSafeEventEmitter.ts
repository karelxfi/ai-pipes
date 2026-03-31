import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AddCollateralToDebtManager: event("0x81e0ff3fa364aaabd086821a1db32c82681058979b797ec21dee8a3968bd5514", "AddCollateralToDebtManager(address,address,uint256)", {"userSafe": indexed(p.address), "token": indexed(p.address), "amount": p.uint256}),
    BorrowFromDebtManager: event("0x21d1650167ed1c02dff46937df9f3ff93a530effcb4204d61ed8c07f77d968aa", "BorrowFromDebtManager(address,address,uint256)", {"userSafe": indexed(p.address), "token": indexed(p.address), "amount": p.uint256}),
    Cashback: event("0xc2f328aca2253ffbf4bdb01552106555dbedd5b21bc86578abbbb849d73613a6", "Cashback(address,uint256,address,uint256,uint256,bool)", {"userSafe": indexed(p.address), "spendingInUsd": p.uint256, "cashbackToken": indexed(p.address), "cashbackAmount": p.uint256, "cashbackInUsd": p.uint256, "paid": p.bool}),
    CloseAccountWithDebtManager: event("0xac0adef44aa47f5f6b484d90f1ae23650520828a33788b9a7ff14b3bd0f4ace6", "CloseAccountWithDebtManager(address)", {"userSafe": indexed(p.address)}),
    DefaultAdminDelayChangeCanceled: event("0x2b1fa2edafe6f7b9e97c1a9e0c3660e645beb2dcaa2d45bdbf9beaf5472e1ec5", "DefaultAdminDelayChangeCanceled()", {}),
    DefaultAdminDelayChangeScheduled: event("0xf1038c18cf84a56e432fdbfaf746924b7ea511dfe03a6506a0ceba4888788d9b", "DefaultAdminDelayChangeScheduled(uint48,uint48)", {"newDelay": p.uint48, "effectSchedule": p.uint48}),
    DefaultAdminTransferCanceled: event("0x8886ebfc4259abdbc16601dd8fb5678e54878f47b3c34836cfc51154a9605109", "DefaultAdminTransferCanceled()", {}),
    DefaultAdminTransferScheduled: event("0x3377dc44241e779dd06afab5b788a35ca5f3b778836e2990bdb26a2a4b2e5ed6", "DefaultAdminTransferScheduled(address,uint48)", {"newAdmin": indexed(p.address), "acceptSchedule": p.uint48}),
    IncomingOwnerSet: event("0xddfa09dda282f5602dd7290af8f3b0fb0a105e6ce6bef854e4be9b9a47ded548", "IncomingOwnerSet(address,(address,uint256,uint256),uint256)", {"userSafe": indexed(p.address), "incomingOwner": p.struct({"ethAddr": p.address, "x": p.uint256, "y": p.uint256}), "incomingOwnerStartTime": p.uint256}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    IsRecoveryActiveSet: event("0xebbadbd2b46ffa1d6b63276ae5ec8d9b649f3262965a856ddff9d289fbb02b2f", "IsRecoveryActiveSet(address,bool)", {"userSafe": indexed(p.address), "isActive": p.bool}),
    ModeSet: event("0xf6eabb9d9f10b3f417c46c38955eb7aea4886a913b32069a91a2af002dffee8d", "ModeSet(address,uint8,uint8,uint256)", {"userSafe": indexed(p.address), "prevMode": p.uint8, "newMode": p.uint8, "incomingModeStartTime": p.uint256}),
    OwnerSet: event("0xc38e47511d412fb28c0f6fbedfffeaeb3fd8509a2d2ab01cf7c6085ba8303f3e", "OwnerSet(address,(address,uint256,uint256),(address,uint256,uint256))", {"userSafe": indexed(p.address), "oldOwner": p.struct({"ethAddr": p.address, "x": p.uint256, "y": p.uint256}), "newOwner": p.struct({"ethAddr": p.address, "x": p.uint256, "y": p.uint256})}),
    PendingCashbackCleared: event("0xb2304e3d75f4667ae0ecb838e9dda697e12be232df354a420abc4f76639026ca", "PendingCashbackCleared(address,address,uint256,uint256)", {"userSafe": indexed(p.address), "cashbackToken": indexed(p.address), "cashbackAmount": p.uint256, "cashbackInUsd": p.uint256}),
    RepayDebtManager: event("0x774a98d5aacabc2dff76b4531406533e8f7e7fe933646d221fdd9f088ee1b278", "RepayDebtManager(address,address,uint256,uint256)", {"userSafe": indexed(p.address), "token": indexed(p.address), "debtAmount": p.uint256, "debtAmountInUsd": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Spend: event("0xe70f33131caa91c15ec116944772ba79bcc4cd6501cdfa178d66f903a796759a", "Spend(address,address,uint256,uint256,uint8)", {"userSafe": indexed(p.address), "token": indexed(p.address), "amount": p.uint256, "amountInUsd": p.uint256, "mode": p.uint8}),
    SpendingLimitChanged: event("0x386efab796ecb0c216c9a39430a74f99716e683b28c915533174087017fe5d2d", "SpendingLimitChanged(address,(uint256,uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,int256),(uint256,uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,int256))", {"userSafe": indexed(p.address), "oldLimit": p.struct({"dailyLimit": p.uint256, "monthlyLimit": p.uint256, "spentToday": p.uint256, "spentThisMonth": p.uint256, "newDailyLimit": p.uint256, "newMonthlyLimit": p.uint256, "dailyRenewalTimestamp": p.uint64, "monthlyRenewalTimestamp": p.uint64, "dailyLimitChangeActivationTime": p.uint64, "monthlyLimitChangeActivationTime": p.uint64, "timezoneOffset": p.int256}), "newLimit": p.struct({"dailyLimit": p.uint256, "monthlyLimit": p.uint256, "spentToday": p.uint256, "spentThisMonth": p.uint256, "newDailyLimit": p.uint256, "newMonthlyLimit": p.uint256, "dailyRenewalTimestamp": p.uint64, "monthlyRenewalTimestamp": p.uint64, "dailyLimitChangeActivationTime": p.uint64, "monthlyLimitChangeActivationTime": p.uint64, "timezoneOffset": p.int256})}),
    Swap: event("0x5380cf97d8f645d3c4896da60c053458dca03a3a31cec642ac80e1ddf0d8d02a", "Swap(address,address,uint256,address,uint256)", {"userSafe": indexed(p.address), "inputToken": indexed(p.address), "inputAmount": p.uint256, "outputToken": indexed(p.address), "outputAmount": p.uint256}),
    SwapTransferForSpending: event("0x5d12c89b7dea72acec75889f14c8838814da11b6dc36e136a394f4d38408be57", "SwapTransferForSpending(address,address,uint256,address,uint256)", {"userSafe": indexed(p.address), "inputToken": indexed(p.address), "inputAmount": p.uint256, "outputToken": indexed(p.address), "outputTokenSent": p.uint256}),
    TransferForSpending: event("0xa42a775630de76891a4f30bfea228f23d1b2001db6cec2954b40068672f38b09", "TransferForSpending(address,address,uint256)", {"userSafe": indexed(p.address), "token": indexed(p.address), "amount": p.uint256}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", "Upgraded(address)", {"implementation": indexed(p.address)}),
    UserRecoverySignerSet: event("0xa5837a290a293541363eb6afb8994660a85d78f5765c61b9bb6d48a69b0c6e43", "UserRecoverySignerSet(address,address,address)", {"userSafe": indexed(p.address), "oldRecoverySigner": p.address, "newRecoverySigner": p.address}),
    WithdrawCollateralFromDebtManager: event("0x60dbeb9e841e894cb73620c82c17cdd4ad072cf296b804da36f5fa458ff94dc6", "WithdrawCollateralFromDebtManager(address,address,uint256)", {"userSafe": indexed(p.address), "token": indexed(p.address), "amount": p.uint256}),
    WithdrawalAmountUpdated: event("0xa240c4826a4f75edb281475f9abb4af98d8566f787e9d9752267a2f0228d9743", "WithdrawalAmountUpdated(address,address,uint256)", {"userSafe": indexed(p.address), "token": indexed(p.address), "amount": p.uint256}),
    WithdrawalCancelled: event("0x50efeea714c351006c4fa7822fb73539a491c1d587e149b8dc5bf4c1a7056066", "WithdrawalCancelled(address,address[],uint256[],address)", {"userSafe": indexed(p.address), "tokens": p.array(p.address), "amounts": p.array(p.uint256), "recipient": indexed(p.address)}),
    WithdrawalProcessed: event("0x5eed621d1eddc71f0ca04e002e24088109cd3fd594c7af230edbf9e73d616047", "WithdrawalProcessed(address,address[],uint256[],address)", {"userSafe": indexed(p.address), "tokens": p.array(p.address), "amounts": p.array(p.uint256), "recipient": indexed(p.address)}),
    WithdrawalRequested: event("0xc48955aee858164993e89d10d9ad1aaf03010012434dac8ebae005105b1d4d6d", "WithdrawalRequested(address,address[],uint256[],address,uint256)", {"userSafe": indexed(p.address), "tokens": p.array(p.address), "amounts": p.array(p.uint256), "recipient": indexed(p.address), "finalizeTimestamp": p.uint256}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    UPGRADE_INTERFACE_VERSION: viewFun("0xad3cb1cc", "UPGRADE_INTERFACE_VERSION()", {}, p.string),
    acceptDefaultAdminTransfer: fun("0xcefc1429", "acceptDefaultAdminTransfer()", {}, ),
    beginDefaultAdminTransfer: fun("0x634e93da", "beginDefaultAdminTransfer(address)", {"newAdmin": p.address}, ),
    cancelDefaultAdminTransfer: fun("0xd602b9fd", "cancelDefaultAdminTransfer()", {}, ),
    cashDataProvider: viewFun("0xc8b318c4", "cashDataProvider()", {}, p.address),
    changeDefaultAdminDelay: fun("0x649a5ec7", "changeDefaultAdminDelay(uint48)", {"newDelay": p.uint48}, ),
    defaultAdmin: viewFun("0x84ef8ffc", "defaultAdmin()", {}, p.address),
    defaultAdminDelay: viewFun("0xcc8463c8", "defaultAdminDelay()", {}, p.uint48),
    defaultAdminDelayIncreaseWait: viewFun("0x022d63fb", "defaultAdminDelayIncreaseWait()", {}, p.uint48),
    emitAddCollateralToDebtManager: fun("0x651c7bcf", "emitAddCollateralToDebtManager(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    emitBorrowFromDebtManager: fun("0x96c98038", "emitBorrowFromDebtManager(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    emitCashbackEvent: fun("0x8d36bbb0", "emitCashbackEvent(uint256,address,uint256,uint256,bool)", {"spendingInUsd": p.uint256, "cashbackToken": p.address, "cashbackAmount": p.uint256, "cashbackInUsd": p.uint256, "paid": p.bool}, ),
    emitCloseAccountWithDebtManager: fun("0xa86e603d", "emitCloseAccountWithDebtManager()", {}, ),
    emitIncomingOwnerSet: fun("0x8abaf3e4", "emitIncomingOwnerSet((address,uint256,uint256),uint256)", {"incomingOwner": p.struct({"ethAddr": p.address, "x": p.uint256, "y": p.uint256}), "incomingOwnerStartTime": p.uint256}, ),
    emitIsRecoveryActiveSet: fun("0xce031517", "emitIsRecoveryActiveSet(bool)", {"isActive": p.bool}, ),
    emitOwnerSet: fun("0x64c880fb", "emitOwnerSet((address,uint256,uint256),(address,uint256,uint256))", {"oldOwner": p.struct({"ethAddr": p.address, "x": p.uint256, "y": p.uint256}), "newOwner": p.struct({"ethAddr": p.address, "x": p.uint256, "y": p.uint256})}, ),
    emitPendingCashbackClearedEvent: fun("0x0c158d5a", "emitPendingCashbackClearedEvent(address,uint256,uint256)", {"cashbackToken": p.address, "cashbackAmount": p.uint256, "cashbackInUsd": p.uint256}, ),
    emitRepayDebtManager: fun("0x012638af", "emitRepayDebtManager(address,uint256,uint256)", {"token": p.address, "amount": p.uint256, "amountInUsd": p.uint256}, ),
    emitSetMode: fun("0x1031042b", "emitSetMode(uint8,uint8,uint256)", {"prevMode": p.uint8, "newMode": p.uint8, "incomingModeStartTime": p.uint256}, ),
    emitSpend: fun("0x4e0fa672", "emitSpend(address,uint256,uint256,uint8)", {"token": p.address, "amount": p.uint256, "amountInUsd": p.uint256, "mode": p.uint8}, ),
    emitSpendingLimitChanged: fun("0x47f23651", "emitSpendingLimitChanged((uint256,uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,int256),(uint256,uint256,uint256,uint256,uint256,uint256,uint64,uint64,uint64,uint64,int256))", {"oldLimit": p.struct({"dailyLimit": p.uint256, "monthlyLimit": p.uint256, "spentToday": p.uint256, "spentThisMonth": p.uint256, "newDailyLimit": p.uint256, "newMonthlyLimit": p.uint256, "dailyRenewalTimestamp": p.uint64, "monthlyRenewalTimestamp": p.uint64, "dailyLimitChangeActivationTime": p.uint64, "monthlyLimitChangeActivationTime": p.uint64, "timezoneOffset": p.int256}), "newLimit": p.struct({"dailyLimit": p.uint256, "monthlyLimit": p.uint256, "spentToday": p.uint256, "spentThisMonth": p.uint256, "newDailyLimit": p.uint256, "newMonthlyLimit": p.uint256, "dailyRenewalTimestamp": p.uint64, "monthlyRenewalTimestamp": p.uint64, "dailyLimitChangeActivationTime": p.uint64, "monthlyLimitChangeActivationTime": p.uint64, "timezoneOffset": p.int256})}, ),
    emitSwap: fun("0x2749dac3", "emitSwap(address,uint256,address,uint256)", {"inputToken": p.address, "inputAmount": p.uint256, "outputToken": p.address, "outputAmount": p.uint256}, ),
    emitSwapTransferForSpending: fun("0x26860d43", "emitSwapTransferForSpending(address,uint256,address,uint256)", {"inputToken": p.address, "inputAmount": p.uint256, "outputToken": p.address, "outputTokenSent": p.uint256}, ),
    emitTransferForSpending: fun("0x141105a4", "emitTransferForSpending(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    emitUserRecoverySignerSet: fun("0x95494385", "emitUserRecoverySignerSet(address,address)", {"oldRecoverySigner": p.address, "newRecoverySigner": p.address}, ),
    emitWithdrawCollateralFromDebtManager: fun("0x2c618a59", "emitWithdrawCollateralFromDebtManager(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    emitWithdrawalAmountUpdated: fun("0x8f14054b", "emitWithdrawalAmountUpdated(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    emitWithdrawalCancelled: fun("0x4cd8092b", "emitWithdrawalCancelled(address[],uint256[],address)", {"tokens": p.array(p.address), "amounts": p.array(p.uint256), "recipient": p.address}, ),
    emitWithdrawalProcessed: fun("0xccf330cc", "emitWithdrawalProcessed(address[],uint256[],address)", {"tokens": p.array(p.address), "amounts": p.array(p.uint256), "recipient": p.address}, ),
    emitWithdrawalRequested: fun("0x17fefedd", "emitWithdrawalRequested(address[],uint256[],address,uint256)", {"tokens": p.array(p.address), "amounts": p.array(p.uint256), "recipient": p.address, "finalizeTimestamp": p.uint256}, ),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0x485cc955", "initialize(address,address)", {"owner": p.address, "_cashDataProvider": p.address}, ),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pendingDefaultAdmin: viewFun("0xcf6eefb7", "pendingDefaultAdmin()", {}, {"newAdmin": p.address, "schedule": p.uint48}),
    pendingDefaultAdminDelay: viewFun("0xa1eda53c", "pendingDefaultAdminDelay()", {}, {"newDelay": p.uint48, "schedule": p.uint48}),
    proxiableUUID: viewFun("0x52d1902d", "proxiableUUID()", {}, p.bytes32),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    rollbackDefaultAdminDelay: fun("0x0aa6220b", "rollbackDefaultAdminDelay()", {}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    upgradeToAndCall: fun("0x4f1ef286", "upgradeToAndCall(address,bytes)", {"newImplementation": p.address, "data": p.bytes}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    UPGRADE_INTERFACE_VERSION() {
        return this.eth_call(functions.UPGRADE_INTERFACE_VERSION, {})
    }

    cashDataProvider() {
        return this.eth_call(functions.cashDataProvider, {})
    }

    defaultAdmin() {
        return this.eth_call(functions.defaultAdmin, {})
    }

    defaultAdminDelay() {
        return this.eth_call(functions.defaultAdminDelay, {})
    }

    defaultAdminDelayIncreaseWait() {
        return this.eth_call(functions.defaultAdminDelayIncreaseWait, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingDefaultAdmin() {
        return this.eth_call(functions.pendingDefaultAdmin, {})
    }

    pendingDefaultAdminDelay() {
        return this.eth_call(functions.pendingDefaultAdminDelay, {})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }
}

/// Event types
export type AddCollateralToDebtManagerEventArgs = EParams<typeof events.AddCollateralToDebtManager>
export type BorrowFromDebtManagerEventArgs = EParams<typeof events.BorrowFromDebtManager>
export type CashbackEventArgs = EParams<typeof events.Cashback>
export type CloseAccountWithDebtManagerEventArgs = EParams<typeof events.CloseAccountWithDebtManager>
export type DefaultAdminDelayChangeCanceledEventArgs = EParams<typeof events.DefaultAdminDelayChangeCanceled>
export type DefaultAdminDelayChangeScheduledEventArgs = EParams<typeof events.DefaultAdminDelayChangeScheduled>
export type DefaultAdminTransferCanceledEventArgs = EParams<typeof events.DefaultAdminTransferCanceled>
export type DefaultAdminTransferScheduledEventArgs = EParams<typeof events.DefaultAdminTransferScheduled>
export type IncomingOwnerSetEventArgs = EParams<typeof events.IncomingOwnerSet>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type IsRecoveryActiveSetEventArgs = EParams<typeof events.IsRecoveryActiveSet>
export type ModeSetEventArgs = EParams<typeof events.ModeSet>
export type OwnerSetEventArgs = EParams<typeof events.OwnerSet>
export type PendingCashbackClearedEventArgs = EParams<typeof events.PendingCashbackCleared>
export type RepayDebtManagerEventArgs = EParams<typeof events.RepayDebtManager>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type SpendEventArgs = EParams<typeof events.Spend>
export type SpendingLimitChangedEventArgs = EParams<typeof events.SpendingLimitChanged>
export type SwapEventArgs = EParams<typeof events.Swap>
export type SwapTransferForSpendingEventArgs = EParams<typeof events.SwapTransferForSpending>
export type TransferForSpendingEventArgs = EParams<typeof events.TransferForSpending>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type UserRecoverySignerSetEventArgs = EParams<typeof events.UserRecoverySignerSet>
export type WithdrawCollateralFromDebtManagerEventArgs = EParams<typeof events.WithdrawCollateralFromDebtManager>
export type WithdrawalAmountUpdatedEventArgs = EParams<typeof events.WithdrawalAmountUpdated>
export type WithdrawalCancelledEventArgs = EParams<typeof events.WithdrawalCancelled>
export type WithdrawalProcessedEventArgs = EParams<typeof events.WithdrawalProcessed>
export type WithdrawalRequestedEventArgs = EParams<typeof events.WithdrawalRequested>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type UPGRADE_INTERFACE_VERSIONParams = FunctionArguments<typeof functions.UPGRADE_INTERFACE_VERSION>
export type UPGRADE_INTERFACE_VERSIONReturn = FunctionReturn<typeof functions.UPGRADE_INTERFACE_VERSION>

export type AcceptDefaultAdminTransferParams = FunctionArguments<typeof functions.acceptDefaultAdminTransfer>
export type AcceptDefaultAdminTransferReturn = FunctionReturn<typeof functions.acceptDefaultAdminTransfer>

export type BeginDefaultAdminTransferParams = FunctionArguments<typeof functions.beginDefaultAdminTransfer>
export type BeginDefaultAdminTransferReturn = FunctionReturn<typeof functions.beginDefaultAdminTransfer>

export type CancelDefaultAdminTransferParams = FunctionArguments<typeof functions.cancelDefaultAdminTransfer>
export type CancelDefaultAdminTransferReturn = FunctionReturn<typeof functions.cancelDefaultAdminTransfer>

export type CashDataProviderParams = FunctionArguments<typeof functions.cashDataProvider>
export type CashDataProviderReturn = FunctionReturn<typeof functions.cashDataProvider>

export type ChangeDefaultAdminDelayParams = FunctionArguments<typeof functions.changeDefaultAdminDelay>
export type ChangeDefaultAdminDelayReturn = FunctionReturn<typeof functions.changeDefaultAdminDelay>

export type DefaultAdminParams = FunctionArguments<typeof functions.defaultAdmin>
export type DefaultAdminReturn = FunctionReturn<typeof functions.defaultAdmin>

export type DefaultAdminDelayParams = FunctionArguments<typeof functions.defaultAdminDelay>
export type DefaultAdminDelayReturn = FunctionReturn<typeof functions.defaultAdminDelay>

export type DefaultAdminDelayIncreaseWaitParams = FunctionArguments<typeof functions.defaultAdminDelayIncreaseWait>
export type DefaultAdminDelayIncreaseWaitReturn = FunctionReturn<typeof functions.defaultAdminDelayIncreaseWait>

export type EmitAddCollateralToDebtManagerParams = FunctionArguments<typeof functions.emitAddCollateralToDebtManager>
export type EmitAddCollateralToDebtManagerReturn = FunctionReturn<typeof functions.emitAddCollateralToDebtManager>

export type EmitBorrowFromDebtManagerParams = FunctionArguments<typeof functions.emitBorrowFromDebtManager>
export type EmitBorrowFromDebtManagerReturn = FunctionReturn<typeof functions.emitBorrowFromDebtManager>

export type EmitCashbackEventParams = FunctionArguments<typeof functions.emitCashbackEvent>
export type EmitCashbackEventReturn = FunctionReturn<typeof functions.emitCashbackEvent>

export type EmitCloseAccountWithDebtManagerParams = FunctionArguments<typeof functions.emitCloseAccountWithDebtManager>
export type EmitCloseAccountWithDebtManagerReturn = FunctionReturn<typeof functions.emitCloseAccountWithDebtManager>

export type EmitIncomingOwnerSetParams = FunctionArguments<typeof functions.emitIncomingOwnerSet>
export type EmitIncomingOwnerSetReturn = FunctionReturn<typeof functions.emitIncomingOwnerSet>

export type EmitIsRecoveryActiveSetParams = FunctionArguments<typeof functions.emitIsRecoveryActiveSet>
export type EmitIsRecoveryActiveSetReturn = FunctionReturn<typeof functions.emitIsRecoveryActiveSet>

export type EmitOwnerSetParams = FunctionArguments<typeof functions.emitOwnerSet>
export type EmitOwnerSetReturn = FunctionReturn<typeof functions.emitOwnerSet>

export type EmitPendingCashbackClearedEventParams = FunctionArguments<typeof functions.emitPendingCashbackClearedEvent>
export type EmitPendingCashbackClearedEventReturn = FunctionReturn<typeof functions.emitPendingCashbackClearedEvent>

export type EmitRepayDebtManagerParams = FunctionArguments<typeof functions.emitRepayDebtManager>
export type EmitRepayDebtManagerReturn = FunctionReturn<typeof functions.emitRepayDebtManager>

export type EmitSetModeParams = FunctionArguments<typeof functions.emitSetMode>
export type EmitSetModeReturn = FunctionReturn<typeof functions.emitSetMode>

export type EmitSpendParams = FunctionArguments<typeof functions.emitSpend>
export type EmitSpendReturn = FunctionReturn<typeof functions.emitSpend>

export type EmitSpendingLimitChangedParams = FunctionArguments<typeof functions.emitSpendingLimitChanged>
export type EmitSpendingLimitChangedReturn = FunctionReturn<typeof functions.emitSpendingLimitChanged>

export type EmitSwapParams = FunctionArguments<typeof functions.emitSwap>
export type EmitSwapReturn = FunctionReturn<typeof functions.emitSwap>

export type EmitSwapTransferForSpendingParams = FunctionArguments<typeof functions.emitSwapTransferForSpending>
export type EmitSwapTransferForSpendingReturn = FunctionReturn<typeof functions.emitSwapTransferForSpending>

export type EmitTransferForSpendingParams = FunctionArguments<typeof functions.emitTransferForSpending>
export type EmitTransferForSpendingReturn = FunctionReturn<typeof functions.emitTransferForSpending>

export type EmitUserRecoverySignerSetParams = FunctionArguments<typeof functions.emitUserRecoverySignerSet>
export type EmitUserRecoverySignerSetReturn = FunctionReturn<typeof functions.emitUserRecoverySignerSet>

export type EmitWithdrawCollateralFromDebtManagerParams = FunctionArguments<typeof functions.emitWithdrawCollateralFromDebtManager>
export type EmitWithdrawCollateralFromDebtManagerReturn = FunctionReturn<typeof functions.emitWithdrawCollateralFromDebtManager>

export type EmitWithdrawalAmountUpdatedParams = FunctionArguments<typeof functions.emitWithdrawalAmountUpdated>
export type EmitWithdrawalAmountUpdatedReturn = FunctionReturn<typeof functions.emitWithdrawalAmountUpdated>

export type EmitWithdrawalCancelledParams = FunctionArguments<typeof functions.emitWithdrawalCancelled>
export type EmitWithdrawalCancelledReturn = FunctionReturn<typeof functions.emitWithdrawalCancelled>

export type EmitWithdrawalProcessedParams = FunctionArguments<typeof functions.emitWithdrawalProcessed>
export type EmitWithdrawalProcessedReturn = FunctionReturn<typeof functions.emitWithdrawalProcessed>

export type EmitWithdrawalRequestedParams = FunctionArguments<typeof functions.emitWithdrawalRequested>
export type EmitWithdrawalRequestedReturn = FunctionReturn<typeof functions.emitWithdrawalRequested>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingDefaultAdminParams = FunctionArguments<typeof functions.pendingDefaultAdmin>
export type PendingDefaultAdminReturn = FunctionReturn<typeof functions.pendingDefaultAdmin>

export type PendingDefaultAdminDelayParams = FunctionArguments<typeof functions.pendingDefaultAdminDelay>
export type PendingDefaultAdminDelayReturn = FunctionReturn<typeof functions.pendingDefaultAdminDelay>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RollbackDefaultAdminDelayParams = FunctionArguments<typeof functions.rollbackDefaultAdminDelay>
export type RollbackDefaultAdminDelayReturn = FunctionReturn<typeof functions.rollbackDefaultAdminDelay>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

