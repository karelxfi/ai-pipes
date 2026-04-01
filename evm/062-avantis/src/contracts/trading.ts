import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AggregatorUpdated: event("0x602cec4b1583b07d071161da5eb9589444d2459201e2fab7753dc941e9351c21", "AggregatorUpdated(address)", {"aggregator": p.address}),
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", "Initialized(uint8)", {"version": p.uint8}),
    LimitOrderInitiated: event("0xd0ac65cbccd4e7062356a9be37735153d991bdc4de08f024a8fffc0600f70488", "LimitOrderInitiated(address,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "orderId": p.uint256, "timestamp": p.uint256}),
    MarginUpdated: event("0x48452067591e9581b9c1f3135e16ae22829a7c8afc6b3d6a1afa2cd295cc1133", "MarginUpdated(address,uint256,uint256,uint8,(address,uint256,uint256,uint256,uint256,uint256,bool,uint256,uint256,uint256,uint256),uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "_type": p.uint8, "newTrade": p.struct({"trader": p.address, "pairIndex": p.uint256, "index": p.uint256, "initialPosToken": p.uint256, "positionSizeUSDC": p.uint256, "openPrice": p.uint256, "buy": p.bool, "leverage": p.uint256, "tp": p.uint256, "sl": p.uint256, "timestamp": p.uint256}), "marginFees": p.uint256, "lossProtectionTier": p.uint256, "timestamp": p.uint256}),
    MarketOrderInitiated: event("0x9d20fe25d5b18ddf053eb042d606b6f438ec532c9978753d5284b6128063a1bd", "MarketOrderInitiated(address,uint256,bool,uint256,uint256,bool,bool,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "open": p.bool, "orderId": p.uint256, "timestamp": p.uint256, "isBuy": p.bool, "isPnl": p.bool, "initialPosToken": p.uint256, "leverage": p.uint256}),
    NumberUpdated: event("0x8cf3e35f6221b16e1670a3413180c9484bf5aa71787905909fa82a6a2662e9ab", "NumberUpdated(string,uint256)", {"name": p.string, "value": p.uint256}),
    OpenLimitCanceled: event("0x99b2cab0fe1db813d380331f51c117d5622d07c79686cc4ecd043e8d56ace094", "OpenLimitCanceled(address,uint256,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "timestamp": p.uint256, "collateral": p.uint256}),
    OpenLimitPlaced: event("0x34a9b59081ec3c1409d89b4ebbc63bb5cc67d740a69910139aef53444a39f729", "OpenLimitPlaced(address,uint256,uint256,bool,uint256,uint256,uint8,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "isBuy": p.bool, "openPrice": p.uint256, "executionFee": p.uint256, "orderType": p.uint8, "slippageP": p.uint256, "collateral": p.uint256, "leverage": p.uint256}),
    OpenLimitUpdated: event("0x710a8db87f04e82a9de40076812593a965f4aa48693196d2144c07ff9710e890", "OpenLimitUpdated(address,uint256,uint256,uint256,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "newPrice": p.uint256, "newTp": p.uint256, "newSl": p.uint256, "timestamp": p.uint256}),
    OperatorUpdated: event("0x966c160e1c4dbc7df8d69af4ace01e9297c3cf016397b7914971f2fbfa32672d", "OperatorUpdated(address,bool)", {"operator": p.address, "isOperator": p.bool}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    SlUpdateInitiated: event("0xb24bbc82fd04bd3dab7c96c1cabc7a0f7a1a87dfa2b47239926fbde0a0bfa8be", "SlUpdateInitiated(address,uint256,uint256,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "newSl": p.uint256, "orderId": p.uint256, "timestamp": p.uint256}),
    SlUpdated: event("0x6a750d0aaea2df37b3b72b79412df54b9e55109ccfaedf5dcecc2af9993a61de", "SlUpdated(address,uint256,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "newSl": p.uint256, "timestamp": p.uint256}),
    TpUpdated: event("0x01c13b316ce9327f58f220b36e368c197eda79df0102d7f4363f1e7fe29323e8", "TpUpdated(address,uint256,uint256,uint256,uint256)", {"trader": indexed(p.address), "pairIndex": p.uint256, "index": p.uint256, "newTp": p.uint256, "timestamp": p.uint256}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
}

export const functions = {
    _MAX_SLIPPAGE: viewFun("0xc48a02a2", "_MAX_SLIPPAGE()", {}, p.uint256),
    __msgSender: viewFun("0xd1a91ff2", "__msgSender()", {}, p.address),
    cancelOpenLimitOrder: fun("0xb9b6573a", "cancelOpenLimitOrder(uint256,uint256)", {"_pairIndex": p.uint256, "_index": p.uint256}, ),
    cancelPendingMarketOrder: fun("0xc5ed6a08", "cancelPendingMarketOrder(uint256)", {"_id": p.uint256}, ),
    closeTradeMarket: fun("0x2c3cbce4", "closeTradeMarket(uint256,uint256,uint256)", {"_pairIndex": p.uint256, "_index": p.uint256, "_amount": p.uint256}, p.uint256),
    delegatedAction: fun("0x9a10cc32", "delegatedAction(address,bytes)", {"trader": p.address, "call_data": p.bytes}, p.bytes),
    delegations: viewFun("0xbffe3486", "delegations(address)", {"_0": p.address}, p.address),
    'executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8)': fun("0x1ba973b0", "executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8)", {"_orderType": p.uint8, "_trader": p.address, "_pairIndex": p.uint256, "_index": p.uint256, "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8}, ),
    'executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8,int256)': fun("0xc3bd7f39", "executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8,int256)", {"_orderType": p.uint8, "_trader": p.address, "_pairIndex": p.uint256, "_index": p.uint256, "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8, "spreadP": p.int256}, ),
    'executeMarketOrders(uint256[],bytes[],uint8,int256)': fun("0x53e8840c", "executeMarketOrders(uint256[],bytes[],uint8,int256)", {"orderId": p.array(p.uint256), "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8, "spreadP": p.int256}, ),
    'executeMarketOrders(uint256[],bytes[],uint8)': fun("0xcbabcbc0", "executeMarketOrders(uint256[],bytes[],uint8)", {"orderId": p.array(p.uint256), "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8}, ),
    initialize: fun("0x485cc955", "initialize(address,address)", {"_storageT": p.address, "_pairInfos": p.address}, ),
    isOperator: viewFun("0x6d70f7ae", "isOperator(address)", {"_0": p.address}, p.bool),
    limitOrdersTimelock: viewFun("0x0890d22a", "limitOrdersTimelock()", {}, p.uint256),
    openTrade: fun("0x19cde9a1", "openTrade((address,uint256,uint256,uint256,uint256,uint256,bool,uint256,uint256,uint256,uint256),uint8,uint256)", {"t": p.struct({"trader": p.address, "pairIndex": p.uint256, "index": p.uint256, "initialPosToken": p.uint256, "positionSizeUSDC": p.uint256, "openPrice": p.uint256, "buy": p.bool, "leverage": p.uint256, "tp": p.uint256, "sl": p.uint256, "timestamp": p.uint256}), "_type": p.uint8, "_slippageP": p.uint256}, p.uint256),
    operator: viewFun("0x570ca735", "operator()", {}, p.address),
    pairInfos: viewFun("0x1346b0ff", "pairInfos()", {}, p.address),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    removeDelegate: fun("0x36fb8b15", "removeDelegate()", {}, ),
    setAggregator: fun("0xf9120af6", "setAggregator(address)", {"_aggregator": p.address}, ),
    setDelegate: fun("0xca5eb5e1", "setDelegate(address)", {"delegate": p.address}, ),
    setMarketExecFeeReciever: fun("0x9e2033f5", "setMarketExecFeeReciever(address)", {"_reciever": p.address}, ),
    storageT: viewFun("0x16fff074", "storageT()", {}, p.address),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    'updateMargin(uint256,uint256,uint8,uint256,bytes[],uint8)': fun("0xb9fe2af3", "updateMargin(uint256,uint256,uint8,uint256,bytes[],uint8)", {"_pairIndex": p.uint256, "_index": p.uint256, "_type": p.uint8, "_amount": p.uint256, "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8}, p.uint256),
    'updateMargin(uint256,uint256,uint8,uint256,bytes[])': fun("0xcd90b8a4", "updateMargin(uint256,uint256,uint8,uint256,bytes[])", {"_pairIndex": p.uint256, "_index": p.uint256, "_type": p.uint8, "_amount": p.uint256, "priceUpdateData": p.array(p.bytes)}, p.uint256),
    updateOpenLimitOrder: fun("0xc641558e", "updateOpenLimitOrder(uint256,uint256,uint256,uint256,uint256,uint256)", {"_pairIndex": p.uint256, "_index": p.uint256, "_price": p.uint256, "_slippageP": p.uint256, "_tp": p.uint256, "_sl": p.uint256}, ),
    updateOperator: fun("0x6d44a3b2", "updateOperator(address,bool)", {"_operator": p.address, "_isOperator": p.bool}, ),
    'updateSl(uint256,uint256,uint256,bytes[],uint8)': fun("0x323ee846", "updateSl(uint256,uint256,uint256,bytes[],uint8)", {"_pairIndex": p.uint256, "_index": p.uint256, "_newSl": p.uint256, "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8}, ),
    'updateSl(uint256,uint256,uint256,bytes[])': fun("0xc383e5de", "updateSl(uint256,uint256,uint256,bytes[])", {"_pairIndex": p.uint256, "_index": p.uint256, "_newSl": p.uint256, "priceUpdateData": p.array(p.bytes)}, ),
    'updateTpAndSl(uint256,uint256,uint256,uint256,bytes[])': fun("0x15b760b1", "updateTpAndSl(uint256,uint256,uint256,uint256,bytes[])", {"_pairIndex": p.uint256, "_index": p.uint256, "_newSl": p.uint256, "_newTP": p.uint256, "priceUpdateData": p.array(p.bytes)}, ),
    'updateTpAndSl(uint256,uint256,uint256,uint256,bytes[],uint8)': fun("0x8dffdc3c", "updateTpAndSl(uint256,uint256,uint256,uint256,bytes[],uint8)", {"_pairIndex": p.uint256, "_index": p.uint256, "_newSl": p.uint256, "_newTP": p.uint256, "priceUpdateData": p.array(p.bytes), "_priceSourcing": p.uint8}, ),
}

export class Contract extends ContractBase {

    _MAX_SLIPPAGE() {
        return this.eth_call(functions._MAX_SLIPPAGE, {})
    }

    __msgSender() {
        return this.eth_call(functions.__msgSender, {})
    }

    delegations(_0: DelegationsParams["_0"]) {
        return this.eth_call(functions.delegations, {_0})
    }

    isOperator(_0: IsOperatorParams["_0"]) {
        return this.eth_call(functions.isOperator, {_0})
    }

    limitOrdersTimelock() {
        return this.eth_call(functions.limitOrdersTimelock, {})
    }

    operator() {
        return this.eth_call(functions.operator, {})
    }

    pairInfos() {
        return this.eth_call(functions.pairInfos, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    storageT() {
        return this.eth_call(functions.storageT, {})
    }
}

/// Event types
export type AggregatorUpdatedEventArgs = EParams<typeof events.AggregatorUpdated>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type LimitOrderInitiatedEventArgs = EParams<typeof events.LimitOrderInitiated>
export type MarginUpdatedEventArgs = EParams<typeof events.MarginUpdated>
export type MarketOrderInitiatedEventArgs = EParams<typeof events.MarketOrderInitiated>
export type NumberUpdatedEventArgs = EParams<typeof events.NumberUpdated>
export type OpenLimitCanceledEventArgs = EParams<typeof events.OpenLimitCanceled>
export type OpenLimitPlacedEventArgs = EParams<typeof events.OpenLimitPlaced>
export type OpenLimitUpdatedEventArgs = EParams<typeof events.OpenLimitUpdated>
export type OperatorUpdatedEventArgs = EParams<typeof events.OperatorUpdated>
export type PausedEventArgs = EParams<typeof events.Paused>
export type SlUpdateInitiatedEventArgs = EParams<typeof events.SlUpdateInitiated>
export type SlUpdatedEventArgs = EParams<typeof events.SlUpdated>
export type TpUpdatedEventArgs = EParams<typeof events.TpUpdated>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>

/// Function types
export type _MAX_SLIPPAGEParams = FunctionArguments<typeof functions._MAX_SLIPPAGE>
export type _MAX_SLIPPAGEReturn = FunctionReturn<typeof functions._MAX_SLIPPAGE>

export type __msgSenderParams = FunctionArguments<typeof functions.__msgSender>
export type __msgSenderReturn = FunctionReturn<typeof functions.__msgSender>

export type CancelOpenLimitOrderParams = FunctionArguments<typeof functions.cancelOpenLimitOrder>
export type CancelOpenLimitOrderReturn = FunctionReturn<typeof functions.cancelOpenLimitOrder>

export type CancelPendingMarketOrderParams = FunctionArguments<typeof functions.cancelPendingMarketOrder>
export type CancelPendingMarketOrderReturn = FunctionReturn<typeof functions.cancelPendingMarketOrder>

export type CloseTradeMarketParams = FunctionArguments<typeof functions.closeTradeMarket>
export type CloseTradeMarketReturn = FunctionReturn<typeof functions.closeTradeMarket>

export type DelegatedActionParams = FunctionArguments<typeof functions.delegatedAction>
export type DelegatedActionReturn = FunctionReturn<typeof functions.delegatedAction>

export type DelegationsParams = FunctionArguments<typeof functions.delegations>
export type DelegationsReturn = FunctionReturn<typeof functions.delegations>

export type ExecuteLimitOrderParams_0 = FunctionArguments<typeof functions['executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8)']>
export type ExecuteLimitOrderReturn_0 = FunctionReturn<typeof functions['executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8)']>

export type ExecuteLimitOrderParams_1 = FunctionArguments<typeof functions['executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8,int256)']>
export type ExecuteLimitOrderReturn_1 = FunctionReturn<typeof functions['executeLimitOrder(uint8,address,uint256,uint256,bytes[],uint8,int256)']>

export type ExecuteMarketOrdersParams_0 = FunctionArguments<typeof functions['executeMarketOrders(uint256[],bytes[],uint8,int256)']>
export type ExecuteMarketOrdersReturn_0 = FunctionReturn<typeof functions['executeMarketOrders(uint256[],bytes[],uint8,int256)']>

export type ExecuteMarketOrdersParams_1 = FunctionArguments<typeof functions['executeMarketOrders(uint256[],bytes[],uint8)']>
export type ExecuteMarketOrdersReturn_1 = FunctionReturn<typeof functions['executeMarketOrders(uint256[],bytes[],uint8)']>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsOperatorParams = FunctionArguments<typeof functions.isOperator>
export type IsOperatorReturn = FunctionReturn<typeof functions.isOperator>

export type LimitOrdersTimelockParams = FunctionArguments<typeof functions.limitOrdersTimelock>
export type LimitOrdersTimelockReturn = FunctionReturn<typeof functions.limitOrdersTimelock>

export type OpenTradeParams = FunctionArguments<typeof functions.openTrade>
export type OpenTradeReturn = FunctionReturn<typeof functions.openTrade>

export type OperatorParams = FunctionArguments<typeof functions.operator>
export type OperatorReturn = FunctionReturn<typeof functions.operator>

export type PairInfosParams = FunctionArguments<typeof functions.pairInfos>
export type PairInfosReturn = FunctionReturn<typeof functions.pairInfos>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RemoveDelegateParams = FunctionArguments<typeof functions.removeDelegate>
export type RemoveDelegateReturn = FunctionReturn<typeof functions.removeDelegate>

export type SetAggregatorParams = FunctionArguments<typeof functions.setAggregator>
export type SetAggregatorReturn = FunctionReturn<typeof functions.setAggregator>

export type SetDelegateParams = FunctionArguments<typeof functions.setDelegate>
export type SetDelegateReturn = FunctionReturn<typeof functions.setDelegate>

export type SetMarketExecFeeRecieverParams = FunctionArguments<typeof functions.setMarketExecFeeReciever>
export type SetMarketExecFeeRecieverReturn = FunctionReturn<typeof functions.setMarketExecFeeReciever>

export type StorageTParams = FunctionArguments<typeof functions.storageT>
export type StorageTReturn = FunctionReturn<typeof functions.storageT>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpdateMarginParams_0 = FunctionArguments<typeof functions['updateMargin(uint256,uint256,uint8,uint256,bytes[],uint8)']>
export type UpdateMarginReturn_0 = FunctionReturn<typeof functions['updateMargin(uint256,uint256,uint8,uint256,bytes[],uint8)']>

export type UpdateMarginParams_1 = FunctionArguments<typeof functions['updateMargin(uint256,uint256,uint8,uint256,bytes[])']>
export type UpdateMarginReturn_1 = FunctionReturn<typeof functions['updateMargin(uint256,uint256,uint8,uint256,bytes[])']>

export type UpdateOpenLimitOrderParams = FunctionArguments<typeof functions.updateOpenLimitOrder>
export type UpdateOpenLimitOrderReturn = FunctionReturn<typeof functions.updateOpenLimitOrder>

export type UpdateOperatorParams = FunctionArguments<typeof functions.updateOperator>
export type UpdateOperatorReturn = FunctionReturn<typeof functions.updateOperator>

export type UpdateSlParams_0 = FunctionArguments<typeof functions['updateSl(uint256,uint256,uint256,bytes[],uint8)']>
export type UpdateSlReturn_0 = FunctionReturn<typeof functions['updateSl(uint256,uint256,uint256,bytes[],uint8)']>

export type UpdateSlParams_1 = FunctionArguments<typeof functions['updateSl(uint256,uint256,uint256,bytes[])']>
export type UpdateSlReturn_1 = FunctionReturn<typeof functions['updateSl(uint256,uint256,uint256,bytes[])']>

export type UpdateTpAndSlParams_0 = FunctionArguments<typeof functions['updateTpAndSl(uint256,uint256,uint256,uint256,bytes[])']>
export type UpdateTpAndSlReturn_0 = FunctionReturn<typeof functions['updateTpAndSl(uint256,uint256,uint256,uint256,bytes[])']>

export type UpdateTpAndSlParams_1 = FunctionArguments<typeof functions['updateTpAndSl(uint256,uint256,uint256,uint256,bytes[],uint8)']>
export type UpdateTpAndSlReturn_1 = FunctionReturn<typeof functions['updateTpAndSl(uint256,uint256,uint256,uint256,bytes[],uint8)']>

