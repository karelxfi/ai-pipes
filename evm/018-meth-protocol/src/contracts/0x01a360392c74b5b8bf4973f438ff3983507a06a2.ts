import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AllocatedETHToDeposits: event("0x9d04ecb465d2c8754acb798a22293dd26215a1c2f7a2a56607afa215c1aadc77", "AllocatedETHToDeposits(uint256)", {"amount": p.uint256}),
    AllocatedETHToLiquidityBuffer: event("0x9ad8dfd80f6133e7b25d5bea633a9c94aa5cb4bcbc56fb2738a7dc4b06733884", "AllocatedETHToLiquidityBuffer(uint256)", {"amount": p.uint256}),
    AllocatedETHToUnstakeRequestsManager: event("0xfe89805cf5299ef9fbd1d1ddefb8dcc3fa9408064d2ea31e3fca6565768f5217", "AllocatedETHToUnstakeRequestsManager(uint256)", {"amount": p.uint256}),
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", "Initialized(uint8)", {"version": p.uint8}),
    ProtocolConfigChanged: event("0x01d854e8dde9402801a4c6f2840193465752abfad61e0bb7c4258d526ae42e74", "ProtocolConfigChanged(bytes4,string,bytes)", {"setterSelector": indexed(p.bytes4), "setterSignature": p.string, "value": p.bytes}),
    ReturnsReceived: event("0x4cbb9d73b003a252cee3f2ee51d8d65a562af35eebb23730dd4a76d68127b370", "ReturnsReceived(uint256)", {"amount": p.uint256}),
    ReturnsReceivedFromLiquidityBuffer: event("0xdbc324463c07bdb2a814fd79ec8d5159e2e1f1efec51a70fbda9ba820023d89a", "ReturnsReceivedFromLiquidityBuffer(uint256)", {"amount": p.uint256}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", "RoleAdminChanged(bytes32,bytes32,bytes32)", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", "RoleGranted(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", "RoleRevoked(bytes32,address,address)", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Staked: event("0x1449c6dd7851abc30abf37f57715f492010519147cc2652fbc38202c18a6ee90", "Staked(address,uint256,uint256)", {"staker": indexed(p.address), "ethAmount": p.uint256, "mETHAmount": p.uint256}),
    UnstakeRequestClaimed: event("0xbac6b2cb68f9205537fb1489571de5d98c9492cd5e1c7581b81cbb5932753aa8", "UnstakeRequestClaimed(uint256,address)", {"id": indexed(p.uint256), "staker": indexed(p.address)}),
    UnstakeRequested: event("0xcbb10a3603d92dc1f9db6996b88539fbd521bb4144891e34c75b05c341c18379", "UnstakeRequested(uint256,address,uint256,uint256)", {"id": indexed(p.uint256), "staker": indexed(p.address), "ethAmount": p.uint256, "mETHLocked": p.uint256}),
    ValidatorInitiated: event("0x15f16c2e13e50235799a97b981bf4a66c8cd86051f06aca745c5ff26f39b330e", "ValidatorInitiated(bytes32,uint256,bytes,uint256)", {"id": indexed(p.bytes32), "operatorID": indexed(p.uint256), "pubkey": p.bytes, "amountDeposited": p.uint256}),
}

