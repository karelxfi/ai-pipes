import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    StrategyAdded: event("0x5a6abd2af9fe6c0554fa08649e2d86e4393ff19dc304d072d38d295c9291d4dc", "StrategyAdded(address,uint256,uint256,uint256,uint256)", {"strategy": indexed(p.address), "debtRatio": p.uint256, "minDebtPerHarvest": p.uint256, "maxDebtPerHarvest": p.uint256, "performanceFee": p.uint256}),
    StrategyReported: event("0x67f96d2854a335a4cadb49f84fd3ca6f990744ddb3feceeb4b349d2d53d32ad3", "StrategyReported(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)", {"strategy": indexed(p.address), "gain": p.uint256, "loss": p.uint256, "debtPaid": p.uint256, "totalGain": p.uint256, "totalLoss": p.uint256, "totalDebt": p.uint256, "debtAdded": p.uint256, "debtRatio": p.uint256}),
    UpdateGovernance: event("0x8d55d160c0009eb3d739442df0a3ca089ed64378bfac017e7ddad463f9815b87", "UpdateGovernance(address)", {"governance": p.address}),
    UpdateManagement: event("0xff54978127edd34aec0f9061fb3b155fbe0ededdfa881ee3e0d541d3a1eef438", "UpdateManagement(address)", {"management": p.address}),
    UpdateRewards: event("0xdf3c41a916aecbf42361a147f8348c242662c3ce20ecef30e826b80642477a3d", "UpdateRewards(address)", {"rewards": p.address}),
    UpdateDepositLimit: event("0xae565aab888bca5e19e25a13db7b0c9144305bf55cb0f3f4d724f730e5acdd62", "UpdateDepositLimit(uint256)", {"depositLimit": p.uint256}),
    UpdatePerformanceFee: event("0x0810a1c261ca2c0cd86a0152c51c43ba9dc329639d2349f98140891b2ea798eb", "UpdatePerformanceFee(uint256)", {"performanceFee": p.uint256}),
    UpdateManagementFee: event("0x7a7883b0074f96e2c7fab65eb25abf624c488761a5db889e3bb84855dcc6daaf", "UpdateManagementFee(uint256)", {"managementFee": p.uint256}),
    UpdateGuardian: event("0x837b9ad138a0a1839a9637afce5306a5c13e23eb63365686843a5319a243609c", "UpdateGuardian(address)", {"guardian": p.address}),
    EmergencyShutdown: event("0xba40372a3a724dca3c57156128ef1e896724b65b37a17f190b1ad5de68f3a4f3", "EmergencyShutdown(bool)", {"active": p.bool}),
    UpdateWithdrawalQueue: event("0x695ac3ac73f08f2002284ffe563cefe798ee2878a5e04219522e2e99eb89d168", "UpdateWithdrawalQueue(address[20])", {"queue": p.fixedSizeArray(p.address, 20)}),
    StrategyUpdateDebtRatio: event("0xbda9398315c83ccef012bcaa318a2ff7b680f36429d36597bd4bc25ac11ead59", "StrategyUpdateDebtRatio(address,uint256)", {"strategy": indexed(p.address), "debtRatio": p.uint256}),
    StrategyUpdateMinDebtPerHarvest: event("0x0b728ad785976532c4aaadde09b1cba5f262a7090e83c62d2377bc405678b29c", "StrategyUpdateMinDebtPerHarvest(address,uint256)", {"strategy": indexed(p.address), "minDebtPerHarvest": p.uint256}),
    StrategyUpdateMaxDebtPerHarvest: event("0x1796a8e0760e2de5b72e7bf64fccb7666c48ceab94cb6cae7cb7eff4b6f641ab", "StrategyUpdateMaxDebtPerHarvest(address,uint256)", {"strategy": indexed(p.address), "maxDebtPerHarvest": p.uint256}),
    StrategyUpdatePerformanceFee: event("0xe57488a65fa53066d4c25bac90db47dda4e5de3025ac12bf76ff07211cf7f39e", "StrategyUpdatePerformanceFee(address,uint256)", {"strategy": indexed(p.address), "performanceFee": p.uint256}),
    StrategyMigrated: event("0x100b69bb6b504e1252e36b375233158edee64d071b399e2f81473a695fd1b021", "StrategyMigrated(address,address)", {"oldVersion": indexed(p.address), "newVersion": indexed(p.address)}),
    StrategyRevoked: event("0x4201c688d84c01154d321afa0c72f1bffe9eef53005c9de9d035074e71e9b32a", "StrategyRevoked(address)", {"strategy": indexed(p.address)}),
    StrategyRemovedFromQueue: event("0x8e1ec3c16d6a67ea8effe2ac7adef9c2de0bc0dc47c49cdf18f6a8b0048085be", "StrategyRemovedFromQueue(address)", {"strategy": indexed(p.address)}),
    StrategyAddedToQueue: event("0xa8727d412c6fa1e2497d6d6f275e2d9fe4d9318d5b793632e60ad9d38ee8f1fa", "StrategyAddedToQueue(address)", {"strategy": indexed(p.address)}),
}

