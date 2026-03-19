import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ConfigUpdated: event("0x3f8d0d126f4c7f870ec9de90e2f4aa192e5e721bd3c48a77547fb9a7550eed32", "ConfigUpdated(string)", {"configIpfsHash": p.string}),
    EIP712DomainChanged: event("0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31", "EIP712DomainChanged()", {}),
    ExitSignaturesUpdated: event("0x00864475858b77001993c57b93686a71d9b05afd547263395177b71e912a9cc1", "ExitSignaturesUpdated(address,address,uint256,string)", {"caller": indexed(p.address), "vault": indexed(p.address), "nonce": p.uint256, "exitSignaturesIpfsHash": p.string}),
    Harvested: event("0x3f1d24dac9bcd1609d88c0def0340864f36b317d196e522a8a437da375f3d8af", "Harvested(address,bytes32,int256,uint256)", {"vault": indexed(p.address), "rewardsRoot": indexed(p.bytes32), "totalAssetsDelta": p.int256, "unlockedMevDelta": p.uint256}),
    OracleAdded: event("0x0047706786c922d17b39285dc59d696bafea72c0b003d3841ae1202076f4c2e4", "OracleAdded(address)", {"oracle": indexed(p.address)}),
    OracleRemoved: event("0x9c8e7d83025bef8a04c664b2f753f64b8814bdb7e27291d7e50935f18cc3c712", "OracleRemoved(address)", {"oracle": indexed(p.address)}),
    OwnershipTransferStarted: event("0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700", "OwnershipTransferStarted(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    RewardsMinOraclesUpdated: event("0x2f6ee959bfba5f7019d3c0391efaa73bce31771540b48b0be8240c1ff7f1c2e5", "RewardsMinOraclesUpdated(uint256)", {"oracles": p.uint256}),
    RewardsUpdated: event("0xfa453467fa89fc89833cc6e9c06a26a6c6db0fa6df2df5c74e685a27b0c931f2", "RewardsUpdated(address,bytes32,uint256,uint64,uint64,string)", {"caller": indexed(p.address), "rewardsRoot": indexed(p.bytes32), "avgRewardPerSecond": p.uint256, "updateTimestamp": p.uint64, "nonce": p.uint64, "rewardsIpfsHash": p.string}),
    ValidatorsApproval: event("0x926dc0536ff09ba1fa0fd4ec449001effeb2a30e74031acf619e5d47ffa518fd", "ValidatorsApproval(address,string)", {"vault": indexed(p.address), "exitSignaturesIpfsHash": p.string}),
    ValidatorsMinOraclesUpdated: event("0x40d0dae231c3912f939945de2019b6769b0b6136e363b3d10a1a9d5eb632e474", "ValidatorsMinOraclesUpdated(uint256)", {"oracles": p.uint256}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    addOracle: fun("0xdf5dd1a5", "addOracle(address)", {"oracle": p.address}, ),
    approveValidators: fun("0x837d4441", "approveValidators((bytes32,uint256,bytes,bytes,string))", {"params": p.struct({"validatorsRegistryRoot": p.bytes32, "deadline": p.uint256, "validators": p.bytes, "signatures": p.bytes, "exitSignaturesIpfsHash": p.string})}, ),
    canHarvest: viewFun("0xfb70261a", "canHarvest(address)", {"vault": p.address}, p.bool),
    canUpdateRewards: viewFun("0x3cf8b6b3", "canUpdateRewards()", {}, p.bool),
    eip712Domain: viewFun("0x84b0196e", "eip712Domain()", {}, {"fields": p.bytes1, "name": p.string, "version": p.string, "chainId": p.uint256, "verifyingContract": p.address, "salt": p.bytes32, "extensions": p.array(p.uint256)}),
    exitSignaturesNonces: viewFun("0x26f9872d", "exitSignaturesNonces(address)", {"_0": p.address}, p.uint256),
    harvest: fun("0x25f56f11", "harvest((bytes32,int160,uint160,bytes32[]))", {"params": p.struct({"rewardsRoot": p.bytes32, "reward": p.int160, "unlockedMevReward": p.uint160, "proof": p.array(p.bytes32)})}, {"totalAssetsDelta": p.int256, "unlockedMevDelta": p.uint256, "harvested": p.bool}),
    initialize: fun("0xc4d66de8", "initialize(address)", {"_owner": p.address}, ),
    isCollateralized: viewFun("0x02ad4d2a", "isCollateralized(address)", {"vault": p.address}, p.bool),
    isHarvestRequired: viewFun("0x7d6359ee", "isHarvestRequired(address)", {"vault": p.address}, p.bool),
    isOracle: viewFun("0xa97e5c93", "isOracle(address)", {"_0": p.address}, p.bool),
    lastRewardsTimestamp: viewFun("0x2f0bc1a7", "lastRewardsTimestamp()", {}, p.uint64),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pendingOwner: viewFun("0xe30c3978", "pendingOwner()", {}, p.address),
    prevRewardsRoot: viewFun("0x9fdd305e", "prevRewardsRoot()", {}, p.bytes32),
    removeOracle: fun("0xfdc85fc4", "removeOracle(address)", {"oracle": p.address}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    rewards: viewFun("0x0700037d", "rewards(address)", {"_0": p.address}, {"assets": p.int192, "nonce": p.uint64}),
    rewardsDelay: viewFun("0x50131d47", "rewardsDelay()", {}, p.uint256),
    rewardsMinOracles: viewFun("0x7386749e", "rewardsMinOracles()", {}, p.uint256),
    rewardsNonce: viewFun("0x9da8987f", "rewardsNonce()", {}, p.uint64),
    rewardsRoot: viewFun("0x217863b7", "rewardsRoot()", {}, p.bytes32),
    setRewardsMinOracles: fun("0xd7fc432e", "setRewardsMinOracles(uint256)", {"_rewardsMinOracles": p.uint256}, ),
    setValidatorsMinOracles: fun("0x9c3a7bd8", "setValidatorsMinOracles(uint256)", {"_validatorsMinOracles": p.uint256}, ),
    totalOracles: viewFun("0xf2fbad47", "totalOracles()", {}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    unlockedMevRewards: viewFun("0x31b36a51", "unlockedMevRewards(address)", {"_0": p.address}, {"assets": p.uint192, "nonce": p.uint64}),
    updateConfig: fun("0x8a76984d", "updateConfig(string)", {"configIpfsHash": p.string}, ),
    updateExitSignatures: fun("0x4a940b7a", "updateExitSignatures(address,uint256,string,bytes)", {"vault": p.address, "deadline": p.uint256, "exitSignaturesIpfsHash": p.string, "oraclesSignatures": p.bytes}, ),
    updateRewards: fun("0x556a6899", "updateRewards((bytes32,uint256,uint64,string,bytes))", {"params": p.struct({"rewardsRoot": p.bytes32, "avgRewardPerSecond": p.uint256, "updateTimestamp": p.uint64, "rewardsIpfsHash": p.string, "signatures": p.bytes})}, ),
    validatorsMinOracles: viewFun("0x203efb5e", "validatorsMinOracles()", {}, p.uint256),
}

export class Contract extends ContractBase {

    canHarvest(vault: CanHarvestParams["vault"]) {
        return this.eth_call(functions.canHarvest, {vault})
    }

    canUpdateRewards() {
        return this.eth_call(functions.canUpdateRewards, {})
    }

    eip712Domain() {
        return this.eth_call(functions.eip712Domain, {})
    }

    exitSignaturesNonces(_0: ExitSignaturesNoncesParams["_0"]) {
        return this.eth_call(functions.exitSignaturesNonces, {_0})
    }

    isCollateralized(vault: IsCollateralizedParams["vault"]) {
        return this.eth_call(functions.isCollateralized, {vault})
    }

    isHarvestRequired(vault: IsHarvestRequiredParams["vault"]) {
        return this.eth_call(functions.isHarvestRequired, {vault})
    }

    isOracle(_0: IsOracleParams["_0"]) {
        return this.eth_call(functions.isOracle, {_0})
    }

    lastRewardsTimestamp() {
        return this.eth_call(functions.lastRewardsTimestamp, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingOwner() {
        return this.eth_call(functions.pendingOwner, {})
    }

    prevRewardsRoot() {
        return this.eth_call(functions.prevRewardsRoot, {})
    }

    rewards(_0: RewardsParams["_0"]) {
        return this.eth_call(functions.rewards, {_0})
    }

    rewardsDelay() {
        return this.eth_call(functions.rewardsDelay, {})
    }

    rewardsMinOracles() {
        return this.eth_call(functions.rewardsMinOracles, {})
    }

    rewardsNonce() {
        return this.eth_call(functions.rewardsNonce, {})
    }

    rewardsRoot() {
        return this.eth_call(functions.rewardsRoot, {})
    }

    totalOracles() {
        return this.eth_call(functions.totalOracles, {})
    }

    unlockedMevRewards(_0: UnlockedMevRewardsParams["_0"]) {
        return this.eth_call(functions.unlockedMevRewards, {_0})
    }

    validatorsMinOracles() {
        return this.eth_call(functions.validatorsMinOracles, {})
    }
}

/// Event types
export type ConfigUpdatedEventArgs = EParams<typeof events.ConfigUpdated>
export type EIP712DomainChangedEventArgs = EParams<typeof events.EIP712DomainChanged>
export type ExitSignaturesUpdatedEventArgs = EParams<typeof events.ExitSignaturesUpdated>
export type HarvestedEventArgs = EParams<typeof events.Harvested>
export type OracleAddedEventArgs = EParams<typeof events.OracleAdded>
export type OracleRemovedEventArgs = EParams<typeof events.OracleRemoved>
export type OwnershipTransferStartedEventArgs = EParams<typeof events.OwnershipTransferStarted>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type RewardsMinOraclesUpdatedEventArgs = EParams<typeof events.RewardsMinOraclesUpdated>
export type RewardsUpdatedEventArgs = EParams<typeof events.RewardsUpdated>
export type ValidatorsApprovalEventArgs = EParams<typeof events.ValidatorsApproval>
export type ValidatorsMinOraclesUpdatedEventArgs = EParams<typeof events.ValidatorsMinOraclesUpdated>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type AddOracleParams = FunctionArguments<typeof functions.addOracle>
export type AddOracleReturn = FunctionReturn<typeof functions.addOracle>

export type ApproveValidatorsParams = FunctionArguments<typeof functions.approveValidators>
export type ApproveValidatorsReturn = FunctionReturn<typeof functions.approveValidators>

export type CanHarvestParams = FunctionArguments<typeof functions.canHarvest>
export type CanHarvestReturn = FunctionReturn<typeof functions.canHarvest>

export type CanUpdateRewardsParams = FunctionArguments<typeof functions.canUpdateRewards>
export type CanUpdateRewardsReturn = FunctionReturn<typeof functions.canUpdateRewards>

export type Eip712DomainParams = FunctionArguments<typeof functions.eip712Domain>
export type Eip712DomainReturn = FunctionReturn<typeof functions.eip712Domain>

export type ExitSignaturesNoncesParams = FunctionArguments<typeof functions.exitSignaturesNonces>
export type ExitSignaturesNoncesReturn = FunctionReturn<typeof functions.exitSignaturesNonces>

export type HarvestParams = FunctionArguments<typeof functions.harvest>
export type HarvestReturn = FunctionReturn<typeof functions.harvest>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsCollateralizedParams = FunctionArguments<typeof functions.isCollateralized>
export type IsCollateralizedReturn = FunctionReturn<typeof functions.isCollateralized>

export type IsHarvestRequiredParams = FunctionArguments<typeof functions.isHarvestRequired>
export type IsHarvestRequiredReturn = FunctionReturn<typeof functions.isHarvestRequired>

export type IsOracleParams = FunctionArguments<typeof functions.isOracle>
export type IsOracleReturn = FunctionReturn<typeof functions.isOracle>

export type LastRewardsTimestampParams = FunctionArguments<typeof functions.lastRewardsTimestamp>
export type LastRewardsTimestampReturn = FunctionReturn<typeof functions.lastRewardsTimestamp>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingOwnerParams = FunctionArguments<typeof functions.pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof functions.pendingOwner>

export type PrevRewardsRootParams = FunctionArguments<typeof functions.prevRewardsRoot>
export type PrevRewardsRootReturn = FunctionReturn<typeof functions.prevRewardsRoot>

export type RemoveOracleParams = FunctionArguments<typeof functions.removeOracle>
export type RemoveOracleReturn = FunctionReturn<typeof functions.removeOracle>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RewardsParams = FunctionArguments<typeof functions.rewards>
export type RewardsReturn = FunctionReturn<typeof functions.rewards>

export type RewardsDelayParams = FunctionArguments<typeof functions.rewardsDelay>
export type RewardsDelayReturn = FunctionReturn<typeof functions.rewardsDelay>

export type RewardsMinOraclesParams = FunctionArguments<typeof functions.rewardsMinOracles>
export type RewardsMinOraclesReturn = FunctionReturn<typeof functions.rewardsMinOracles>

export type RewardsNonceParams = FunctionArguments<typeof functions.rewardsNonce>
export type RewardsNonceReturn = FunctionReturn<typeof functions.rewardsNonce>

export type RewardsRootParams = FunctionArguments<typeof functions.rewardsRoot>
export type RewardsRootReturn = FunctionReturn<typeof functions.rewardsRoot>

export type SetRewardsMinOraclesParams = FunctionArguments<typeof functions.setRewardsMinOracles>
export type SetRewardsMinOraclesReturn = FunctionReturn<typeof functions.setRewardsMinOracles>

export type SetValidatorsMinOraclesParams = FunctionArguments<typeof functions.setValidatorsMinOracles>
export type SetValidatorsMinOraclesReturn = FunctionReturn<typeof functions.setValidatorsMinOracles>

export type TotalOraclesParams = FunctionArguments<typeof functions.totalOracles>
export type TotalOraclesReturn = FunctionReturn<typeof functions.totalOracles>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UnlockedMevRewardsParams = FunctionArguments<typeof functions.unlockedMevRewards>
export type UnlockedMevRewardsReturn = FunctionReturn<typeof functions.unlockedMevRewards>

export type UpdateConfigParams = FunctionArguments<typeof functions.updateConfig>
export type UpdateConfigReturn = FunctionReturn<typeof functions.updateConfig>

export type UpdateExitSignaturesParams = FunctionArguments<typeof functions.updateExitSignatures>
export type UpdateExitSignaturesReturn = FunctionReturn<typeof functions.updateExitSignatures>

export type UpdateRewardsParams = FunctionArguments<typeof functions.updateRewards>
export type UpdateRewardsReturn = FunctionReturn<typeof functions.updateRewards>

export type ValidatorsMinOraclesParams = FunctionArguments<typeof functions.validatorsMinOracles>
export type ValidatorsMinOraclesReturn = FunctionReturn<typeof functions.validatorsMinOracles>

