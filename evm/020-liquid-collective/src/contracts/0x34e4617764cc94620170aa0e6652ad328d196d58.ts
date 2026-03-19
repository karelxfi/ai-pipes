import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    ConsensusLayerDataUpdate: event("0x25d7358447891786a139ae7149548f3232a8c95f2ea6065c69c5bd7c39cd386c", "ConsensusLayerDataUpdate(uint256,uint256,bytes32)", {"validatorCount": p.uint256, "validatorTotalBalance": p.uint256, "roundId": p.bytes32}),
    Initialize: event("0x1809e49bba43f2d39fa57894b50cd6ccb428cc438230e065cac3eb24a1355a71", "Initialize(uint256,bytes)", {"version": p.uint256, "cdata": p.bytes}),
    ProcessedConsensusLayerReport: event("0x49ac0d2bb2a688ca460f7993eb93eccd3b9c9188da6b0727e9a409cf8b105875", "ProcessedConsensusLayerReport((uint256,uint256,uint256,uint256,uint256,uint32,uint32[],bool,bool),(uint256,uint256,uint256,uint256))", {"report": p.struct({"epoch": p.uint256, "validatorsBalance": p.uint256, "validatorsSkimmedBalance": p.uint256, "validatorsExitedBalance": p.uint256, "validatorsExitingBalance": p.uint256, "validatorsCount": p.uint32, "stoppedValidatorCountPerOperator": p.array(p.uint32), "rebalanceDepositToRedeemMode": p.bool, "slashingContainmentMode": p.bool}), "trace": p.struct({"rewards": p.uint256, "pulledELFees": p.uint256, "pulledRedeemManagerExceedingEthBuffer": p.uint256, "pulledCoverageFunds": p.uint256})}),
    PulledCLFunds: event("0xcb5410dc8f29b2f498e023c3f9237dbd600255a717edf94a6072bcd03b0c773c", "PulledCLFunds(uint256,uint256)", {"pulledSkimmedEthAmount": p.uint256, "pullExitedEthAmount": p.uint256}),
    PulledCoverageFunds: event("0xd500b67e5bd8019c0af744cadeec120d1b5e3d3a3a011f18cf182aa4c97947b6", "PulledCoverageFunds(uint256)", {"amount": p.uint256}),
    PulledELFees: event("0xda841d3042d792e2509a333b9dcbd4b3dd9b9047d382011f8788fab90ca7e3c7", "PulledELFees(uint256)", {"amount": p.uint256}),
    PulledRedeemManagerExceedingEth: event("0x4e484734eb4d444bfa106f917d05d9ceb8ce18bf516c85d7aeb9b322925339f9", "PulledRedeemManagerExceedingEth(uint256)", {"amount": p.uint256}),
    ReportedRedeemManager: event("0x709263092d8d9fef472d907900405b5edae3d76f8ff4354858025b18424d7101", "ReportedRedeemManager(uint256,uint256,uint256)", {"redeemManagerDemand": p.uint256, "suppliedRedeemManagerDemand": p.uint256, "suppliedRedeemManagerDemandInEth": p.uint256}),
    RewardsEarned: event("0x3d1669e813a9845c288f0e1f642a4343a451103b87886d12de37e63b39bbd942", "RewardsEarned(address,uint256,uint256,uint256,uint256)", {"_collector": indexed(p.address), "_oldTotalUnderlyingBalance": p.uint256, "_oldTotalSupply": p.uint256, "_newTotalUnderlyingBalance": p.uint256, "_newTotalSupply": p.uint256}),
    SetAdmin: event("0x5a272403b402d892977df56625f4164ccaf70ca3863991c43ecfe76a6905b0a1", "SetAdmin(address)", {"admin": indexed(p.address)}),
    SetAllowlist: event("0x30f015a5d3c72c0a9414538199baa022323a483fa9e4ba2cd581596cf8ca0424", "SetAllowlist(address)", {"allowlist": indexed(p.address)}),
    SetBalanceCommittedToDeposit: event("0x86fd21e9b5bd76b20471c7f93a82aa4e25c37d48b179bda0a4d1a45e22a842f4", "SetBalanceCommittedToDeposit(uint256,uint256)", {"oldAmount": p.uint256, "newAmount": p.uint256}),
    SetBalanceToDeposit: event("0x48f67c1dada0cab2163f6282292ad97ea97376cfed46bb3851654aaa630db727", "SetBalanceToDeposit(uint256,uint256)", {"oldAmount": p.uint256, "newAmount": p.uint256}),
    SetBalanceToRedeem: event("0x215c2b83e8c232e42091088056ab75d2ff643855c32997024f786cddb22d2290", "SetBalanceToRedeem(uint256,uint256)", {"oldAmount": p.uint256, "newAmount": p.uint256}),
    SetBounds: event("0x5ab79ffcd89b6380c7fbdd89d02cfe3d9c53c99a85e150c2319075018d1aac5c", "SetBounds(uint256,uint256)", {"annualAprUpperBound": p.uint256, "relativeLowerBound": p.uint256}),
    SetCollector: event("0x0cc5437d7c9c1d9eab549acbb533eea3e9868e9443dd75309ed5820b33a3774e", "SetCollector(address)", {"collector": indexed(p.address)}),
    SetCoverageFund: event("0x67b26a33f305cc027b2d45b2f6f418793afcd3e22f7376afa7be068ce18604e8", "SetCoverageFund(address)", {"coverageFund": indexed(p.address)}),
    SetDepositContractAddress: event("0x00043cf7635f276413ae358250286a479a631abd9d74d57d4aa0bb87ebc7d117", "SetDepositContractAddress(address)", {"depositContract": indexed(p.address)}),
    SetDepositedValidatorCount: event("0x220ab8fd274cf58c09b0825ccf00e74ba4ce4117fd47285adc2183a635838f1b", "SetDepositedValidatorCount(uint256,uint256)", {"oldDepositedValidatorCount": p.uint256, "newDepositedValidatorCount": p.uint256}),
    SetELFeeRecipient: event("0x1da4c245099590dc40be61880c9b97792f3694d970acc1e67ac0e6cc90f3780d", "SetELFeeRecipient(address)", {"elFeeRecipient": indexed(p.address)}),
    SetGlobalFee: event("0xbd533e726baaf59b36f3914d950053f7e78f527057c97cd3f0043257fc0fc884", "SetGlobalFee(uint256)", {"fee": p.uint256}),
    SetMaxDailyCommittableAmounts: event("0x004180017d3dd609da6980999655a6bd2591e313d31d6230b1889c369a9713a0", "SetMaxDailyCommittableAmounts(uint256,uint256)", {"minNetAmount": p.uint256, "maxRelativeAmount": p.uint256}),
    SetMetadataURI: event("0x8d2df192dd17edf92a7964b78aa322f3d717b2ab9de00651bee32bbc4c5da63a", "SetMetadataURI(string)", {"metadataURI": p.string}),
    SetOperatorsRegistry: event("0xffc0721ef0563a1b0a51a0dc92113025f33ca434ada9ee3eebff2f385d2a8f9a", "SetOperatorsRegistry(address)", {"operatorRegistry": indexed(p.address)}),
    SetOracle: event("0xd3b5d1e0ffaeff528910f3663f0adace7694ab8241d58e17a91351ced2e08031", "SetOracle(address)", {"oracleAddress": indexed(p.address)}),
    SetPendingAdmin: event("0x2a0f8515de3fa34ef68b99300347b8793c01683350743e96fe440594528298f4", "SetPendingAdmin(address)", {"pendingAdmin": indexed(p.address)}),
    SetRedeemManager: event("0xaf890c07e266df31e0725841eb0e85596a0caa1b17bbae5c0b206fdcc92d7ce1", "SetRedeemManager(address)", {"redeemManager": p.address}),
    SetSpec: event("0x25777eb44be046f64180acf8275f0ac2ec51e63a65a5f8a0f2f6d86ba25b74cf", "SetSpec(uint64,uint64,uint64,uint64,uint64)", {"epochsPerFrame": p.uint64, "slotsPerEpoch": p.uint64, "secondsPerSlot": p.uint64, "genesisTime": p.uint64, "epochsToAssumedFinality": p.uint64}),
    SetTotalSupply: event("0xc80ea35a3f9016535e5b7c87746740c5045afe42188d02c5786eb97495c2f429", "SetTotalSupply(uint256)", {"totalSupply": p.uint256}),
    SetWithdrawalCredentials: event("0x4c86ba184ea1a1558f84835ca34f6d67e222e8ee5cc4f324b8861dda4cf1740c", "SetWithdrawalCredentials(bytes32)", {"withdrawalCredentials": p.bytes32}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    UserDeposit: event("0x3bc57f469ad6d10d7723ea226cd22bd2b9e527def2b529f6ab44645a16689582", "UserDeposit(address,address,uint256)", {"depositor": indexed(p.address), "recipient": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    DEPOSIT_SIZE: viewFun("0x36bf3325", "DEPOSIT_SIZE()", {}, p.uint256),
    PUBLIC_KEY_LENGTH: viewFun("0xbf15af56", "PUBLIC_KEY_LENGTH()", {}, p.uint256),
    SIGNATURE_LENGTH: viewFun("0x540bc5ea", "SIGNATURE_LENGTH()", {}, p.uint256),
    _DEPOSIT_SIZE: viewFun("0xd7f8f474", "_DEPOSIT_SIZE()", {}, p.uint256),
    acceptAdmin: fun("0x0e18b681", "acceptAdmin()", {}, ),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"_owner": p.address, "_spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_spender": p.address, "_value": p.uint256}, p.bool),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"_owner": p.address}, p.uint256),
    balanceOfUnderlying: viewFun("0x3af9e669", "balanceOfUnderlying(address)", {"_owner": p.address}, p.uint256),
    claimRedeemRequests: fun("0x9332525d", "claimRedeemRequests(uint32[],uint32[])", {"_redeemRequestIds": p.array(p.uint32), "_withdrawalEventIds": p.array(p.uint32)}, p.array(p.uint8)),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"_spender": p.address, "_subtractableValue": p.uint256}, p.bool),
    deposit: fun("0xd0e30db0", "deposit()", {}, ),
    depositAndTransfer: fun("0xac232bde", "depositAndTransfer(address)", {"_recipient": p.address}, ),
    depositToConsensusLayerWithDepositRoot: fun("0xd96f186d", "depositToConsensusLayerWithDepositRoot(uint256,bytes32)", {"_maxCount": p.uint256, "_depositRoot": p.bytes32}, ),
    getAdmin: viewFun("0x6e9960c3", "getAdmin()", {}, p.address),
    getAllowlist: viewFun("0xc5eff3d0", "getAllowlist()", {}, p.address),
    getBalanceToDeposit: viewFun("0x04843a17", "getBalanceToDeposit()", {}, p.uint256),
    getBalanceToRedeem: viewFun("0x2d6b59bf", "getBalanceToRedeem()", {}, p.uint256),
    getCLSpec: viewFun("0x2dc5c97c", "getCLSpec()", {}, p.struct({"epochsPerFrame": p.uint64, "slotsPerEpoch": p.uint64, "secondsPerSlot": p.uint64, "genesisTime": p.uint64, "epochsToAssumedFinality": p.uint64})),
    getCLValidatorCount: viewFun("0x107d7fa0", "getCLValidatorCount()", {}, p.uint256),
    getCLValidatorTotalBalance: viewFun("0x46425ef0", "getCLValidatorTotalBalance()", {}, p.uint256),
    getCollector: viewFun("0x50228201", "getCollector()", {}, p.address),
    getCommittedBalance: viewFun("0xfe7c12ae", "getCommittedBalance()", {}, p.uint256),
    getCoverageFund: viewFun("0x1546962b", "getCoverageFund()", {}, p.address),
    getCurrentEpochId: viewFun("0xa29a839f", "getCurrentEpochId()", {}, p.uint256),
    getCurrentFrame: viewFun("0x72f79b13", "getCurrentFrame()", {}, {"_startEpochId": p.uint256, "_startTime": p.uint256, "_endTime": p.uint256}),
    getDailyCommittableLimits: viewFun("0xe3a88e61", "getDailyCommittableLimits()", {}, p.struct({"minDailyNetCommittableAmount": p.uint128, "maxDailyRelativeCommittableAmount": p.uint128})),
    getDepositedValidatorCount: viewFun("0x87f2adfb", "getDepositedValidatorCount()", {}, p.uint256),
    getELFeeRecipient: viewFun("0x2cb562e1", "getELFeeRecipient()", {}, p.address),
    getExpectedEpochId: viewFun("0x4b47b74f", "getExpectedEpochId()", {}, p.uint256),
    getFrameFirstEpochId: viewFun("0x57fa8547", "getFrameFirstEpochId(uint256)", {"_epochId": p.uint256}, p.uint256),
    getGlobalFee: viewFun("0x1bcbfaba", "getGlobalFee()", {}, p.uint256),
    getKeeper: viewFun("0x391b6f4e", "getKeeper()", {}, p.address),
    getLastCompletedEpochId: viewFun("0x89896aef", "getLastCompletedEpochId()", {}, p.uint256),
    getLastConsensusLayerReport: viewFun("0x17e64858", "getLastConsensusLayerReport()", {}, p.struct({"epoch": p.uint256, "validatorsBalance": p.uint256, "validatorsSkimmedBalance": p.uint256, "validatorsExitedBalance": p.uint256, "validatorsExitingBalance": p.uint256, "validatorsCount": p.uint32, "rebalanceDepositToRedeemMode": p.bool, "slashingContainmentMode": p.bool})),
    getMetadataURI: viewFun("0x86a92af7", "getMetadataURI()", {}, p.string),
    getOperatorsRegistry: viewFun("0x9b498e26", "getOperatorsRegistry()", {}, p.address),
    getOracle: viewFun("0x833b1fce", "getOracle()", {}, p.address),
    getPendingAdmin: viewFun("0xd0468156", "getPendingAdmin()", {}, p.address),
    getRedeemManager: viewFun("0x63f62aaf", "getRedeemManager()", {}, p.address),
    getReportBounds: viewFun("0x9d49cca1", "getReportBounds()", {}, p.struct({"annualAprUpperBound": p.uint256, "relativeLowerBound": p.uint256})),
    getTime: viewFun("0x557ed1ba", "getTime()", {}, p.uint256),
    getWithdrawalCredentials: viewFun("0x56396715", "getWithdrawalCredentials()", {}, p.bytes32),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"_spender": p.address, "_additionalValue": p.uint256}, p.bool),
    initRiverV1: fun("0x281a3122", "initRiverV1(address,address,bytes32,address,address,address,address,address,uint256)", {"_depositContractAddress": p.address, "_elFeeRecipientAddress": p.address, "_withdrawalCredentials": p.bytes32, "_oracleAddress": p.address, "_systemAdministratorAddress": p.address, "_allowlistAddress": p.address, "_operatorRegistryAddress": p.address, "_collectorAddress": p.address, "_globalFee": p.uint256}, ),
    initRiverV1_1: fun("0x0407de47", "initRiverV1_1(address,uint64,uint64,uint64,uint64,uint64,uint256,uint256,uint128,uint128)", {"_redeemManager": p.address, "_epochsPerFrame": p.uint64, "_slotsPerEpoch": p.uint64, "_secondsPerSlot": p.uint64, "_genesisTime": p.uint64, "_epochsToAssumedFinality": p.uint64, "_annualAprUpperBound": p.uint256, "_relativeLowerBound": p.uint256, "_minDailyNetCommittableAmount_": p.uint128, "_maxDailyRelativeCommittableAmount_": p.uint128}, ),
    initRiverV1_2: fun("0x54a29cdc", "initRiverV1_2()", {}, ),
    isValidEpoch: viewFun("0xf9f95a90", "isValidEpoch(uint256)", {"_epoch": p.uint256}, p.bool),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    proposeAdmin: fun("0x147bf6c4", "proposeAdmin(address)", {"_newAdmin": p.address}, ),
    requestRedeem: fun("0x107703ab", "requestRedeem(uint256,address)", {"_lsETHAmount": p.uint256, "_recipient": p.address}, p.uint32),
    resolveRedeemRequests: viewFun("0x5f2e5f07", "resolveRedeemRequests(uint32[])", {"_redeemRequestIds": p.array(p.uint32)}, p.array(p.int64)),
    sendCLFunds: fun("0x5d95e801", "sendCLFunds()", {}, ),
    sendCoverageFunds: fun("0xd4970524", "sendCoverageFunds()", {}, ),
    sendELFees: fun("0xefd60347", "sendELFees()", {}, ),
    sendRedeemManagerExceedingFunds: fun("0x056850c6", "sendRedeemManagerExceedingFunds()", {}, ),
    setAllowlist: fun("0x58bf3c7f", "setAllowlist(address)", {"_newAllowlist": p.address}, ),
    setCLSpec: fun("0x78a010e8", "setCLSpec((uint64,uint64,uint64,uint64,uint64))", {"_newValue": p.struct({"epochsPerFrame": p.uint64, "slotsPerEpoch": p.uint64, "secondsPerSlot": p.uint64, "genesisTime": p.uint64, "epochsToAssumedFinality": p.uint64})}, ),
    setCollector: fun("0xfb5b82d0", "setCollector(address)", {"_newCollector": p.address}, ),
    setConsensusLayerData: fun("0xefd66846", "setConsensusLayerData((uint256,uint256,uint256,uint256,uint256,uint32,uint32[],bool,bool))", {"_report": p.struct({"epoch": p.uint256, "validatorsBalance": p.uint256, "validatorsSkimmedBalance": p.uint256, "validatorsExitedBalance": p.uint256, "validatorsExitingBalance": p.uint256, "validatorsCount": p.uint32, "stoppedValidatorCountPerOperator": p.array(p.uint32), "rebalanceDepositToRedeemMode": p.bool, "slashingContainmentMode": p.bool})}, ),
    setCoverageFund: fun("0x020f086e", "setCoverageFund(address)", {"_newCoverageFund": p.address}, ),
    setDailyCommittableLimits: fun("0xbb6583ec", "setDailyCommittableLimits((uint128,uint128))", {"_dcl": p.struct({"minDailyNetCommittableAmount": p.uint128, "maxDailyRelativeCommittableAmount": p.uint128})}, ),
    setELFeeRecipient: fun("0x1311cf8d", "setELFeeRecipient(address)", {"_newELFeeRecipient": p.address}, ),
    setGlobalFee: fun("0x291206f6", "setGlobalFee(uint256)", {"_newFee": p.uint256}, ),
    setKeeper: fun("0x748747e6", "setKeeper(address)", {"_keeper": p.address}, ),
    setMetadataURI: fun("0x750521f5", "setMetadataURI(string)", {"_metadataURI": p.string}, ),
    setOracle: fun("0x7adbf973", "setOracle(address)", {"_oracleAddress": p.address}, ),
    setReportBounds: fun("0x15ca4cee", "setReportBounds((uint256,uint256))", {"_newValue": p.struct({"annualAprUpperBound": p.uint256, "relativeLowerBound": p.uint256})}, ),
    sharesFromUnderlyingBalance: viewFun("0x799a1954", "sharesFromUnderlyingBalance(uint256)", {"_underlyingAssetAmount": p.uint256}, p.uint256),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    totalUnderlyingSupply: viewFun("0x143a08d4", "totalUnderlyingSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_to": p.address, "_value": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_value": p.uint256}, p.bool),
    underlyingBalanceFromShares: viewFun("0xf79c3f02", "underlyingBalanceFromShares(uint256)", {"_shares": p.uint256}, p.uint256),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
}