export const functions = {
    'initialize(address,address,address,string,string)': fun("0x83b43589", "initialize(address,address,address,string,string)", {"token": p.address, "governance": p.address, "rewards": p.address, "nameOverride": p.string, "symbolOverride": p.string}, ),
    'initialize(address,address,address,string,string,address)': fun("0xa5b81fdf", "initialize(address,address,address,string,string,address)", {"token": p.address, "governance": p.address, "rewards": p.address, "nameOverride": p.string, "symbolOverride": p.string, "guardian": p.address}, ),
    'initialize(address,address,address,string,string,address,address)': fun("0x538baeab", "initialize(address,address,address,string,string,address,address)", {"token": p.address, "governance": p.address, "rewards": p.address, "nameOverride": p.string, "symbolOverride": p.string, "guardian": p.address, "management": p.address}, ),
    apiVersion: viewFun("0x25829410", "apiVersion()", {}, p.string),
    setName: fun("0xc47f0027", "setName(string)", {"name": p.string}, ),
    setSymbol: fun("0xb84c8246", "setSymbol(string)", {"symbol": p.string}, ),
    setGovernance: fun("0xab033ea9", "setGovernance(address)", {"governance": p.address}, ),
    acceptGovernance: fun("0x238efcbc", "acceptGovernance()", {}, ),
    setManagement: fun("0xd4a22bde", "setManagement(address)", {"management": p.address}, ),
    setRewards: fun("0xec38a862", "setRewards(address)", {"rewards": p.address}, ),
    setLockedProfitDegradation: fun("0x7a550365", "setLockedProfitDegradation(uint256)", {"degradation": p.uint256}, ),
    setDepositLimit: fun("0xbdc8144b", "setDepositLimit(uint256)", {"limit": p.uint256}, ),
    setPerformanceFee: fun("0x70897b23", "setPerformanceFee(uint256)", {"fee": p.uint256}, ),
    setManagementFee: fun("0xfe56e232", "setManagementFee(uint256)", {"fee": p.uint256}, ),
    setGuardian: fun("0x8a0dac4a", "setGuardian(address)", {"guardian": p.address}, ),
    setEmergencyShutdown: fun("0x14c64402", "setEmergencyShutdown(bool)", {"active": p.bool}, ),
    setWithdrawalQueue: fun("0x94148415", "setWithdrawalQueue(address[20])", {"queue": p.fixedSizeArray(p.address, 20)}, ),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"receiver": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"sender": p.address, "receiver": p.address, "amount": p.uint256}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    permit: fun("0x9fd5a6cf", "permit(address,address,uint256,uint256,bytes)", {"owner": p.address, "spender": p.address, "amount": p.uint256, "expiry": p.uint256, "signature": p.bytes}, p.bool),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    'deposit()': fun("0xd0e30db0", "deposit()", {}, p.uint256),
    'deposit(uint256)': fun("0xb6b55f25", "deposit(uint256)", {"_amount": p.uint256}, p.uint256),
    'deposit(uint256,address)': fun("0x6e553f65", "deposit(uint256,address)", {"_amount": p.uint256, "recipient": p.address}, p.uint256),
    maxAvailableShares: viewFun("0x75de2902", "maxAvailableShares()", {}, p.uint256),
    'withdraw()': fun("0x3ccfd60b", "withdraw()", {}, p.uint256),
    'withdraw(uint256)': fun("0x2e1a7d4d", "withdraw(uint256)", {"maxShares": p.uint256}, p.uint256),
    'withdraw(uint256,address)': fun("0x00f714ce", "withdraw(uint256,address)", {"maxShares": p.uint256, "recipient": p.address}, p.uint256),
    'withdraw(uint256,address,uint256)': fun("0xe63697c8", "withdraw(uint256,address,uint256)", {"maxShares": p.uint256, "recipient": p.address, "maxLoss": p.uint256}, p.uint256),
    pricePerShare: viewFun("0x99530b06", "pricePerShare()", {}, p.uint256),
    addStrategy: fun("0x14b4e26e", "addStrategy(address,uint256,uint256,uint256,uint256)", {"strategy": p.address, "debtRatio": p.uint256, "minDebtPerHarvest": p.uint256, "maxDebtPerHarvest": p.uint256, "performanceFee": p.uint256}, ),
    updateStrategyDebtRatio: fun("0x7c6a4f24", "updateStrategyDebtRatio(address,uint256)", {"strategy": p.address, "debtRatio": p.uint256}, ),
    updateStrategyMinDebtPerHarvest: fun("0xe722befe", "updateStrategyMinDebtPerHarvest(address,uint256)", {"strategy": p.address, "minDebtPerHarvest": p.uint256}, ),
    updateStrategyMaxDebtPerHarvest: fun("0x4757a156", "updateStrategyMaxDebtPerHarvest(address,uint256)", {"strategy": p.address, "maxDebtPerHarvest": p.uint256}, ),
    updateStrategyPerformanceFee: fun("0xd0194ed6", "updateStrategyPerformanceFee(address,uint256)", {"strategy": p.address, "performanceFee": p.uint256}, ),
    migrateStrategy: fun("0x6cb56d19", "migrateStrategy(address,address)", {"oldVersion": p.address, "newVersion": p.address}, ),
    'revokeStrategy()': fun("0xa0e4af9a", "revokeStrategy()", {}, ),
    'revokeStrategy(address)': fun("0xbb994d48", "revokeStrategy(address)", {"strategy": p.address}, ),
    addStrategyToQueue: fun("0xf76e4caa", "addStrategyToQueue(address)", {"strategy": p.address}, ),
    removeStrategyFromQueue: fun("0xb22439f5", "removeStrategyFromQueue(address)", {"strategy": p.address}, ),
    'debtOutstanding()': viewFun("0xbf3759b5", "debtOutstanding()", {}, p.uint256),
    'debtOutstanding(address)': viewFun("0xbdcf36bb", "debtOutstanding(address)", {"strategy": p.address}, p.uint256),
    'creditAvailable()': viewFun("0x112c1f9b", "creditAvailable()", {}, p.uint256),
    'creditAvailable(address)': viewFun("0xd7648013", "creditAvailable(address)", {"strategy": p.address}, p.uint256),
    availableDepositLimit: viewFun("0x153c27c4", "availableDepositLimit()", {}, p.uint256),
    'expectedReturn()': viewFun("0xd3406abd", "expectedReturn()", {}, p.uint256),
    'expectedReturn(address)': viewFun("0x33586b67", "expectedReturn(address)", {"strategy": p.address}, p.uint256),
    report: fun("0xa1d9bafc", "report(uint256,uint256,uint256)", {"gain": p.uint256, "loss": p.uint256, "_debtPayment": p.uint256}, p.uint256),
    'sweep(address)': fun("0x01681a62", "sweep(address)", {"token": p.address}, ),
    'sweep(address,uint256)': fun("0x6ea056a9", "sweep(address,uint256)", {"token": p.address, "amount": p.uint256}, ),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint256),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"arg0": p.address}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"arg0": p.address, "arg1": p.address}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    token: viewFun("0xfc0c546a", "token()", {}, p.address),
    governance: viewFun("0x5aa6e675", "governance()", {}, p.address),
    management: viewFun("0x88a8d602", "management()", {}, p.address),
    guardian: viewFun("0x452a9320", "guardian()", {}, p.address),
    strategies: viewFun("0x39ebf823", "strategies(address)", {"arg0": p.address}, {"performanceFee": p.uint256, "activation": p.uint256, "debtRatio": p.uint256, "minDebtPerHarvest": p.uint256, "maxDebtPerHarvest": p.uint256, "lastReport": p.uint256, "totalDebt": p.uint256, "totalGain": p.uint256, "totalLoss": p.uint256}),
    withdrawalQueue: viewFun("0xc822adda", "withdrawalQueue(uint256)", {"arg0": p.uint256}, p.address),
    emergencyShutdown: viewFun("0x3403c2fc", "emergencyShutdown()", {}, p.bool),
    depositLimit: viewFun("0xecf70858", "depositLimit()", {}, p.uint256),
    debtRatio: viewFun("0xcea55f57", "debtRatio()", {}, p.uint256),
    totalDebt: viewFun("0xfc7b9c18", "totalDebt()", {}, p.uint256),
    lastReport: viewFun("0xc3535b52", "lastReport()", {}, p.uint256),
    activation: viewFun("0x3629c8de", "activation()", {}, p.uint256),
    lockedProfit: viewFun("0x44b81396", "lockedProfit()", {}, p.uint256),
    lockedProfitDegradation: viewFun("0x42232716", "lockedProfitDegradation()", {}, p.uint256),
    rewards: viewFun("0x9ec5a894", "rewards()", {}, p.address),
    managementFee: viewFun("0xa6f7f5d6", "managementFee()", {}, p.uint256),
    performanceFee: viewFun("0x87788782", "performanceFee()", {}, p.uint256),
    nonces: viewFun("0x7ecebe00", "nonces(address)", {"arg0": p.address}, p.uint256),
    DOMAIN_SEPARATOR: viewFun("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
}

