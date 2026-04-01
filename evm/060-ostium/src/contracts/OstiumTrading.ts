import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AutomationCloseOrderInitiated: event("0xf030e9b57a795e81643655654d5c84ed0f2838ad8c91768b1280b1e41425ec10", "AutomationCloseOrderInitiated(uint256,uint256,address,uint16,uint8)", {"orderId": indexed(p.uint256), "tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16, "_4": p.uint8}),
    AutomationOpenOrderInitiated: event("0x3cd9ed48c68d147bd6b2b5f1a2b4d1e35a97350e6638f3dc33c25cc9ddec22d4", "AutomationOpenOrderInitiated(uint256,address,uint16,uint8)", {"orderId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8}),
    DelegateAdded: event("0x12dade473695d73bd34e031c850d5e815fa17a42b1b5ba13ff72de2497c5e309", "DelegateAdded(address,address)", {"delegator": indexed(p.address), "delegate": indexed(p.address)}),
    DelegateRemoved: event("0xe8514dd4be968431135580c26314ec35afafc8178268603f99625584960d9c16", "DelegateRemoved(address,address)", {"delegator": indexed(p.address), "delegate": indexed(p.address)}),
    Done: event("0xc3a6f986261de9467c2838c6df8ef74f9107855159205600c0bc7a14cdfd3888", "Done(bool)", {"done": p.bool}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", "Initialized(uint64)", {"version": p.uint64}),
    MarketCloseFailed: event("0xbd5738e36e4344b2090b101a9f2e7dcaf9f330207499752fa8d53bac83e8a733", "MarketCloseFailed(uint256,address,uint16)", {"tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": indexed(p.uint16)}),
    MarketCloseOrderInitiated: event("0xd2c0691c58a0c50eaa3988b2b9206118e30d0a3fec8a835b98d1cb6a7f0fe212", "MarketCloseOrderInitiated(uint256,uint256,address,uint16)", {"orderId": indexed(p.uint256), "tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16}),
    MarketCloseOrderInitiatedV2: event("0x955808f2a23e3a3fcfd1b56a9d3f3c2a9d90efb4701e855f40f3d4c416299960", "MarketCloseOrderInitiatedV2(uint256,uint256,address,uint16,uint16)", {"orderId": indexed(p.uint256), "tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16, "closePercentage": p.uint16}),
    MarketCloseTimeoutExecuted: event("0x4aadf205580e6609b7b995d38cc5759db03f5a9507cf236a01db8d42fd66ab97", "MarketCloseTimeoutExecuted(uint256,uint256,(uint256,uint192,uint32,(uint256,uint192,uint192,uint192,address,uint32,uint16,uint8,bool)))", {"orderId": indexed(p.uint256), "tradeId": indexed(p.uint256), "order": p.struct({"block": p.uint256, "wantedPrice": p.uint192, "slippageP": p.uint32, "trade": p.struct({"collateral": p.uint256, "openPrice": p.uint192, "tp": p.uint192, "sl": p.uint192, "trader": p.address, "leverage": p.uint32, "pairIndex": p.uint16, "index": p.uint8, "buy": p.bool})})}),
    MarketCloseTimeoutExecutedV2: event("0x694566ffb8cbb40c48fcc198a6f284b3e21b4c79a0032ef9801bfa078781dd8d", "MarketCloseTimeoutExecutedV2(uint256,uint256,(uint256,uint192,uint32,(uint256,uint192,uint192,uint192,address,uint32,uint16,uint8,bool),uint16))", {"orderId": indexed(p.uint256), "tradeId": indexed(p.uint256), "order": p.struct({"block": p.uint256, "wantedPrice": p.uint192, "slippageP": p.uint32, "trade": p.struct({"collateral": p.uint256, "openPrice": p.uint192, "tp": p.uint192, "sl": p.uint192, "trader": p.address, "leverage": p.uint32, "pairIndex": p.uint16, "index": p.uint8, "buy": p.bool}), "percentage": p.uint16})}),
    MarketOpenOrderInitiated: event("0xfb4a26aa34682aa753cb2aa37ef1bc38eee1af6719db3a8cfe892c50406ea0e0", "MarketOpenOrderInitiated(uint256,address,uint16)", {"orderId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": indexed(p.uint16)}),
    MarketOpenTimeoutExecuted: event("0xdcedf6b08d25c3bc2092ff9edc408b70dcd7806581070c1e2a1529a8ea5badef", "MarketOpenTimeoutExecuted(uint256,(uint256,uint192,uint32,(uint256,uint192,uint192,uint192,address,uint32,uint16,uint8,bool)))", {"orderId": indexed(p.uint256), "order": p.struct({"block": p.uint256, "wantedPrice": p.uint192, "slippageP": p.uint32, "trade": p.struct({"collateral": p.uint256, "openPrice": p.uint192, "tp": p.uint192, "sl": p.uint192, "trader": p.address, "leverage": p.uint32, "pairIndex": p.uint16, "index": p.uint8, "buy": p.bool})})}),
    MarketOpenTimeoutExecutedV2: event("0x9c127206e31d97e5fa689ebad18a4faad9c6e4b77e94cbd5f82e87400d360ad7", "MarketOpenTimeoutExecutedV2(uint256,(uint256,uint192,uint32,(uint256,uint192,uint192,uint192,address,uint32,uint16,uint8,bool),uint16))", {"orderId": indexed(p.uint256), "order": p.struct({"block": p.uint256, "wantedPrice": p.uint192, "slippageP": p.uint32, "trade": p.struct({"collateral": p.uint256, "openPrice": p.uint192, "tp": p.uint192, "sl": p.uint192, "trader": p.address, "leverage": p.uint32, "pairIndex": p.uint16, "index": p.uint8, "buy": p.bool}), "percentage": p.uint16})}),
    MarketOrdersTimeoutUpdated: event("0x47516ce78787067febcd937da9fd9f838590230927f22070ca4b3b37189a5342", "MarketOrdersTimeoutUpdated(uint16)", {"value": p.uint16}),
    MaxAllowedCollateralUpdated: event("0xd0c89dcfa86f41bdd4a097393efdb1ecf04642dd0c11f7c4a55a193a0839e4f2", "MaxAllowedCollateralUpdated(uint256)", {"value": p.uint256}),
    OpenLimitCanceled: event("0xaf0078fc6c9ab6530300cd0b84ca36d3044534d9373536a0d877062d8e6f9204", "OpenLimitCanceled(address,uint16,uint8)", {"trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8}),
    OpenLimitPlaced: event("0xc5bd5ba70b0fccae9ac4984c1b7e09d0eb00930a72e0712688fc62b4ae70ebc5", "OpenLimitPlaced(address,uint16,uint8)", {"trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8}),
    OpenLimitPlacedV2: event("0x0dba1a317bd6d9df2e68ad87b706bcf4a2fc6dd40d79c150a3d30f813a609837", "OpenLimitPlacedV2(address,uint16,uint8,(uint256,uint192,uint192,uint192,address,uint32,uint16,uint8,bool),uint8,(address,uint32))", {"trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8, "trade": p.struct({"collateral": p.uint256, "openPrice": p.uint192, "tp": p.uint192, "sl": p.uint192, "trader": p.address, "leverage": p.uint32, "pairIndex": p.uint16, "index": p.uint8, "buy": p.bool}), "orderType": p.uint8, "builderFee": p.struct({"builder": p.address, "builderFee": p.uint32})}),
    OpenLimitUpdated: event("0x98ea8314653e032ef95264476f2ddc4b25ce0b46a0922eb44c1b9a2b36d22e59", "OpenLimitUpdated(address,uint16,uint8,uint192,uint192,uint192)", {"trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8, "newPrice": p.uint192, "newTp": p.uint192, "newSl": p.uint192}),
    OracleFeeCharged: event("0x180816fdaede3b97c34fb408fbf4568bc800ae0e67bb519f458a64f1f01e7460", "OracleFeeCharged(uint256,address,uint16,uint256)", {"tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16, "amount": p.uint256}),
    OracleFeeChargedLimitCancelled: event("0x00583880eb0c4f71add4ccec8c11dbaf78d0562ffd31a56741007f63010a9ffe", "OracleFeeChargedLimitCancelled(address,uint16,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint16, "amount": p.uint256}),
    OracleFeeRefunded: event("0xe23578987dc81cc630ca3edac7702ccf6951f6a27a1ad5eebfd82bed6bb15567", "OracleFeeRefunded(uint256,address,uint16,uint256)", {"tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16, "amount": p.uint256}),
    Paused: event("0x0e2fb031ee032dc02d8011dc50b816eb450cf856abd8261680dac74f72165bd2", "Paused(bool)", {"paused": p.bool}),
    RemoveCollateralInitiated: event("0x1c0cf118aab947f20d864c6e401e5387f90a7cdcb5288a28adfe00c51622ed0e", "RemoveCollateralInitiated(uint256,uint256,address,uint16,uint256)", {"tradeId": indexed(p.uint256), "orderId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16, "removeAmount": p.uint256}),
    RemoveCollateralRejected: event("0xd7f94dd42f939eef7fee3d09607f9e4152c907074b6bdc0d5d8b05807688b574", "RemoveCollateralRejected(uint256,uint256,address,uint16,uint256,string)", {"tradeId": indexed(p.uint256), "orderId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": p.uint16, "removeAmount": p.uint256, "reason": p.string}),
    SlUpdated: event("0x2a0cf479e0dd902b509864ced4798e3fe7cd156160ced3e2b995f7e4fc658e6a", "SlUpdated(uint256,address,uint16,uint8,uint192)", {"tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8, "newSl": p.uint192}),
    TopUpCollateralExecuted: event("0xb8b06ffba533648c51873664083df052298f05b366a088e0c11b3c45b483f7c8", "TopUpCollateralExecuted(uint256,address,uint16,uint256,uint32)", {"tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": indexed(p.uint16), "topUpAmount": p.uint256, "newLeverage": p.uint32}),
    TpUpdated: event("0x9b366191a0c4e7c25058a6d889cd01c574bcea6e4e9adae8b3d1137feee2e30a", "TpUpdated(uint256,address,uint16,uint8,uint192)", {"tradeId": indexed(p.uint256), "trader": indexed(p.address), "pairIndex": indexed(p.uint16), "index": p.uint8, "newTp": p.uint192}),
    TriggerTimeoutUpdated: event("0xdd556fee81cf6944e242027e8ff6720bda1e5affad547357ca8432462f4774d4", "TriggerTimeoutUpdated(uint16)", {"value": p.uint16}),
}

export const functions = {
    _msgSender: viewFun("0x119df25f", "_msgSender()", {}, p.address),
    cancelOpenLimitOrder: fun("0xc444e746", "cancelOpenLimitOrder(uint16,uint8)", {"pairIndex": p.uint16, "index": p.uint8}, ),
    closeTradeMarket: fun("0xefc10755", "closeTradeMarket(uint16,uint8,uint16,uint192,uint32)", {"pairIndex": p.uint16, "index": p.uint8, "closePercentage": p.uint16, "marketPrice": p.uint192, "slippageP": p.uint32}, ),
    closeTradeMarketTimeout: fun("0x3f21ea62", "closeTradeMarketTimeout(uint256,bool)", {"_order": p.uint256, "retry": p.bool}, ),
    delegatedAction: fun("0x9a10cc32", "delegatedAction(address,bytes)", {"trader": p.address, "call_data": p.bytes}, p.bytes),
    delegations: viewFun("0xbffe3486", "delegations(address)", {"delegator": p.address}, p.address),
    done: fun("0xae8421e1", "done()", {}, ),
    executeAutomationOrder: fun("0x01a69331", "executeAutomationOrder(uint8,address,uint16,uint8,uint256)", {"orderType": p.uint8, "trader": p.address, "pairIndex": p.uint16, "index": p.uint8, "priceTimestamp": p.uint256}, p.uint8),
    initialize: fun("0xb42a5bee", "initialize(address,uint256,uint16,uint16)", {"_registry": p.address, "_maxAllowedCollateral": p.uint256, "_marketOrdersTimeout": p.uint16, "_triggerTimeout": p.uint16}, ),
    isDone: viewFun("0x8f062227", "isDone()", {}, p.bool),
    isPaused: viewFun("0xb187bd26", "isPaused()", {}, p.bool),
    marketOrdersTimeout: viewFun("0x410c0b7c", "marketOrdersTimeout()", {}, p.uint16),
    maxAllowedCollateral: viewFun("0xbf815d2e", "maxAllowedCollateral()", {}, p.uint256),
    openTrade: fun("0x742088c0", "openTrade((uint256,uint192,uint192,uint192,address,uint32,uint16,uint8,bool),(address,uint32),uint8,uint256)", {"t": p.struct({"collateral": p.uint256, "openPrice": p.uint192, "tp": p.uint192, "sl": p.uint192, "trader": p.address, "leverage": p.uint32, "pairIndex": p.uint16, "index": p.uint8, "buy": p.bool}), "bf": p.struct({"builder": p.address, "builderFee": p.uint32}), "orderType": p.uint8, "slippageP": p.uint256}, ),
    openTradeMarketTimeout: fun("0x876d3abd", "openTradeMarketTimeout(uint256)", {"_order": p.uint256}, ),
    pause: fun("0x8456cb59", "pause()", {}, ),
    registry: viewFun("0x7b103999", "registry()", {}, p.address),
    removeCollateral: fun("0x56ac637e", "removeCollateral(uint16,uint8,uint256)", {"pairIndex": p.uint16, "index": p.uint8, "removeAmount": p.uint256}, ),
    removeDelegate: fun("0x36fb8b15", "removeDelegate()", {}, ),
    setDelegate: fun("0xca5eb5e1", "setDelegate(address)", {"delegate": p.address}, ),
    setMarketOrdersTimeout: fun("0xb81bfa05", "setMarketOrdersTimeout(uint256)", {"value": p.uint256}, ),
    setMaxAllowedCollateral: fun("0xd550034c", "setMaxAllowedCollateral(uint256)", {"value": p.uint256}, ),
    setTriggerTimeout: fun("0xf0ed3859", "setTriggerTimeout(uint256)", {"value": p.uint256}, ),
    topUpCollateral: fun("0x0a21b1a1", "topUpCollateral(uint16,uint8,uint256)", {"pairIndex": p.uint16, "index": p.uint8, "topUpAmount": p.uint256}, ),
    triggerTimeout: viewFun("0xfc8b2698", "triggerTimeout()", {}, p.uint16),
    updateOpenLimitOrder: fun("0x4f9a9e64", "updateOpenLimitOrder(uint16,uint8,uint192,uint192,uint192)", {"pairIndex": p.uint16, "index": p.uint8, "price": p.uint192, "tp": p.uint192, "sl": p.uint192}, ),
    updateSl: fun("0xe2441c04", "updateSl(uint16,uint8,uint192)", {"pairIndex": p.uint16, "index": p.uint8, "newSl": p.uint192}, ),
    updateTp: fun("0xbe9267be", "updateTp(uint16,uint8,uint192)", {"pairIndex": p.uint16, "index": p.uint8, "newTp": p.uint192}, ),
}

export class Contract extends ContractBase {

    _msgSender() {
        return this.eth_call(functions._msgSender, {})
    }

    delegations(delegator: DelegationsParams["delegator"]) {
        return this.eth_call(functions.delegations, {delegator})
    }

    isDone() {
        return this.eth_call(functions.isDone, {})
    }

    isPaused() {
        return this.eth_call(functions.isPaused, {})
    }

    marketOrdersTimeout() {
        return this.eth_call(functions.marketOrdersTimeout, {})
    }

    maxAllowedCollateral() {
        return this.eth_call(functions.maxAllowedCollateral, {})
    }

    registry() {
        return this.eth_call(functions.registry, {})
    }

    triggerTimeout() {
        return this.eth_call(functions.triggerTimeout, {})
    }
}

/// Event types
export type AutomationCloseOrderInitiatedEventArgs = EParams<typeof events.AutomationCloseOrderInitiated>
export type AutomationOpenOrderInitiatedEventArgs = EParams<typeof events.AutomationOpenOrderInitiated>
export type DelegateAddedEventArgs = EParams<typeof events.DelegateAdded>
export type DelegateRemovedEventArgs = EParams<typeof events.DelegateRemoved>
export type DoneEventArgs = EParams<typeof events.Done>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type MarketCloseFailedEventArgs = EParams<typeof events.MarketCloseFailed>
export type MarketCloseOrderInitiatedEventArgs = EParams<typeof events.MarketCloseOrderInitiated>
export type MarketCloseOrderInitiatedV2EventArgs = EParams<typeof events.MarketCloseOrderInitiatedV2>
export type MarketCloseTimeoutExecutedEventArgs = EParams<typeof events.MarketCloseTimeoutExecuted>
export type MarketCloseTimeoutExecutedV2EventArgs = EParams<typeof events.MarketCloseTimeoutExecutedV2>
export type MarketOpenOrderInitiatedEventArgs = EParams<typeof events.MarketOpenOrderInitiated>
export type MarketOpenTimeoutExecutedEventArgs = EParams<typeof events.MarketOpenTimeoutExecuted>
export type MarketOpenTimeoutExecutedV2EventArgs = EParams<typeof events.MarketOpenTimeoutExecutedV2>
export type MarketOrdersTimeoutUpdatedEventArgs = EParams<typeof events.MarketOrdersTimeoutUpdated>
export type MaxAllowedCollateralUpdatedEventArgs = EParams<typeof events.MaxAllowedCollateralUpdated>
export type OpenLimitCanceledEventArgs = EParams<typeof events.OpenLimitCanceled>
export type OpenLimitPlacedEventArgs = EParams<typeof events.OpenLimitPlaced>
export type OpenLimitPlacedV2EventArgs = EParams<typeof events.OpenLimitPlacedV2>
export type OpenLimitUpdatedEventArgs = EParams<typeof events.OpenLimitUpdated>
export type OracleFeeChargedEventArgs = EParams<typeof events.OracleFeeCharged>
export type OracleFeeChargedLimitCancelledEventArgs = EParams<typeof events.OracleFeeChargedLimitCancelled>
export type OracleFeeRefundedEventArgs = EParams<typeof events.OracleFeeRefunded>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RemoveCollateralInitiatedEventArgs = EParams<typeof events.RemoveCollateralInitiated>
export type RemoveCollateralRejectedEventArgs = EParams<typeof events.RemoveCollateralRejected>
export type SlUpdatedEventArgs = EParams<typeof events.SlUpdated>
export type TopUpCollateralExecutedEventArgs = EParams<typeof events.TopUpCollateralExecuted>
export type TpUpdatedEventArgs = EParams<typeof events.TpUpdated>
export type TriggerTimeoutUpdatedEventArgs = EParams<typeof events.TriggerTimeoutUpdated>

/// Function types
export type _msgSenderParams = FunctionArguments<typeof functions._msgSender>
export type _msgSenderReturn = FunctionReturn<typeof functions._msgSender>

export type CancelOpenLimitOrderParams = FunctionArguments<typeof functions.cancelOpenLimitOrder>
export type CancelOpenLimitOrderReturn = FunctionReturn<typeof functions.cancelOpenLimitOrder>

export type CloseTradeMarketParams = FunctionArguments<typeof functions.closeTradeMarket>
export type CloseTradeMarketReturn = FunctionReturn<typeof functions.closeTradeMarket>

export type CloseTradeMarketTimeoutParams = FunctionArguments<typeof functions.closeTradeMarketTimeout>
export type CloseTradeMarketTimeoutReturn = FunctionReturn<typeof functions.closeTradeMarketTimeout>

export type DelegatedActionParams = FunctionArguments<typeof functions.delegatedAction>
export type DelegatedActionReturn = FunctionReturn<typeof functions.delegatedAction>

export type DelegationsParams = FunctionArguments<typeof functions.delegations>
export type DelegationsReturn = FunctionReturn<typeof functions.delegations>

export type DoneParams = FunctionArguments<typeof functions.done>
export type DoneReturn = FunctionReturn<typeof functions.done>

export type ExecuteAutomationOrderParams = FunctionArguments<typeof functions.executeAutomationOrder>
export type ExecuteAutomationOrderReturn = FunctionReturn<typeof functions.executeAutomationOrder>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsDoneParams = FunctionArguments<typeof functions.isDone>
export type IsDoneReturn = FunctionReturn<typeof functions.isDone>

export type IsPausedParams = FunctionArguments<typeof functions.isPaused>
export type IsPausedReturn = FunctionReturn<typeof functions.isPaused>

export type MarketOrdersTimeoutParams = FunctionArguments<typeof functions.marketOrdersTimeout>
export type MarketOrdersTimeoutReturn = FunctionReturn<typeof functions.marketOrdersTimeout>

export type MaxAllowedCollateralParams = FunctionArguments<typeof functions.maxAllowedCollateral>
export type MaxAllowedCollateralReturn = FunctionReturn<typeof functions.maxAllowedCollateral>

export type OpenTradeParams = FunctionArguments<typeof functions.openTrade>
export type OpenTradeReturn = FunctionReturn<typeof functions.openTrade>

export type OpenTradeMarketTimeoutParams = FunctionArguments<typeof functions.openTradeMarketTimeout>
export type OpenTradeMarketTimeoutReturn = FunctionReturn<typeof functions.openTradeMarketTimeout>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type RegistryParams = FunctionArguments<typeof functions.registry>
export type RegistryReturn = FunctionReturn<typeof functions.registry>

export type RemoveCollateralParams = FunctionArguments<typeof functions.removeCollateral>
export type RemoveCollateralReturn = FunctionReturn<typeof functions.removeCollateral>

export type RemoveDelegateParams = FunctionArguments<typeof functions.removeDelegate>
export type RemoveDelegateReturn = FunctionReturn<typeof functions.removeDelegate>

export type SetDelegateParams = FunctionArguments<typeof functions.setDelegate>
export type SetDelegateReturn = FunctionReturn<typeof functions.setDelegate>

export type SetMarketOrdersTimeoutParams = FunctionArguments<typeof functions.setMarketOrdersTimeout>
export type SetMarketOrdersTimeoutReturn = FunctionReturn<typeof functions.setMarketOrdersTimeout>

export type SetMaxAllowedCollateralParams = FunctionArguments<typeof functions.setMaxAllowedCollateral>
export type SetMaxAllowedCollateralReturn = FunctionReturn<typeof functions.setMaxAllowedCollateral>

export type SetTriggerTimeoutParams = FunctionArguments<typeof functions.setTriggerTimeout>
export type SetTriggerTimeoutReturn = FunctionReturn<typeof functions.setTriggerTimeout>

export type TopUpCollateralParams = FunctionArguments<typeof functions.topUpCollateral>
export type TopUpCollateralReturn = FunctionReturn<typeof functions.topUpCollateral>

export type TriggerTimeoutParams = FunctionArguments<typeof functions.triggerTimeout>
export type TriggerTimeoutReturn = FunctionReturn<typeof functions.triggerTimeout>

export type UpdateOpenLimitOrderParams = FunctionArguments<typeof functions.updateOpenLimitOrder>
export type UpdateOpenLimitOrderReturn = FunctionReturn<typeof functions.updateOpenLimitOrder>

export type UpdateSlParams = FunctionArguments<typeof functions.updateSl>
export type UpdateSlReturn = FunctionReturn<typeof functions.updateSl>

export type UpdateTpParams = FunctionArguments<typeof functions.updateTp>
export type UpdateTpReturn = FunctionReturn<typeof functions.updateTp>