export class Contract extends ContractBase {

    DEPOSIT_SIZE() {
        return this.eth_call(functions.DEPOSIT_SIZE, {})
    }

    PUBLIC_KEY_LENGTH() {
        return this.eth_call(functions.PUBLIC_KEY_LENGTH, {})
    }

    SIGNATURE_LENGTH() {
        return this.eth_call(functions.SIGNATURE_LENGTH, {})
    }

    _DEPOSIT_SIZE() {
        return this.eth_call(functions._DEPOSIT_SIZE, {})
    }

    allowance(_owner: AllowanceParams["_owner"], _spender: AllowanceParams["_spender"]) {
        return this.eth_call(functions.allowance, {_owner, _spender})
    }

    balanceOf(_owner: BalanceOfParams["_owner"]) {
        return this.eth_call(functions.balanceOf, {_owner})
    }

    balanceOfUnderlying(_owner: BalanceOfUnderlyingParams["_owner"]) {
        return this.eth_call(functions.balanceOfUnderlying, {_owner})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    getAdmin() {
        return this.eth_call(functions.getAdmin, {})
    }

    getAllowlist() {
        return this.eth_call(functions.getAllowlist, {})
    }

    getBalanceToDeposit() {
        return this.eth_call(functions.getBalanceToDeposit, {})
    }

    getBalanceToRedeem() {
        return this.eth_call(functions.getBalanceToRedeem, {})
    }

    getCLSpec() {
        return this.eth_call(functions.getCLSpec, {})
    }

    getCLValidatorCount() {
        return this.eth_call(functions.getCLValidatorCount, {})
    }

    getCLValidatorTotalBalance() {
        return this.eth_call(functions.getCLValidatorTotalBalance, {})
    }

    getCollector() {
        return this.eth_call(functions.getCollector, {})
    }

    getCommittedBalance() {
        return this.eth_call(functions.getCommittedBalance, {})
    }

    getCoverageFund() {
        return this.eth_call(functions.getCoverageFund, {})
    }

    getCurrentEpochId() {
        return this.eth_call(functions.getCurrentEpochId, {})
    }

    getCurrentFrame() {
        return this.eth_call(functions.getCurrentFrame, {})
    }

    getDailyCommittableLimits() {
        return this.eth_call(functions.getDailyCommittableLimits, {})
    }

    getDepositedValidatorCount() {
        return this.eth_call(functions.getDepositedValidatorCount, {})
    }

    getELFeeRecipient() {
        return this.eth_call(functions.getELFeeRecipient, {})
    }

    getExpectedEpochId() {
        return this.eth_call(functions.getExpectedEpochId, {})
    }

    getFrameFirstEpochId(_epochId: GetFrameFirstEpochIdParams["_epochId"]) {
        return this.eth_call(functions.getFrameFirstEpochId, {_epochId})
    }

    getGlobalFee() {
        return this.eth_call(functions.getGlobalFee, {})
    }

    getKeeper() {
        return this.eth_call(functions.getKeeper, {})
    }

    getLastCompletedEpochId() {
        return this.eth_call(functions.getLastCompletedEpochId, {})
    }

    getLastConsensusLayerReport() {
        return this.eth_call(functions.getLastConsensusLayerReport, {})
    }

    getMetadataURI() {
        return this.eth_call(functions.getMetadataURI, {})
    }

    getOperatorsRegistry() {
        return this.eth_call(functions.getOperatorsRegistry, {})
    }

    getOracle() {
        return this.eth_call(functions.getOracle, {})
    }

    getPendingAdmin() {
        return this.eth_call(functions.getPendingAdmin, {})
    }

    getRedeemManager() {
        return this.eth_call(functions.getRedeemManager, {})
    }

    getReportBounds() {
        return this.eth_call(functions.getReportBounds, {})
    }

    getTime() {
        return this.eth_call(functions.getTime, {})
    }

    getWithdrawalCredentials() {
        return this.eth_call(functions.getWithdrawalCredentials, {})
    }

    isValidEpoch(_epoch: IsValidEpochParams["_epoch"]) {
        return this.eth_call(functions.isValidEpoch, {_epoch})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    resolveRedeemRequests(_redeemRequestIds: ResolveRedeemRequestsParams["_redeemRequestIds"]) {
        return this.eth_call(functions.resolveRedeemRequests, {_redeemRequestIds})
    }

    sharesFromUnderlyingBalance(_underlyingAssetAmount: SharesFromUnderlyingBalanceParams["_underlyingAssetAmount"]) {
        return this.eth_call(functions.sharesFromUnderlyingBalance, {_underlyingAssetAmount})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    totalUnderlyingSupply() {
        return this.eth_call(functions.totalUnderlyingSupply, {})
    }

    underlyingBalanceFromShares(_shares: UnderlyingBalanceFromSharesParams["_shares"]) {
        return this.eth_call(functions.underlyingBalanceFromShares, {_shares})
    }

    version() {
        return this.eth_call(functions.version, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ConsensusLayerDataUpdateEventArgs = EParams<typeof events.ConsensusLayerDataUpdate>
export type InitializeEventArgs = EParams<typeof events.Initialize>
export type ProcessedConsensusLayerReportEventArgs = EParams<typeof events.ProcessedConsensusLayerReport>
export type PulledCLFundsEventArgs = EParams<typeof events.PulledCLFunds>
export type PulledCoverageFundsEventArgs = EParams<typeof events.PulledCoverageFunds>
export type PulledELFeesEventArgs = EParams<typeof events.PulledELFees>
export type PulledRedeemManagerExceedingEthEventArgs = EParams<typeof events.PulledRedeemManagerExceedingEth>
export type ReportedRedeemManagerEventArgs = EParams<typeof events.ReportedRedeemManager>
export type RewardsEarnedEventArgs = EParams<typeof events.RewardsEarned>
export type SetAdminEventArgs = EParams<typeof events.SetAdmin>
export type SetAllowlistEventArgs = EParams<typeof events.SetAllowlist>
export type SetBalanceCommittedToDepositEventArgs = EParams<typeof events.SetBalanceCommittedToDeposit>
export type SetBalanceToDepositEventArgs = EParams<typeof events.SetBalanceToDeposit>
export type SetBalanceToRedeemEventArgs = EParams<typeof events.SetBalanceToRedeem>
export type SetBoundsEventArgs = EParams<typeof events.SetBounds>
export type SetCollectorEventArgs = EParams<typeof events.SetCollector>
export type SetCoverageFundEventArgs = EParams<typeof events.SetCoverageFund>
export type SetDepositContractAddressEventArgs = EParams<typeof events.SetDepositContractAddress>
export type SetDepositedValidatorCountEventArgs = EParams<typeof events.SetDepositedValidatorCount>
export type SetELFeeRecipientEventArgs = EParams<typeof events.SetELFeeRecipient>
export type SetGlobalFeeEventArgs = EParams<typeof events.SetGlobalFee>
export type SetMaxDailyCommittableAmountsEventArgs = EParams<typeof events.SetMaxDailyCommittableAmounts>
export type SetMetadataURIEventArgs = EParams<typeof events.SetMetadataURI>
export type SetOperatorsRegistryEventArgs = EParams<typeof events.SetOperatorsRegistry>
export type SetOracleEventArgs = EParams<typeof events.SetOracle>
export type SetPendingAdminEventArgs = EParams<typeof events.SetPendingAdmin>
export type SetRedeemManagerEventArgs = EParams<typeof events.SetRedeemManager>
export type SetSpecEventArgs = EParams<typeof events.SetSpec>
export type SetTotalSupplyEventArgs = EParams<typeof events.SetTotalSupply>
export type SetWithdrawalCredentialsEventArgs = EParams<typeof events.SetWithdrawalCredentials>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UserDepositEventArgs = EParams<typeof events.UserDeposit>

/// Function types
export type DEPOSIT_SIZEParams = FunctionArguments<typeof functions.DEPOSIT_SIZE>
export type DEPOSIT_SIZEReturn = FunctionReturn<typeof functions.DEPOSIT_SIZE>

export type PUBLIC_KEY_LENGTHParams = FunctionArguments<typeof functions.PUBLIC_KEY_LENGTH>
export type PUBLIC_KEY_LENGTHReturn = FunctionReturn<typeof functions.PUBLIC_KEY_LENGTH>

export type SIGNATURE_LENGTHParams = FunctionArguments<typeof functions.SIGNATURE_LENGTH>
export type SIGNATURE_LENGTHReturn = FunctionReturn<typeof functions.SIGNATURE_LENGTH>

export type _DEPOSIT_SIZEParams = FunctionArguments<typeof functions._DEPOSIT_SIZE>
export type _DEPOSIT_SIZEReturn = FunctionReturn<typeof functions._DEPOSIT_SIZE>

export type AcceptAdminParams = FunctionArguments<typeof functions.acceptAdmin>
export type AcceptAdminReturn = FunctionReturn<typeof functions.acceptAdmin>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BalanceOfUnderlyingParams = FunctionArguments<typeof functions.balanceOfUnderlying>
export type BalanceOfUnderlyingReturn = FunctionReturn<typeof functions.balanceOfUnderlying>

export type ClaimRedeemRequestsParams = FunctionArguments<typeof functions.claimRedeemRequests>
export type ClaimRedeemRequestsReturn = FunctionReturn<typeof functions.claimRedeemRequests>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAndTransferParams = FunctionArguments<typeof functions.depositAndTransfer>
export type DepositAndTransferReturn = FunctionReturn<typeof functions.depositAndTransfer>

export type DepositToConsensusLayerWithDepositRootParams = FunctionArguments<typeof functions.depositToConsensusLayerWithDepositRoot>
export type DepositToConsensusLayerWithDepositRootReturn = FunctionReturn<typeof functions.depositToConsensusLayerWithDepositRoot>

export type GetAdminParams = FunctionArguments<typeof functions.getAdmin>
export type GetAdminReturn = FunctionReturn<typeof functions.getAdmin>

export type GetAllowlistParams = FunctionArguments<typeof functions.getAllowlist>
export type GetAllowlistReturn = FunctionReturn<typeof functions.getAllowlist>

export type GetBalanceToDepositParams = FunctionArguments<typeof functions.getBalanceToDeposit>
export type GetBalanceToDepositReturn = FunctionReturn<typeof functions.getBalanceToDeposit>

export type GetBalanceToRedeemParams = FunctionArguments<typeof functions.getBalanceToRedeem>
export type GetBalanceToRedeemReturn = FunctionReturn<typeof functions.getBalanceToRedeem>

export type GetCLSpecParams = FunctionArguments<typeof functions.getCLSpec>
export type GetCLSpecReturn = FunctionReturn<typeof functions.getCLSpec>

export type GetCLValidatorCountParams = FunctionArguments<typeof functions.getCLValidatorCount>
export type GetCLValidatorCountReturn = FunctionReturn<typeof functions.getCLValidatorCount>

export type GetCLValidatorTotalBalanceParams = FunctionArguments<typeof functions.getCLValidatorTotalBalance>
export type GetCLValidatorTotalBalanceReturn = FunctionReturn<typeof functions.getCLValidatorTotalBalance>

export type GetCollectorParams = FunctionArguments<typeof functions.getCollector>
export type GetCollectorReturn = FunctionReturn<typeof functions.getCollector>

export type GetCommittedBalanceParams = FunctionArguments<typeof functions.getCommittedBalance>
export type GetCommittedBalanceReturn = FunctionReturn<typeof functions.getCommittedBalance>

export type GetCoverageFundParams = FunctionArguments<typeof functions.getCoverageFund>
export type GetCoverageFundReturn = FunctionReturn<typeof functions.getCoverageFund>

export type GetCurrentEpochIdParams = FunctionArguments<typeof functions.getCurrentEpochId>
export type GetCurrentEpochIdReturn = FunctionReturn<typeof functions.getCurrentEpochId>

export type GetCurrentFrameParams = FunctionArguments<typeof functions.getCurrentFrame>
export type GetCurrentFrameReturn = FunctionReturn<typeof functions.getCurrentFrame>

export type GetDailyCommittableLimitsParams = FunctionArguments<typeof functions.getDailyCommittableLimits>
export type GetDailyCommittableLimitsReturn = FunctionReturn<typeof functions.getDailyCommittableLimits>

export type GetDepositedValidatorCountParams = FunctionArguments<typeof functions.getDepositedValidatorCount>
export type GetDepositedValidatorCountReturn = FunctionReturn<typeof functions.getDepositedValidatorCount>

export type GetELFeeRecipientParams = FunctionArguments<typeof functions.getELFeeRecipient>
export type GetELFeeRecipientReturn = FunctionReturn<typeof functions.getELFeeRecipient>

export type GetExpectedEpochIdParams = FunctionArguments<typeof functions.getExpectedEpochId>
export type GetExpectedEpochIdReturn = FunctionReturn<typeof functions.getExpectedEpochId>

export type GetFrameFirstEpochIdParams = FunctionArguments<typeof functions.getFrameFirstEpochId>
export type GetFrameFirstEpochIdReturn = FunctionReturn<typeof functions.getFrameFirstEpochId>

export type GetGlobalFeeParams = FunctionArguments<typeof functions.getGlobalFee>
export type GetGlobalFeeReturn = FunctionReturn<typeof functions.getGlobalFee>

export type GetKeeperParams = FunctionArguments<typeof functions.getKeeper>
export type GetKeeperReturn = FunctionReturn<typeof functions.getKeeper>

export type GetLastCompletedEpochIdParams = FunctionArguments<typeof functions.getLastCompletedEpochId>
export type GetLastCompletedEpochIdReturn = FunctionReturn<typeof functions.getLastCompletedEpochId>

export type GetLastConsensusLayerReportParams = FunctionArguments<typeof functions.getLastConsensusLayerReport>
export type GetLastConsensusLayerReportReturn = FunctionReturn<typeof functions.getLastConsensusLayerReport>

export type GetMetadataURIParams = FunctionArguments<typeof functions.getMetadataURI>
export type GetMetadataURIReturn = FunctionReturn<typeof functions.getMetadataURI>

export type GetOperatorsRegistryParams = FunctionArguments<typeof functions.getOperatorsRegistry>
export type GetOperatorsRegistryReturn = FunctionReturn<typeof functions.getOperatorsRegistry>

export type GetOracleParams = FunctionArguments<typeof functions.getOracle>
export type GetOracleReturn = FunctionReturn<typeof functions.getOracle>

export type GetPendingAdminParams = FunctionArguments<typeof functions.getPendingAdmin>
export type GetPendingAdminReturn = FunctionReturn<typeof functions.getPendingAdmin>

export type GetRedeemManagerParams = FunctionArguments<typeof functions.getRedeemManager>
export type GetRedeemManagerReturn = FunctionReturn<typeof functions.getRedeemManager>

export type GetReportBoundsParams = FunctionArguments<typeof functions.getReportBounds>
export type GetReportBoundsReturn = FunctionReturn<typeof functions.getReportBounds>

export type GetTimeParams = FunctionArguments<typeof functions.getTime>
export type GetTimeReturn = FunctionReturn<typeof functions.getTime>

export type GetWithdrawalCredentialsParams = FunctionArguments<typeof functions.getWithdrawalCredentials>
export type GetWithdrawalCredentialsReturn = FunctionReturn<typeof functions.getWithdrawalCredentials>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type InitRiverV1Params = FunctionArguments<typeof functions.initRiverV1>
export type InitRiverV1Return = FunctionReturn<typeof functions.initRiverV1>

export type InitRiverV1_1Params = FunctionArguments<typeof functions.initRiverV1_1>
export type InitRiverV1_1Return = FunctionReturn<typeof functions.initRiverV1_1>

export type InitRiverV1_2Params = FunctionArguments<typeof functions.initRiverV1_2>
export type InitRiverV1_2Return = FunctionReturn<typeof functions.initRiverV1_2>

export type IsValidEpochParams = FunctionArguments<typeof functions.isValidEpoch>
export type IsValidEpochReturn = FunctionReturn<typeof functions.isValidEpoch>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type ProposeAdminParams = FunctionArguments<typeof functions.proposeAdmin>
export type ProposeAdminReturn = FunctionReturn<typeof functions.proposeAdmin>

export type RequestRedeemParams = FunctionArguments<typeof functions.requestRedeem>
export type RequestRedeemReturn = FunctionReturn<typeof functions.requestRedeem>

export type ResolveRedeemRequestsParams = FunctionArguments<typeof functions.resolveRedeemRequests>
export type ResolveRedeemRequestsReturn = FunctionReturn<typeof functions.resolveRedeemRequests>

export type SendCLFundsParams = FunctionArguments<typeof functions.sendCLFunds>
export type SendCLFundsReturn = FunctionReturn<typeof functions.sendCLFunds>

export type SendCoverageFundsParams = FunctionArguments<typeof functions.sendCoverageFunds>
export type SendCoverageFundsReturn = FunctionReturn<typeof functions.sendCoverageFunds>

export type SendELFeesParams = FunctionArguments<typeof functions.sendELFees>
export type SendELFeesReturn = FunctionReturn<typeof functions.sendELFees>

export type SendRedeemManagerExceedingFundsParams = FunctionArguments<typeof functions.sendRedeemManagerExceedingFunds>
export type SendRedeemManagerExceedingFundsReturn = FunctionReturn<typeof functions.sendRedeemManagerExceedingFunds>

export type SetAllowlistParams = FunctionArguments<typeof functions.setAllowlist>
export type SetAllowlistReturn = FunctionReturn<typeof functions.setAllowlist>

export type SetCLSpecParams = FunctionArguments<typeof functions.setCLSpec>
export type SetCLSpecReturn = FunctionReturn<typeof functions.setCLSpec>

export type SetCollectorParams = FunctionArguments<typeof functions.setCollector>
export type SetCollectorReturn = FunctionReturn<typeof functions.setCollector>

export type SetConsensusLayerDataParams = FunctionArguments<typeof functions.setConsensusLayerData>
export type SetConsensusLayerDataReturn = FunctionReturn<typeof functions.setConsensusLayerData>

export type SetCoverageFundParams = FunctionArguments<typeof functions.setCoverageFund>
export type SetCoverageFundReturn = FunctionReturn<typeof functions.setCoverageFund>

export type SetDailyCommittableLimitsParams = FunctionArguments<typeof functions.setDailyCommittableLimits>
export type SetDailyCommittableLimitsReturn = FunctionReturn<typeof functions.setDailyCommittableLimits>

export type SetELFeeRecipientParams = FunctionArguments<typeof functions.setELFeeRecipient>
export type SetELFeeRecipientReturn = FunctionReturn<typeof functions.setELFeeRecipient>

export type SetGlobalFeeParams = FunctionArguments<typeof functions.setGlobalFee>
export type SetGlobalFeeReturn = FunctionReturn<typeof functions.setGlobalFee>

export type SetKeeperParams = FunctionArguments<typeof functions.setKeeper>
export type SetKeeperReturn = FunctionReturn<typeof functions.setKeeper>

export type SetMetadataURIParams = FunctionArguments<typeof functions.setMetadataURI>
export type SetMetadataURIReturn = FunctionReturn<typeof functions.setMetadataURI>

export type SetOracleParams = FunctionArguments<typeof functions.setOracle>
export type SetOracleReturn = FunctionReturn<typeof functions.setOracle>

export type SetReportBoundsParams = FunctionArguments<typeof functions.setReportBounds>
export type SetReportBoundsReturn = FunctionReturn<typeof functions.setReportBounds>

export type SharesFromUnderlyingBalanceParams = FunctionArguments<typeof functions.sharesFromUnderlyingBalance>
export type SharesFromUnderlyingBalanceReturn = FunctionReturn<typeof functions.sharesFromUnderlyingBalance>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TotalUnderlyingSupplyParams = FunctionArguments<typeof functions.totalUnderlyingSupply>
export type TotalUnderlyingSupplyReturn = FunctionReturn<typeof functions.totalUnderlyingSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type UnderlyingBalanceFromSharesParams = FunctionArguments<typeof functions.underlyingBalanceFromShares>
export type UnderlyingBalanceFromSharesReturn = FunctionReturn<typeof functions.underlyingBalanceFromShares>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