export const functions = {
    ALLOCATOR_SERVICE_ROLE: viewFun("0x3101d910", "ALLOCATOR_SERVICE_ROLE()", {}, p.bytes32),
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", "DEFAULT_ADMIN_ROLE()", {}, p.bytes32),
    INITIATOR_SERVICE_ROLE: viewFun("0x19efd5c7", "INITIATOR_SERVICE_ROLE()", {}, p.bytes32),
    STAKING_ALLOWLIST_MANAGER_ROLE: viewFun("0xe55d6cc0", "STAKING_ALLOWLIST_MANAGER_ROLE()", {}, p.bytes32),
    STAKING_ALLOWLIST_ROLE: viewFun("0x89e80ed3", "STAKING_ALLOWLIST_ROLE()", {}, p.bytes32),
    STAKING_MANAGER_ROLE: viewFun("0x3937c0b3", "STAKING_MANAGER_ROLE()", {}, p.bytes32),
    TOP_UP_ROLE: viewFun("0x6fce8ab2", "TOP_UP_ROLE()", {}, p.bytes32),
    allocateETH: fun("0xec96e93c", "allocateETH(uint256,uint256,uint256)", {"allocateToUnstakeRequestsManager": p.uint256, "allocateToDeposits": p.uint256, "allocateToLiquidityBuffer": p.uint256}, ),
    allocatedETHForDeposits: viewFun("0xea452b6d", "allocatedETHForDeposits()", {}, p.uint256),
    claimUnstakeRequest: fun("0x2bf67650", "claimUnstakeRequest(uint256)", {"unstakeRequestID": p.uint256}, ),
    depositContract: viewFun("0xe94ad65b", "depositContract()", {}, p.address),
    ethToMETH: viewFun("0x4461ff05", "ethToMETH(uint256)", {"ethAmount": p.uint256}, p.uint256),
    exchangeAdjustmentRate: viewFun("0x0633af76", "exchangeAdjustmentRate()", {}, p.uint16),
    getRoleAdmin: viewFun("0x248a9ca3", "getRoleAdmin(bytes32)", {"role": p.bytes32}, p.bytes32),
    getRoleMember: viewFun("0x9010d07c", "getRoleMember(bytes32,uint256)", {"role": p.bytes32, "index": p.uint256}, p.address),
    getRoleMemberCount: viewFun("0xca15c873", "getRoleMemberCount(bytes32)", {"role": p.bytes32}, p.uint256),
    grantRole: fun("0x2f2ff15d", "grantRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", "hasRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, p.bool),
    initializationBlockNumber: viewFun("0xb91590b2", "initializationBlockNumber()", {}, p.uint256),
    initialize: fun("0xbc3950c5", "initialize((address,address,address,address,address,address,address,address,address,address,address))", {"init": p.struct({"admin": p.address, "manager": p.address, "allocatorService": p.address, "initiatorService": p.address, "returnsAggregator": p.address, "withdrawalWallet": p.address, "mETH": p.address, "depositContract": p.address, "oracle": p.address, "pauser": p.address, "unstakeRequestsManager": p.address})}, ),
    initializeV2: fun("0x29b6eca9", "initializeV2(address)", {"lb": p.address}, ),
    initiateValidatorsWithDeposits: fun("0x0208e4b5", "initiateValidatorsWithDeposits((uint256,uint256,bytes,bytes,bytes,bytes32)[],bytes32)", {"validators": p.array(p.struct({"operatorID": p.uint256, "depositAmount": p.uint256, "pubkey": p.bytes, "withdrawalCredentials": p.bytes, "signature": p.bytes, "depositDataRoot": p.bytes32})), "expectedDepositRoot": p.bytes32}, ),
    isStakingAllowlist: viewFun("0x42d3915d", "isStakingAllowlist()", {}, p.bool),
    liquidityBuffer: viewFun("0xcc3f4e20", "liquidityBuffer()", {}, p.address),
    mETH: viewFun("0x29e84867", "mETH()", {}, p.address),
    mETHToETH: viewFun("0x5890c11c", "mETHToETH(uint256)", {"mETHAmount": p.uint256}, p.uint256),
    maximumDepositAmount: viewFun("0x78abb49b", "maximumDepositAmount()", {}, p.uint256),
    maximumMETHSupply: viewFun("0x53e105fc", "maximumMETHSupply()", {}, p.uint256),
    minimumDepositAmount: viewFun("0x080c279a", "minimumDepositAmount()", {}, p.uint256),
    minimumStakeBound: viewFun("0xb12de586", "minimumStakeBound()", {}, p.uint256),
    minimumUnstakeBound: viewFun("0x35ead2a4", "minimumUnstakeBound()", {}, p.uint256),
    numInitiatedValidators: viewFun("0xbb635c65", "numInitiatedValidators()", {}, p.uint256),
    oracle: viewFun("0x7dc0d1d0", "oracle()", {}, p.address),
    pauser: viewFun("0x9fd0506d", "pauser()", {}, p.address),
    receiveFromUnstakeRequestsManager: fun("0xc151aa72", "receiveFromUnstakeRequestsManager()", {}, ),
    receiveReturns: fun("0x808d663f", "receiveReturns()", {}, ),
    receiveReturnsFromLiquidityBuffer: fun("0x1103f1d3", "receiveReturnsFromLiquidityBuffer()", {}, ),
    reclaimAllocatedETHSurplus: fun("0x1943190d", "reclaimAllocatedETHSurplus()", {}, ),
    renounceRole: fun("0x36568abe", "renounceRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    returnsAggregator: viewFun("0x3f550b3a", "returnsAggregator()", {}, p.address),
    revokeRole: fun("0xd547741f", "revokeRole(bytes32,address)", {"role": p.bytes32, "account": p.address}, ),
    setExchangeAdjustmentRate: fun("0x29d48704", "setExchangeAdjustmentRate(uint16)", {"exchangeAdjustmentRate_": p.uint16}, ),
    setMaximumDepositAmount: fun("0xd70a6f31", "setMaximumDepositAmount(uint256)", {"maximumDepositAmount_": p.uint256}, ),
    setMaximumMETHSupply: fun("0x729d5334", "setMaximumMETHSupply(uint256)", {"maximumMETHSupply_": p.uint256}, ),
    setMinimumDepositAmount: fun("0xaab483d6", "setMinimumDepositAmount(uint256)", {"minimumDepositAmount_": p.uint256}, ),
    setMinimumStakeBound: fun("0x008db05b", "setMinimumStakeBound(uint256)", {"minimumStakeBound_": p.uint256}, ),
    setMinimumUnstakeBound: fun("0x99dd1deb", "setMinimumUnstakeBound(uint256)", {"minimumUnstakeBound_": p.uint256}, ),
    setStakingAllowlist: fun("0x04f36cc2", "setStakingAllowlist(bool)", {"isStakingAllowlist_": p.bool}, ),
    setWithdrawalWallet: fun("0x75796f76", "setWithdrawalWallet(address)", {"withdrawalWallet_": p.address}, ),
    stake: fun("0xa694fc3a", "stake(uint256)", {"minMETHAmount": p.uint256}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    topUp: fun("0xdc29f1de", "topUp()", {}, ),
    totalControlled: viewFun("0x5940d90b", "totalControlled()", {}, p.uint256),
    totalDepositedInValidators: viewFun("0x60a0f628", "totalDepositedInValidators()", {}, p.uint256),
    unallocatedETH: viewFun("0x7dfcdd29", "unallocatedETH()", {}, p.uint256),
    unstakeRequest: fun("0x891ef43e", "unstakeRequest(uint128,uint128)", {"methAmount": p.uint128, "minETHAmount": p.uint128}, p.uint256),
    unstakeRequestInfo: viewFun("0xf1ec1e97", "unstakeRequestInfo(uint256)", {"unstakeRequestID": p.uint256}, {"_0": p.bool, "_1": p.uint256}),
    unstakeRequestWithPermit: fun("0xb064d461", "unstakeRequestWithPermit(uint128,uint128,uint256,uint8,bytes32,bytes32)", {"methAmount": p.uint128, "minETHAmount": p.uint128, "deadline": p.uint256, "v": p.uint8, "r": p.bytes32, "s": p.bytes32}, p.uint256),
    unstakeRequestsManager: viewFun("0x854a63f6", "unstakeRequestsManager()", {}, p.address),
    usedValidators: viewFun("0x5915ded1", "usedValidators(bytes)", {"pubkey": p.bytes}, p.bool),
    withdrawalWallet: viewFun("0x4a7d80b3", "withdrawalWallet()", {}, p.address),
}

export class Contract extends ContractBase {

    ALLOCATOR_SERVICE_ROLE() {
        return this.eth_call(functions.ALLOCATOR_SERVICE_ROLE, {})
    }

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    INITIATOR_SERVICE_ROLE() {
        return this.eth_call(functions.INITIATOR_SERVICE_ROLE, {})
    }

    STAKING_ALLOWLIST_MANAGER_ROLE() {
        return this.eth_call(functions.STAKING_ALLOWLIST_MANAGER_ROLE, {})
    }

    STAKING_ALLOWLIST_ROLE() {
        return this.eth_call(functions.STAKING_ALLOWLIST_ROLE, {})
    }

    STAKING_MANAGER_ROLE() {
        return this.eth_call(functions.STAKING_MANAGER_ROLE, {})
    }

    TOP_UP_ROLE() {
        return this.eth_call(functions.TOP_UP_ROLE, {})
    }

    allocatedETHForDeposits() {
        return this.eth_call(functions.allocatedETHForDeposits, {})
    }

    depositContract() {
        return this.eth_call(functions.depositContract, {})
    }

    ethToMETH(ethAmount: EthToMETHParams["ethAmount"]) {
        return this.eth_call(functions.ethToMETH, {ethAmount})
    }

    exchangeAdjustmentRate() {
        return this.eth_call(functions.exchangeAdjustmentRate, {})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    getRoleMember(role: GetRoleMemberParams["role"], index: GetRoleMemberParams["index"]) {
        return this.eth_call(functions.getRoleMember, {role, index})
    }

    getRoleMemberCount(role: GetRoleMemberCountParams["role"]) {
        return this.eth_call(functions.getRoleMemberCount, {role})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    initializationBlockNumber() {
        return this.eth_call(functions.initializationBlockNumber, {})
    }

    isStakingAllowlist() {
        return this.eth_call(functions.isStakingAllowlist, {})
    }

    liquidityBuffer() {
        return this.eth_call(functions.liquidityBuffer, {})
    }

    mETH() {
        return this.eth_call(functions.mETH, {})
    }

    mETHToETH(mETHAmount: METHToETHParams["mETHAmount"]) {
        return this.eth_call(functions.mETHToETH, {mETHAmount})
    }

    maximumDepositAmount() {
        return this.eth_call(functions.maximumDepositAmount, {})
    }

    maximumMETHSupply() {
        return this.eth_call(functions.maximumMETHSupply, {})
    }

    minimumDepositAmount() {
        return this.eth_call(functions.minimumDepositAmount, {})
    }

    minimumStakeBound() {
        return this.eth_call(functions.minimumStakeBound, {})
    }

    minimumUnstakeBound() {
        return this.eth_call(functions.minimumUnstakeBound, {})
    }

    numInitiatedValidators() {
        return this.eth_call(functions.numInitiatedValidators, {})
    }

    oracle() {
        return this.eth_call(functions.oracle, {})
    }

    pauser() {
        return this.eth_call(functions.pauser, {})
    }

    returnsAggregator() {
        return this.eth_call(functions.returnsAggregator, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    totalControlled() {
        return this.eth_call(functions.totalControlled, {})
    }

    totalDepositedInValidators() {
        return this.eth_call(functions.totalDepositedInValidators, {})
    }

    unallocatedETH() {
        return this.eth_call(functions.unallocatedETH, {})
    }

    unstakeRequestInfo(unstakeRequestID: UnstakeRequestInfoParams["unstakeRequestID"]) {
        return this.eth_call(functions.unstakeRequestInfo, {unstakeRequestID})
    }

    unstakeRequestsManager() {
        return this.eth_call(functions.unstakeRequestsManager, {})
    }

    usedValidators(pubkey: UsedValidatorsParams["pubkey"]) {
        return this.eth_call(functions.usedValidators, {pubkey})
    }

    withdrawalWallet() {
        return this.eth_call(functions.withdrawalWallet, {})
    }
}

/// Event types
export type AllocatedETHToDepositsEventArgs = EParams<typeof events.AllocatedETHToDeposits>
export type AllocatedETHToLiquidityBufferEventArgs = EParams<typeof events.AllocatedETHToLiquidityBuffer>
export type AllocatedETHToUnstakeRequestsManagerEventArgs = EParams<typeof events.AllocatedETHToUnstakeRequestsManager>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type ProtocolConfigChangedEventArgs = EParams<typeof events.ProtocolConfigChanged>
export type ReturnsReceivedEventArgs = EParams<typeof events.ReturnsReceived>
export type ReturnsReceivedFromLiquidityBufferEventArgs = EParams<typeof events.ReturnsReceivedFromLiquidityBuffer>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type StakedEventArgs = EParams<typeof events.Staked>
export type UnstakeRequestClaimedEventArgs = EParams<typeof events.UnstakeRequestClaimed>
export type UnstakeRequestedEventArgs = EParams<typeof events.UnstakeRequested>
export type ValidatorInitiatedEventArgs = EParams<typeof events.ValidatorInitiated>

/// Function types
export type ALLOCATOR_SERVICE_ROLEParams = FunctionArguments<typeof functions.ALLOCATOR_SERVICE_ROLE>
export type ALLOCATOR_SERVICE_ROLEReturn = FunctionReturn<typeof functions.ALLOCATOR_SERVICE_ROLE>

export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type INITIATOR_SERVICE_ROLEParams = FunctionArguments<typeof functions.INITIATOR_SERVICE_ROLE>
export type INITIATOR_SERVICE_ROLEReturn = FunctionReturn<typeof functions.INITIATOR_SERVICE_ROLE>

export type STAKING_ALLOWLIST_MANAGER_ROLEParams = FunctionArguments<typeof functions.STAKING_ALLOWLIST_MANAGER_ROLE>
export type STAKING_ALLOWLIST_MANAGER_ROLEReturn = FunctionReturn<typeof functions.STAKING_ALLOWLIST_MANAGER_ROLE>

export type STAKING_ALLOWLIST_ROLEParams = FunctionArguments<typeof functions.STAKING_ALLOWLIST_ROLE>
export type STAKING_ALLOWLIST_ROLEReturn = FunctionReturn<typeof functions.STAKING_ALLOWLIST_ROLE>

export type STAKING_MANAGER_ROLEParams = FunctionArguments<typeof functions.STAKING_MANAGER_ROLE>
export type STAKING_MANAGER_ROLEReturn = FunctionReturn<typeof functions.STAKING_MANAGER_ROLE>

export type TOP_UP_ROLEParams = FunctionArguments<typeof functions.TOP_UP_ROLE>
export type TOP_UP_ROLEReturn = FunctionReturn<typeof functions.TOP_UP_ROLE>

export type AllocateETHParams = FunctionArguments<typeof functions.allocateETH>
export type AllocateETHReturn = FunctionReturn<typeof functions.allocateETH>

export type AllocatedETHForDepositsParams = FunctionArguments<typeof functions.allocatedETHForDeposits>
export type AllocatedETHForDepositsReturn = FunctionReturn<typeof functions.allocatedETHForDeposits>

export type ClaimUnstakeRequestParams = FunctionArguments<typeof functions.claimUnstakeRequest>
export type ClaimUnstakeRequestReturn = FunctionReturn<typeof functions.claimUnstakeRequest>

export type DepositContractParams = FunctionArguments<typeof functions.depositContract>
export type DepositContractReturn = FunctionReturn<typeof functions.depositContract>

export type EthToMETHParams = FunctionArguments<typeof functions.ethToMETH>
export type EthToMETHReturn = FunctionReturn<typeof functions.ethToMETH>

export type ExchangeAdjustmentRateParams = FunctionArguments<typeof functions.exchangeAdjustmentRate>
export type ExchangeAdjustmentRateReturn = FunctionReturn<typeof functions.exchangeAdjustmentRate>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetRoleMemberParams = FunctionArguments<typeof functions.getRoleMember>
export type GetRoleMemberReturn = FunctionReturn<typeof functions.getRoleMember>

export type GetRoleMemberCountParams = FunctionArguments<typeof functions.getRoleMemberCount>
export type GetRoleMemberCountReturn = FunctionReturn<typeof functions.getRoleMemberCount>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializationBlockNumberParams = FunctionArguments<typeof functions.initializationBlockNumber>
export type InitializationBlockNumberReturn = FunctionReturn<typeof functions.initializationBlockNumber>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type InitializeV2Params = FunctionArguments<typeof functions.initializeV2>
export type InitializeV2Return = FunctionReturn<typeof functions.initializeV2>

export type InitiateValidatorsWithDepositsParams = FunctionArguments<typeof functions.initiateValidatorsWithDeposits>
export type InitiateValidatorsWithDepositsReturn = FunctionReturn<typeof functions.initiateValidatorsWithDeposits>

export type IsStakingAllowlistParams = FunctionArguments<typeof functions.isStakingAllowlist>
export type IsStakingAllowlistReturn = FunctionReturn<typeof functions.isStakingAllowlist>

export type LiquidityBufferParams = FunctionArguments<typeof functions.liquidityBuffer>
export type LiquidityBufferReturn = FunctionReturn<typeof functions.liquidityBuffer>

export type METHParams = FunctionArguments<typeof functions.mETH>
export type METHReturn = FunctionReturn<typeof functions.mETH>

export type METHToETHParams = FunctionArguments<typeof functions.mETHToETH>
export type METHToETHReturn = FunctionReturn<typeof functions.mETHToETH>

export type MaximumDepositAmountParams = FunctionArguments<typeof functions.maximumDepositAmount>
export type MaximumDepositAmountReturn = FunctionReturn<typeof functions.maximumDepositAmount>

export type MaximumMETHSupplyParams = FunctionArguments<typeof functions.maximumMETHSupply>
export type MaximumMETHSupplyReturn = FunctionReturn<typeof functions.maximumMETHSupply>

export type MinimumDepositAmountParams = FunctionArguments<typeof functions.minimumDepositAmount>
export type MinimumDepositAmountReturn = FunctionReturn<typeof functions.minimumDepositAmount>

export type MinimumStakeBoundParams = FunctionArguments<typeof functions.minimumStakeBound>
export type MinimumStakeBoundReturn = FunctionReturn<typeof functions.minimumStakeBound>

export type MinimumUnstakeBoundParams = FunctionArguments<typeof functions.minimumUnstakeBound>
export type MinimumUnstakeBoundReturn = FunctionReturn<typeof functions.minimumUnstakeBound>

export type NumInitiatedValidatorsParams = FunctionArguments<typeof functions.numInitiatedValidators>
export type NumInitiatedValidatorsReturn = FunctionReturn<typeof functions.numInitiatedValidators>

export type OracleParams = FunctionArguments<typeof functions.oracle>
export type OracleReturn = FunctionReturn<typeof functions.oracle>

export type PauserParams = FunctionArguments<typeof functions.pauser>
export type PauserReturn = FunctionReturn<typeof functions.pauser>

export type ReceiveFromUnstakeRequestsManagerParams = FunctionArguments<typeof functions.receiveFromUnstakeRequestsManager>
export type ReceiveFromUnstakeRequestsManagerReturn = FunctionReturn<typeof functions.receiveFromUnstakeRequestsManager>

export type ReceiveReturnsParams = FunctionArguments<typeof functions.receiveReturns>
export type ReceiveReturnsReturn = FunctionReturn<typeof functions.receiveReturns>

export type ReceiveReturnsFromLiquidityBufferParams = FunctionArguments<typeof functions.receiveReturnsFromLiquidityBuffer>
export type ReceiveReturnsFromLiquidityBufferReturn = FunctionReturn<typeof functions.receiveReturnsFromLiquidityBuffer>

export type ReclaimAllocatedETHSurplusParams = FunctionArguments<typeof functions.reclaimAllocatedETHSurplus>
export type ReclaimAllocatedETHSurplusReturn = FunctionReturn<typeof functions.reclaimAllocatedETHSurplus>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type ReturnsAggregatorParams = FunctionArguments<typeof functions.returnsAggregator>
export type ReturnsAggregatorReturn = FunctionReturn<typeof functions.returnsAggregator>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type SetExchangeAdjustmentRateParams = FunctionArguments<typeof functions.setExchangeAdjustmentRate>
export type SetExchangeAdjustmentRateReturn = FunctionReturn<typeof functions.setExchangeAdjustmentRate>

export type SetMaximumDepositAmountParams = FunctionArguments<typeof functions.setMaximumDepositAmount>
export type SetMaximumDepositAmountReturn = FunctionReturn<typeof functions.setMaximumDepositAmount>

export type SetMaximumMETHSupplyParams = FunctionArguments<typeof functions.setMaximumMETHSupply>
export type SetMaximumMETHSupplyReturn = FunctionReturn<typeof functions.setMaximumMETHSupply>

export type SetMinimumDepositAmountParams = FunctionArguments<typeof functions.setMinimumDepositAmount>
export type SetMinimumDepositAmountReturn = FunctionReturn<typeof functions.setMinimumDepositAmount>

export type SetMinimumStakeBoundParams = FunctionArguments<typeof functions.setMinimumStakeBound>
export type SetMinimumStakeBoundReturn = FunctionReturn<typeof functions.setMinimumStakeBound>

export type SetMinimumUnstakeBoundParams = FunctionArguments<typeof functions.setMinimumUnstakeBound>
export type SetMinimumUnstakeBoundReturn = FunctionReturn<typeof functions.setMinimumUnstakeBound>

export type SetStakingAllowlistParams = FunctionArguments<typeof functions.setStakingAllowlist>
export type SetStakingAllowlistReturn = FunctionReturn<typeof functions.setStakingAllowlist>

export type SetWithdrawalWalletParams = FunctionArguments<typeof functions.setWithdrawalWallet>
export type SetWithdrawalWalletReturn = FunctionReturn<typeof functions.setWithdrawalWallet>

export type StakeParams = FunctionArguments<typeof functions.stake>
export type StakeReturn = FunctionReturn<typeof functions.stake>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TopUpParams = FunctionArguments<typeof functions.topUp>
export type TopUpReturn = FunctionReturn<typeof functions.topUp>

export type TotalControlledParams = FunctionArguments<typeof functions.totalControlled>
export type TotalControlledReturn = FunctionReturn<typeof functions.totalControlled>

export type TotalDepositedInValidatorsParams = FunctionArguments<typeof functions.totalDepositedInValidators>
export type TotalDepositedInValidatorsReturn = FunctionReturn<typeof functions.totalDepositedInValidators>

export type UnallocatedETHParams = FunctionArguments<typeof functions.unallocatedETH>
export type UnallocatedETHReturn = FunctionReturn<typeof functions.unallocatedETH>

export type UnstakeRequestParams = FunctionArguments<typeof functions.unstakeRequest>
export type UnstakeRequestReturn = FunctionReturn<typeof functions.unstakeRequest>

export type UnstakeRequestInfoParams = FunctionArguments<typeof functions.unstakeRequestInfo>
export type UnstakeRequestInfoReturn = FunctionReturn<typeof functions.unstakeRequestInfo>

export type UnstakeRequestWithPermitParams = FunctionArguments<typeof functions.unstakeRequestWithPermit>
export type UnstakeRequestWithPermitReturn = FunctionReturn<typeof functions.unstakeRequestWithPermit>

export type UnstakeRequestsManagerParams = FunctionArguments<typeof functions.unstakeRequestsManager>
export type UnstakeRequestsManagerReturn = FunctionReturn<typeof functions.unstakeRequestsManager>

export type UsedValidatorsParams = FunctionArguments<typeof functions.usedValidators>
export type UsedValidatorsReturn = FunctionReturn<typeof functions.usedValidators>

export type WithdrawalWalletParams = FunctionArguments<typeof functions.withdrawalWallet>
export type WithdrawalWalletReturn = FunctionReturn<typeof functions.withdrawalWallet>