export class Contract extends ContractBase {

    apiVersion() {
        return this.eth_call(functions.apiVersion, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    maxAvailableShares() {
        return this.eth_call(functions.maxAvailableShares, {})
    }

    pricePerShare() {
        return this.eth_call(functions.pricePerShare, {})
    }

    'debtOutstanding()'() {
        return this.eth_call(functions['debtOutstanding()'], {})
    }

    'debtOutstanding(address)'(strategy: DebtOutstandingParams_1["strategy"]) {
        return this.eth_call(functions['debtOutstanding(address)'], {strategy})
    }

    'creditAvailable()'() {
        return this.eth_call(functions['creditAvailable()'], {})
    }

    'creditAvailable(address)'(strategy: CreditAvailableParams_1["strategy"]) {
        return this.eth_call(functions['creditAvailable(address)'], {strategy})
    }

    availableDepositLimit() {
        return this.eth_call(functions.availableDepositLimit, {})
    }

    'expectedReturn()'() {
        return this.eth_call(functions['expectedReturn()'], {})
    }

    'expectedReturn(address)'(strategy: ExpectedReturnParams_1["strategy"]) {
        return this.eth_call(functions['expectedReturn(address)'], {strategy})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(functions.balanceOf, {arg0})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(functions.allowance, {arg0, arg1})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    token() {
        return this.eth_call(functions.token, {})
    }

    governance() {
        return this.eth_call(functions.governance, {})
    }

    management() {
        return this.eth_call(functions.management, {})
    }

    guardian() {
        return this.eth_call(functions.guardian, {})
    }

    strategies(arg0: StrategiesParams["arg0"]) {
        return this.eth_call(functions.strategies, {arg0})
    }

    withdrawalQueue(arg0: WithdrawalQueueParams["arg0"]) {
        return this.eth_call(functions.withdrawalQueue, {arg0})
    }

    emergencyShutdown() {
        return this.eth_call(functions.emergencyShutdown, {})
    }

    depositLimit() {
        return this.eth_call(functions.depositLimit, {})
    }

    debtRatio() {
        return this.eth_call(functions.debtRatio, {})
    }

    totalDebt() {
        return this.eth_call(functions.totalDebt, {})
    }

    lastReport() {
        return this.eth_call(functions.lastReport, {})
    }

    activation() {
        return this.eth_call(functions.activation, {})
    }

    lockedProfit() {
        return this.eth_call(functions.lockedProfit, {})
    }

    lockedProfitDegradation() {
        return this.eth_call(functions.lockedProfitDegradation, {})
    }

    rewards() {
        return this.eth_call(functions.rewards, {})
    }

    managementFee() {
        return this.eth_call(functions.managementFee, {})
    }

    performanceFee() {
        return this.eth_call(functions.performanceFee, {})
    }

    nonces(arg0: NoncesParams["arg0"]) {
        return this.eth_call(functions.nonces, {arg0})
    }

    DOMAIN_SEPARATOR() {
        return this.eth_call(functions.DOMAIN_SEPARATOR, {})
    }
}

/// Event types
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type StrategyAddedEventArgs = EParams<typeof events.StrategyAdded>
export type StrategyReportedEventArgs = EParams<typeof events.StrategyReported>
export type UpdateGovernanceEventArgs = EParams<typeof events.UpdateGovernance>
export type UpdateManagementEventArgs = EParams<typeof events.UpdateManagement>
export type UpdateRewardsEventArgs = EParams<typeof events.UpdateRewards>
export type UpdateDepositLimitEventArgs = EParams<typeof events.UpdateDepositLimit>
export type UpdatePerformanceFeeEventArgs = EParams<typeof events.UpdatePerformanceFee>
export type UpdateManagementFeeEventArgs = EParams<typeof events.UpdateManagementFee>
export type UpdateGuardianEventArgs = EParams<typeof events.UpdateGuardian>
export type EmergencyShutdownEventArgs = EParams<typeof events.EmergencyShutdown>
export type UpdateWithdrawalQueueEventArgs = EParams<typeof events.UpdateWithdrawalQueue>
export type StrategyUpdateDebtRatioEventArgs = EParams<typeof events.StrategyUpdateDebtRatio>
export type StrategyUpdateMinDebtPerHarvestEventArgs = EParams<typeof events.StrategyUpdateMinDebtPerHarvest>
export type StrategyUpdateMaxDebtPerHarvestEventArgs = EParams<typeof events.StrategyUpdateMaxDebtPerHarvest>
export type StrategyUpdatePerformanceFeeEventArgs = EParams<typeof events.StrategyUpdatePerformanceFee>
export type StrategyMigratedEventArgs = EParams<typeof events.StrategyMigrated>
export type StrategyRevokedEventArgs = EParams<typeof events.StrategyRevoked>
export type StrategyRemovedFromQueueEventArgs = EParams<typeof events.StrategyRemovedFromQueue>
export type StrategyAddedToQueueEventArgs = EParams<typeof events.StrategyAddedToQueue>

/// Function types
export type InitializeParams_0 = FunctionArguments<typeof functions['initialize(address,address,address,string,string)']>
export type InitializeReturn_0 = FunctionReturn<typeof functions['initialize(address,address,address,string,string)']>

export type InitializeParams_1 = FunctionArguments<typeof functions['initialize(address,address,address,string,string,address)']>
export type InitializeReturn_1 = FunctionReturn<typeof functions['initialize(address,address,address,string,string,address)']>

export type InitializeParams_2 = FunctionArguments<typeof functions['initialize(address,address,address,string,string,address,address)']>
export type InitializeReturn_2 = FunctionReturn<typeof functions['initialize(address,address,address,string,string,address,address)']>

export type ApiVersionParams = FunctionArguments<typeof functions.apiVersion>
export type ApiVersionReturn = FunctionReturn<typeof functions.apiVersion>

export type SetNameParams = FunctionArguments<typeof functions.setName>
export type SetNameReturn = FunctionReturn<typeof functions.setName>

export type SetSymbolParams = FunctionArguments<typeof functions.setSymbol>
export type SetSymbolReturn = FunctionReturn<typeof functions.setSymbol>

export type SetGovernanceParams = FunctionArguments<typeof functions.setGovernance>
export type SetGovernanceReturn = FunctionReturn<typeof functions.setGovernance>

export type AcceptGovernanceParams = FunctionArguments<typeof functions.acceptGovernance>
export type AcceptGovernanceReturn = FunctionReturn<typeof functions.acceptGovernance>

export type SetManagementParams = FunctionArguments<typeof functions.setManagement>
export type SetManagementReturn = FunctionReturn<typeof functions.setManagement>

export type SetRewardsParams = FunctionArguments<typeof functions.setRewards>
export type SetRewardsReturn = FunctionReturn<typeof functions.setRewards>

export type SetLockedProfitDegradationParams = FunctionArguments<typeof functions.setLockedProfitDegradation>
export type SetLockedProfitDegradationReturn = FunctionReturn<typeof functions.setLockedProfitDegradation>

export type SetDepositLimitParams = FunctionArguments<typeof functions.setDepositLimit>
export type SetDepositLimitReturn = FunctionReturn<typeof functions.setDepositLimit>

export type SetPerformanceFeeParams = FunctionArguments<typeof functions.setPerformanceFee>
export type SetPerformanceFeeReturn = FunctionReturn<typeof functions.setPerformanceFee>

export type SetManagementFeeParams = FunctionArguments<typeof functions.setManagementFee>
export type SetManagementFeeReturn = FunctionReturn<typeof functions.setManagementFee>

export type SetGuardianParams = FunctionArguments<typeof functions.setGuardian>
export type SetGuardianReturn = FunctionReturn<typeof functions.setGuardian>

export type SetEmergencyShutdownParams = FunctionArguments<typeof functions.setEmergencyShutdown>
export type SetEmergencyShutdownReturn = FunctionReturn<typeof functions.setEmergencyShutdown>

export type SetWithdrawalQueueParams = FunctionArguments<typeof functions.setWithdrawalQueue>
export type SetWithdrawalQueueReturn = FunctionReturn<typeof functions.setWithdrawalQueue>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type PermitParams = FunctionArguments<typeof functions.permit>
export type PermitReturn = FunctionReturn<typeof functions.permit>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type DepositParams_0 = FunctionArguments<typeof functions['deposit()']>
export type DepositReturn_0 = FunctionReturn<typeof functions['deposit()']>

export type DepositParams_1 = FunctionArguments<typeof functions['deposit(uint256)']>
export type DepositReturn_1 = FunctionReturn<typeof functions['deposit(uint256)']>

export type DepositParams_2 = FunctionArguments<typeof functions['deposit(uint256,address)']>
export type DepositReturn_2 = FunctionReturn<typeof functions['deposit(uint256,address)']>

export type MaxAvailableSharesParams = FunctionArguments<typeof functions.maxAvailableShares>
export type MaxAvailableSharesReturn = FunctionReturn<typeof functions.maxAvailableShares>

export type WithdrawParams_0 = FunctionArguments<typeof functions['withdraw()']>
export type WithdrawReturn_0 = FunctionReturn<typeof functions['withdraw()']>

export type WithdrawParams_1 = FunctionArguments<typeof functions['withdraw(uint256)']>
export type WithdrawReturn_1 = FunctionReturn<typeof functions['withdraw(uint256)']>

export type WithdrawParams_2 = FunctionArguments<typeof functions['withdraw(uint256,address)']>
export type WithdrawReturn_2 = FunctionReturn<typeof functions['withdraw(uint256,address)']>

export type WithdrawParams_3 = FunctionArguments<typeof functions['withdraw(uint256,address,uint256)']>
export type WithdrawReturn_3 = FunctionReturn<typeof functions['withdraw(uint256,address,uint256)']>

export type PricePerShareParams = FunctionArguments<typeof functions.pricePerShare>
export type PricePerShareReturn = FunctionReturn<typeof functions.pricePerShare>

export type AddStrategyParams = FunctionArguments<typeof functions.addStrategy>
export type AddStrategyReturn = FunctionReturn<typeof functions.addStrategy>

export type UpdateStrategyDebtRatioParams = FunctionArguments<typeof functions.updateStrategyDebtRatio>
export type UpdateStrategyDebtRatioReturn = FunctionReturn<typeof functions.updateStrategyDebtRatio>

export type UpdateStrategyMinDebtPerHarvestParams = FunctionArguments<typeof functions.updateStrategyMinDebtPerHarvest>
export type UpdateStrategyMinDebtPerHarvestReturn = FunctionReturn<typeof functions.updateStrategyMinDebtPerHarvest>

export type UpdateStrategyMaxDebtPerHarvestParams = FunctionArguments<typeof functions.updateStrategyMaxDebtPerHarvest>
export type UpdateStrategyMaxDebtPerHarvestReturn = FunctionReturn<typeof functions.updateStrategyMaxDebtPerHarvest>

export type UpdateStrategyPerformanceFeeParams = FunctionArguments<typeof functions.updateStrategyPerformanceFee>
export type UpdateStrategyPerformanceFeeReturn = FunctionReturn<typeof functions.updateStrategyPerformanceFee>

export type MigrateStrategyParams = FunctionArguments<typeof functions.migrateStrategy>
export type MigrateStrategyReturn = FunctionReturn<typeof functions.migrateStrategy>

export type RevokeStrategyParams_0 = FunctionArguments<typeof functions['revokeStrategy()']>
export type RevokeStrategyReturn_0 = FunctionReturn<typeof functions['revokeStrategy()']>

export type RevokeStrategyParams_1 = FunctionArguments<typeof functions['revokeStrategy(address)']>
export type RevokeStrategyReturn_1 = FunctionReturn<typeof functions['revokeStrategy(address)']>

export type AddStrategyToQueueParams = FunctionArguments<typeof functions.addStrategyToQueue>
export type AddStrategyToQueueReturn = FunctionReturn<typeof functions.addStrategyToQueue>

export type RemoveStrategyFromQueueParams = FunctionArguments<typeof functions.removeStrategyFromQueue>
export type RemoveStrategyFromQueueReturn = FunctionReturn<typeof functions.removeStrategyFromQueue>

export type DebtOutstandingParams_0 = FunctionArguments<typeof functions['debtOutstanding()']>
export type DebtOutstandingReturn_0 = FunctionReturn<typeof functions['debtOutstanding()']>

export type DebtOutstandingParams_1 = FunctionArguments<typeof functions['debtOutstanding(address)']>
export type DebtOutstandingReturn_1 = FunctionReturn<typeof functions['debtOutstanding(address)']>

export type CreditAvailableParams_0 = FunctionArguments<typeof functions['creditAvailable()']>
export type CreditAvailableReturn_0 = FunctionReturn<typeof functions['creditAvailable()']>

export type CreditAvailableParams_1 = FunctionArguments<typeof functions['creditAvailable(address)']>
export type CreditAvailableReturn_1 = FunctionReturn<typeof functions['creditAvailable(address)']>

export type AvailableDepositLimitParams = FunctionArguments<typeof functions.availableDepositLimit>
export type AvailableDepositLimitReturn = FunctionReturn<typeof functions.availableDepositLimit>

export type ExpectedReturnParams_0 = FunctionArguments<typeof functions['expectedReturn()']>
export type ExpectedReturnReturn_0 = FunctionReturn<typeof functions['expectedReturn()']>

export type ExpectedReturnParams_1 = FunctionArguments<typeof functions['expectedReturn(address)']>
export type ExpectedReturnReturn_1 = FunctionReturn<typeof functions['expectedReturn(address)']>

export type ReportParams = FunctionArguments<typeof functions.report>
export type ReportReturn = FunctionReturn<typeof functions.report>

export type SweepParams_0 = FunctionArguments<typeof functions['sweep(address)']>
export type SweepReturn_0 = FunctionReturn<typeof functions['sweep(address)']>

export type SweepParams_1 = FunctionArguments<typeof functions['sweep(address,uint256)']>
export type SweepReturn_1 = FunctionReturn<typeof functions['sweep(address,uint256)']>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type GovernanceParams = FunctionArguments<typeof functions.governance>
export type GovernanceReturn = FunctionReturn<typeof functions.governance>

export type ManagementParams = FunctionArguments<typeof functions.management>
export type ManagementReturn = FunctionReturn<typeof functions.management>

export type GuardianParams = FunctionArguments<typeof functions.guardian>
export type GuardianReturn = FunctionReturn<typeof functions.guardian>

export type StrategiesParams = FunctionArguments<typeof functions.strategies>
export type StrategiesReturn = FunctionReturn<typeof functions.strategies>

export type WithdrawalQueueParams = FunctionArguments<typeof functions.withdrawalQueue>
export type WithdrawalQueueReturn = FunctionReturn<typeof functions.withdrawalQueue>

export type EmergencyShutdownParams = FunctionArguments<typeof functions.emergencyShutdown>
export type EmergencyShutdownReturn = FunctionReturn<typeof functions.emergencyShutdown>

export type DepositLimitParams = FunctionArguments<typeof functions.depositLimit>
export type DepositLimitReturn = FunctionReturn<typeof functions.depositLimit>

export type DebtRatioParams = FunctionArguments<typeof functions.debtRatio>
export type DebtRatioReturn = FunctionReturn<typeof functions.debtRatio>

export type TotalDebtParams = FunctionArguments<typeof functions.totalDebt>
export type TotalDebtReturn = FunctionReturn<typeof functions.totalDebt>

export type LastReportParams = FunctionArguments<typeof functions.lastReport>
export type LastReportReturn = FunctionReturn<typeof functions.lastReport>

export type ActivationParams = FunctionArguments<typeof functions.activation>
export type ActivationReturn = FunctionReturn<typeof functions.activation>

export type LockedProfitParams = FunctionArguments<typeof functions.lockedProfit>
export type LockedProfitReturn = FunctionReturn<typeof functions.lockedProfit>

export type LockedProfitDegradationParams = FunctionArguments<typeof functions.lockedProfitDegradation>
export type LockedProfitDegradationReturn = FunctionReturn<typeof functions.lockedProfitDegradation>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type ManagementFeeParams = FunctionArguments<typeof functions.managementFee>
export type ManagementFeeReturn = FunctionReturn<typeof functions.managementFee>

export type PerformanceFeeParams = FunctionArguments<typeof functions.performanceFee>
export type PerformanceFeeReturn = FunctionReturn<typeof functions.performanceFee>

export type NoncesParams = FunctionArguments<typeof functions.nonces>
export type NoncesReturn = FunctionReturn<typeof functions.nonces>

export type DOMAIN_SEPARATORParams = FunctionArguments<typeof functions.DOMAIN_SEPARATOR>
export type DOMAIN_SEPARATORReturn = FunctionReturn<typeof functions.DOMAIN_SEPARATOR>

