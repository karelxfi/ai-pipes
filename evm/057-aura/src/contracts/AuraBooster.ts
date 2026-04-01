import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ArbitratorUpdated: event("0x961c543f04f95b46a6d6af9e463eb4f186ceea8ca52f869ec568c0197080401b", "ArbitratorUpdated(address)", {"newArbitrator": p.address}),
    Deposited: event("0x73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca", "Deposited(address,uint256,uint256)", {"user": indexed(p.address), "poolid": indexed(p.uint256), "amount": p.uint256}),
    FactoriesUpdated: event("0x013ea07699fbd5315b997a706906fb94a81c616771f1052b406707d7bfc6aa27", "FactoriesUpdated(address,address,address)", {"rewardFactory": p.address, "stashFactory": p.address, "tokenFactory": p.address}),
    FeeInfoChanged: event("0xf1d91b931944e49fd30c1dc6fd08ad8bb25ef1fe12c369b10a4675c4bf397440", "FeeInfoChanged(address,bool)", {"feeDistro": p.address, "active": p.bool}),
    FeeInfoUpdated: event("0x125af409731fa78089d37e0f7f166b726398745c97b932f061cf486d6ee4fcc8", "FeeInfoUpdated(address,address,address)", {"feeDistro": p.address, "lockFees": p.address, "feeToken": p.address}),
    FeeManagerUpdated: event("0xe45f5e140399b0a7e12971ab020724b828fbed8ac408c420884dc7d1bbe506b4", "FeeManagerUpdated(address)", {"newFeeManager": p.address}),
    FeesUpdated: event("0x16e6f67290546b8dd0e587f4b7f67d4f61932ae17ffd8c60d3509dbc05c175fe", "FeesUpdated(uint256,uint256,uint256,uint256)", {"lockIncentive": p.uint256, "stakerIncentive": p.uint256, "earmarkIncentive": p.uint256, "platformFee": p.uint256}),
    OwnerUpdated: event("0x4ffd725fc4a22075e9ec71c59edf9c38cdeb588a91b24fc5b61388c5be41282b", "OwnerUpdated(address)", {"newOwner": p.address}),
    PoolAdded: event("0xca1a6de26e4422518df9ab614eefa07fac43e4f4c7d704dbf82e903e582659ca", "PoolAdded(address,address,address,address,address,uint256)", {"lpToken": p.address, "gauge": p.address, "token": p.address, "rewardPool": p.address, "stash": p.address, "pid": p.uint256}),
    PoolManagerUpdated: event("0x70a64736553c84939f57deec269299882abbbee8dc4f316eccbc6fce57e4d3cf", "PoolManagerUpdated(address)", {"newPoolManager": p.address}),
    PoolShutdown: event("0x2ccd633716c6ce12394d1c984ad04b6173d18aedc4f505d1537a94a98a07b6e7", "PoolShutdown(uint256)", {"poolId": p.uint256}),
    RewardContractsUpdated: event("0x601d75fd094819eb2644514a732ecc4ff7953787e92258e47c118aa83b031115", "RewardContractsUpdated(address,address)", {"lockRewards": p.address, "stakerRewards": p.address}),
    TreasuryUpdated: event("0x7dae230f18360d76a040c81f050aa14eb9d6dc7901b20fc5d855e2a20fe814d1", "TreasuryUpdated(address)", {"newTreasury": p.address}),
    VoteDelegateUpdated: event("0x49f087c09fe6698eda82449a671bd8d38e44bed601118018a7cc7f1e0c808df4", "VoteDelegateUpdated(address)", {"newVoteDelegate": p.address}),
    Withdrawn: event("0x92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc6", "Withdrawn(address,uint256,uint256)", {"user": indexed(p.address), "poolid": indexed(p.uint256), "amount": p.uint256}),
}

export const functions = {
    FEE_DENOMINATOR: viewFun("0xd73792a9", "FEE_DENOMINATOR()", {}, p.uint256),
    MaxFees: viewFun("0x7303df9a", "MaxFees()", {}, p.uint256),
    REWARD_MULTIPLIER_DENOMINATOR: viewFun("0xe31c0bf6", "REWARD_MULTIPLIER_DENOMINATOR()", {}, p.uint256),
    addPool: fun("0x7e29d6c2", "addPool(address,address,uint256)", {"_lptoken": p.address, "_gauge": p.address, "_stashVersion": p.uint256}, p.bool),
    bridgeDelegate: viewFun("0xce726e63", "bridgeDelegate()", {}, p.address),
    claimRewards: fun("0x6c7b69cb", "claimRewards(uint256,address)", {"_pid": p.uint256, "_gauge": p.address}, p.bool),
    crv: viewFun("0x6a4874a1", "crv()", {}, p.address),
    deposit: fun("0x43a0d066", "deposit(uint256,uint256,bool)", {"_pid": p.uint256, "_amount": p.uint256, "_stake": p.bool}, p.bool),
    depositAll: fun("0x60759fce", "depositAll(uint256,bool)", {"_pid": p.uint256, "_stake": p.bool}, p.bool),
    distributeL2Fees: fun("0x06caad9f", "distributeL2Fees(uint256)", {"_amount": p.uint256}, ),
    earmarkFees: fun("0xa0e0c54d", "earmarkFees(address)", {"_feeToken": p.address}, p.bool),
    earmarkIncentive: viewFun("0x3a088cd2", "earmarkIncentive()", {}, p.uint256),
    earmarkRewards: fun("0xcc956f3f", "earmarkRewards(uint256)", {"_pid": p.uint256}, p.bool),
    feeManager: viewFun("0xd0fb0203", "feeManager()", {}, p.address),
    feeTokens: viewFun("0x16605a0d", "feeTokens(address)", {"_0": p.address}, {"distro": p.address, "rewards": p.address, "active": p.bool}),
    gaugeMap: viewFun("0xcb0d5b52", "gaugeMap(address)", {"_0": p.address}, p.bool),
    getRewardMultipliers: viewFun("0xdee55227", "getRewardMultipliers(address)", {"_0": p.address}, p.uint256),
    isShutdown: viewFun("0xbf86d690", "isShutdown()", {}, p.bool),
    l2FeesHistory: viewFun("0x3c781cbd", "l2FeesHistory(uint256)", {"_0": p.uint256}, p.uint256),
    lockIncentive: viewFun("0x50940618", "lockIncentive()", {}, p.uint256),
    lockRewards: viewFun("0x376d771a", "lockRewards()", {}, p.address),
    minter: viewFun("0x07546172", "minter()", {}, p.address),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    platformFee: viewFun("0x26232a2e", "platformFee()", {}, p.uint256),
    poolInfo: viewFun("0x1526fe27", "poolInfo(uint256)", {"_0": p.uint256}, {"lptoken": p.address, "token": p.address, "gauge": p.address, "crvRewards": p.address, "stash": p.address, "shutdown": p.bool}),
    poolLength: viewFun("0x081e3eda", "poolLength()", {}, p.uint256),
    poolManager: viewFun("0xdc4c90d3", "poolManager()", {}, p.address),
    rewardArbitrator: viewFun("0x043b684a", "rewardArbitrator()", {}, p.address),
    rewardClaimed: fun("0x71192b17", "rewardClaimed(uint256,address,uint256)", {"_pid": p.uint256, "_address": p.address, "_amount": p.uint256}, p.bool),
    rewardFactory: viewFun("0x245e4bf0", "rewardFactory()", {}, p.address),
    setArbitrator: fun("0xb0eefabe", "setArbitrator(address)", {"_arb": p.address}, ),
    setBridgeDelegate: fun("0xe0325208", "setBridgeDelegate(address)", {"_bridgeDelegate": p.address}, ),
    setDelegate: fun("0x3b788da9", "setDelegate(address,address,bytes32)", {"_delegateContract": p.address, "_delegate": p.address, "_space": p.bytes32}, ),
    setFactories: fun("0x7bd3b995", "setFactories(address,address,address)", {"_rfactory": p.address, "_sfactory": p.address, "_tfactory": p.address}, ),
    setFeeInfo: fun("0x728706ed", "setFeeInfo(address,address)", {"_feeToken": p.address, "_feeDistro": p.address}, ),
    setFeeManager: fun("0x472d35b9", "setFeeManager(address)", {"_feeM": p.address}, ),
    setFees: fun("0x6fcba377", "setFees(uint256,uint256,uint256,uint256)", {"_lockFees": p.uint256, "_stakerFees": p.uint256, "_callerFees": p.uint256, "_platform": p.uint256}, ),
    setGaugeRedirect: fun("0x9123d404", "setGaugeRedirect(uint256)", {"_pid": p.uint256}, p.bool),
    setOwner: fun("0x13af4035", "setOwner(address)", {"_owner": p.address}, ),
    setPoolManager: fun("0x7aef6715", "setPoolManager(address)", {"_poolM": p.address}, ),
    setRewardContracts: fun("0x95539a1d", "setRewardContracts(address,address)", {"_rewards": p.address, "_stakerRewards": p.address}, ),
    setRewardMultiplier: fun("0x89e77896", "setRewardMultiplier(address,uint256)", {"rewardContract": p.address, "multiplier": p.uint256}, ),
    setTreasury: fun("0xf0f44260", "setTreasury(address)", {"_treasury": p.address}, ),
    setVote: fun("0xf85008a2", "setVote(bytes32)", {"_hash": p.bytes32}, p.bool),
    setVoteDelegate: fun("0x74874323", "setVoteDelegate(address)", {"_voteDelegate": p.address}, ),
    shutdownPool: fun("0x60cafe84", "shutdownPool(uint256)", {"_pid": p.uint256}, p.bool),
    shutdownSystem: fun("0x354af919", "shutdownSystem()", {}, ),
    staker: viewFun("0x5ebaf1db", "staker()", {}, p.address),
    stakerIncentive: viewFun("0x62d28ac7", "stakerIncentive()", {}, p.uint256),
    stakerRewards: viewFun("0xcfb9cfba", "stakerRewards()", {}, p.address),
    stashFactory: viewFun("0x068eb19e", "stashFactory()", {}, p.address),
    tokenFactory: viewFun("0xe77772fe", "tokenFactory()", {}, p.address),
    treasury: viewFun("0x61d027b3", "treasury()", {}, p.address),
    updateFeeInfo: fun("0x7e8df27a", "updateFeeInfo(address,bool)", {"_feeToken": p.address, "_active": p.bool}, ),
    vote: fun("0xe2cdd42a", "vote(uint256,address,bool)", {"_voteId": p.uint256, "_votingAddress": p.address, "_support": p.bool}, p.bool),
    voteDelegate: viewFun("0x9f00332b", "voteDelegate()", {}, p.address),
    voteGaugeWeight: fun("0xbfad96ba", "voteGaugeWeight(address[],uint256[])", {"_gauge": p.array(p.address), "_weight": p.array(p.uint256)}, p.bool),
    voteOwnership: viewFun("0xa386a080", "voteOwnership()", {}, p.address),
    voteParameter: viewFun("0xb42eda71", "voteParameter()", {}, p.address),
    withdraw: fun("0x441a3e70", "withdraw(uint256,uint256)", {"_pid": p.uint256, "_amount": p.uint256}, p.bool),
    withdrawAll: fun("0x958e2d31", "withdrawAll(uint256)", {"_pid": p.uint256}, p.bool),
    withdrawTo: fun("0x14cd70e4", "withdrawTo(uint256,uint256,address)", {"_pid": p.uint256, "_amount": p.uint256, "_to": p.address}, p.bool),
}

export class Contract extends ContractBase {

    FEE_DENOMINATOR() {
        return this.eth_call(functions.FEE_DENOMINATOR, {})
    }

    MaxFees() {
        return this.eth_call(functions.MaxFees, {})
    }

    REWARD_MULTIPLIER_DENOMINATOR() {
        return this.eth_call(functions.REWARD_MULTIPLIER_DENOMINATOR, {})
    }

    bridgeDelegate() {
        return this.eth_call(functions.bridgeDelegate, {})
    }

    crv() {
        return this.eth_call(functions.crv, {})
    }

    earmarkIncentive() {
        return this.eth_call(functions.earmarkIncentive, {})
    }

    feeManager() {
        return this.eth_call(functions.feeManager, {})
    }

    feeTokens(_0: FeeTokensParams["_0"]) {
        return this.eth_call(functions.feeTokens, {_0})
    }

    gaugeMap(_0: GaugeMapParams["_0"]) {
        return this.eth_call(functions.gaugeMap, {_0})
    }

    getRewardMultipliers(_0: GetRewardMultipliersParams["_0"]) {
        return this.eth_call(functions.getRewardMultipliers, {_0})
    }

    isShutdown() {
        return this.eth_call(functions.isShutdown, {})
    }

    l2FeesHistory(_0: L2FeesHistoryParams["_0"]) {
        return this.eth_call(functions.l2FeesHistory, {_0})
    }

    lockIncentive() {
        return this.eth_call(functions.lockIncentive, {})
    }

    lockRewards() {
        return this.eth_call(functions.lockRewards, {})
    }

    minter() {
        return this.eth_call(functions.minter, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    platformFee() {
        return this.eth_call(functions.platformFee, {})
    }

    poolInfo(_0: PoolInfoParams["_0"]) {
        return this.eth_call(functions.poolInfo, {_0})
    }

    poolLength() {
        return this.eth_call(functions.poolLength, {})
    }

    poolManager() {
        return this.eth_call(functions.poolManager, {})
    }

    rewardArbitrator() {
        return this.eth_call(functions.rewardArbitrator, {})
    }

    rewardFactory() {
        return this.eth_call(functions.rewardFactory, {})
    }

    staker() {
        return this.eth_call(functions.staker, {})
    }

    stakerIncentive() {
        return this.eth_call(functions.stakerIncentive, {})
    }

    stakerRewards() {
        return this.eth_call(functions.stakerRewards, {})
    }

    stashFactory() {
        return this.eth_call(functions.stashFactory, {})
    }

    tokenFactory() {
        return this.eth_call(functions.tokenFactory, {})
    }

    treasury() {
        return this.eth_call(functions.treasury, {})
    }

    voteDelegate() {
        return this.eth_call(functions.voteDelegate, {})
    }

    voteOwnership() {
        return this.eth_call(functions.voteOwnership, {})
    }

    voteParameter() {
        return this.eth_call(functions.voteParameter, {})
    }
}

/// Event types
export type ArbitratorUpdatedEventArgs = EParams<typeof events.ArbitratorUpdated>
export type DepositedEventArgs = EParams<typeof events.Deposited>
export type FactoriesUpdatedEventArgs = EParams<typeof events.FactoriesUpdated>
export type FeeInfoChangedEventArgs = EParams<typeof events.FeeInfoChanged>
export type FeeInfoUpdatedEventArgs = EParams<typeof events.FeeInfoUpdated>
export type FeeManagerUpdatedEventArgs = EParams<typeof events.FeeManagerUpdated>
export type FeesUpdatedEventArgs = EParams<typeof events.FeesUpdated>
export type OwnerUpdatedEventArgs = EParams<typeof events.OwnerUpdated>
export type PoolAddedEventArgs = EParams<typeof events.PoolAdded>
export type PoolManagerUpdatedEventArgs = EParams<typeof events.PoolManagerUpdated>
export type PoolShutdownEventArgs = EParams<typeof events.PoolShutdown>
export type RewardContractsUpdatedEventArgs = EParams<typeof events.RewardContractsUpdated>
export type TreasuryUpdatedEventArgs = EParams<typeof events.TreasuryUpdated>
export type VoteDelegateUpdatedEventArgs = EParams<typeof events.VoteDelegateUpdated>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type FEE_DENOMINATORParams = FunctionArguments<typeof functions.FEE_DENOMINATOR>
export type FEE_DENOMINATORReturn = FunctionReturn<typeof functions.FEE_DENOMINATOR>

export type MaxFeesParams = FunctionArguments<typeof functions.MaxFees>
export type MaxFeesReturn = FunctionReturn<typeof functions.MaxFees>

export type REWARD_MULTIPLIER_DENOMINATORParams = FunctionArguments<typeof functions.REWARD_MULTIPLIER_DENOMINATOR>
export type REWARD_MULTIPLIER_DENOMINATORReturn = FunctionReturn<typeof functions.REWARD_MULTIPLIER_DENOMINATOR>

export type AddPoolParams = FunctionArguments<typeof functions.addPool>
export type AddPoolReturn = FunctionReturn<typeof functions.addPool>

export type BridgeDelegateParams = FunctionArguments<typeof functions.bridgeDelegate>
export type BridgeDelegateReturn = FunctionReturn<typeof functions.bridgeDelegate>

export type ClaimRewardsParams = FunctionArguments<typeof functions.claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof functions.claimRewards>

export type CrvParams = FunctionArguments<typeof functions.crv>
export type CrvReturn = FunctionReturn<typeof functions.crv>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type DistributeL2FeesParams = FunctionArguments<typeof functions.distributeL2Fees>
export type DistributeL2FeesReturn = FunctionReturn<typeof functions.distributeL2Fees>

export type EarmarkFeesParams = FunctionArguments<typeof functions.earmarkFees>
export type EarmarkFeesReturn = FunctionReturn<typeof functions.earmarkFees>

export type EarmarkIncentiveParams = FunctionArguments<typeof functions.earmarkIncentive>
export type EarmarkIncentiveReturn = FunctionReturn<typeof functions.earmarkIncentive>

export type EarmarkRewardsParams = FunctionArguments<typeof functions.earmarkRewards>
export type EarmarkRewardsReturn = FunctionReturn<typeof functions.earmarkRewards>

export type FeeManagerParams = FunctionArguments<typeof functions.feeManager>
export type FeeManagerReturn = FunctionReturn<typeof functions.feeManager>

export type FeeTokensParams = FunctionArguments<typeof functions.feeTokens>
export type FeeTokensReturn = FunctionReturn<typeof functions.feeTokens>

export type GaugeMapParams = FunctionArguments<typeof functions.gaugeMap>
export type GaugeMapReturn = FunctionReturn<typeof functions.gaugeMap>

export type GetRewardMultipliersParams = FunctionArguments<typeof functions.getRewardMultipliers>
export type GetRewardMultipliersReturn = FunctionReturn<typeof functions.getRewardMultipliers>

export type IsShutdownParams = FunctionArguments<typeof functions.isShutdown>
export type IsShutdownReturn = FunctionReturn<typeof functions.isShutdown>

export type L2FeesHistoryParams = FunctionArguments<typeof functions.l2FeesHistory>
export type L2FeesHistoryReturn = FunctionReturn<typeof functions.l2FeesHistory>

export type LockIncentiveParams = FunctionArguments<typeof functions.lockIncentive>
export type LockIncentiveReturn = FunctionReturn<typeof functions.lockIncentive>

export type LockRewardsParams = FunctionArguments<typeof functions.lockRewards>
export type LockRewardsReturn = FunctionReturn<typeof functions.lockRewards>

export type MinterParams = FunctionArguments<typeof functions.minter>
export type MinterReturn = FunctionReturn<typeof functions.minter>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PlatformFeeParams = FunctionArguments<typeof functions.platformFee>
export type PlatformFeeReturn = FunctionReturn<typeof functions.platformFee>

export type PoolInfoParams = FunctionArguments<typeof functions.poolInfo>
export type PoolInfoReturn = FunctionReturn<typeof functions.poolInfo>

export type PoolLengthParams = FunctionArguments<typeof functions.poolLength>
export type PoolLengthReturn = FunctionReturn<typeof functions.poolLength>

export type PoolManagerParams = FunctionArguments<typeof functions.poolManager>
export type PoolManagerReturn = FunctionReturn<typeof functions.poolManager>

export type RewardArbitratorParams = FunctionArguments<typeof functions.rewardArbitrator>
export type RewardArbitratorReturn = FunctionReturn<typeof functions.rewardArbitrator>

export type RewardClaimedParams = FunctionArguments<typeof functions.rewardClaimed>
export type RewardClaimedReturn = FunctionReturn<typeof functions.rewardClaimed>

export type RewardFactoryParams = FunctionArguments<typeof functions.rewardFactory>
export type RewardFactoryReturn = FunctionReturn<typeof functions.rewardFactory>

export type SetArbitratorParams = FunctionArguments<typeof functions.setArbitrator>
export type SetArbitratorReturn = FunctionReturn<typeof functions.setArbitrator>

export type SetBridgeDelegateParams = FunctionArguments<typeof functions.setBridgeDelegate>
export type SetBridgeDelegateReturn = FunctionReturn<typeof functions.setBridgeDelegate>

export type SetDelegateParams = FunctionArguments<typeof functions.setDelegate>
export type SetDelegateReturn = FunctionReturn<typeof functions.setDelegate>

export type SetFactoriesParams = FunctionArguments<typeof functions.setFactories>
export type SetFactoriesReturn = FunctionReturn<typeof functions.setFactories>

export type SetFeeInfoParams = FunctionArguments<typeof functions.setFeeInfo>
export type SetFeeInfoReturn = FunctionReturn<typeof functions.setFeeInfo>

export type SetFeeManagerParams = FunctionArguments<typeof functions.setFeeManager>
export type SetFeeManagerReturn = FunctionReturn<typeof functions.setFeeManager>

export type SetFeesParams = FunctionArguments<typeof functions.setFees>
export type SetFeesReturn = FunctionReturn<typeof functions.setFees>

export type SetGaugeRedirectParams = FunctionArguments<typeof functions.setGaugeRedirect>
export type SetGaugeRedirectReturn = FunctionReturn<typeof functions.setGaugeRedirect>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type SetPoolManagerParams = FunctionArguments<typeof functions.setPoolManager>
export type SetPoolManagerReturn = FunctionReturn<typeof functions.setPoolManager>

export type SetRewardContractsParams = FunctionArguments<typeof functions.setRewardContracts>
export type SetRewardContractsReturn = FunctionReturn<typeof functions.setRewardContracts>

export type SetRewardMultiplierParams = FunctionArguments<typeof functions.setRewardMultiplier>
export type SetRewardMultiplierReturn = FunctionReturn<typeof functions.setRewardMultiplier>

export type SetTreasuryParams = FunctionArguments<typeof functions.setTreasury>
export type SetTreasuryReturn = FunctionReturn<typeof functions.setTreasury>

export type SetVoteParams = FunctionArguments<typeof functions.setVote>
export type SetVoteReturn = FunctionReturn<typeof functions.setVote>

export type SetVoteDelegateParams = FunctionArguments<typeof functions.setVoteDelegate>
export type SetVoteDelegateReturn = FunctionReturn<typeof functions.setVoteDelegate>

export type ShutdownPoolParams = FunctionArguments<typeof functions.shutdownPool>
export type ShutdownPoolReturn = FunctionReturn<typeof functions.shutdownPool>

export type ShutdownSystemParams = FunctionArguments<typeof functions.shutdownSystem>
export type ShutdownSystemReturn = FunctionReturn<typeof functions.shutdownSystem>

export type StakerParams = FunctionArguments<typeof functions.staker>
export type StakerReturn = FunctionReturn<typeof functions.staker>

export type StakerIncentiveParams = FunctionArguments<typeof functions.stakerIncentive>
export type StakerIncentiveReturn = FunctionReturn<typeof functions.stakerIncentive>

export type StakerRewardsParams = FunctionArguments<typeof functions.stakerRewards>
export type StakerRewardsReturn = FunctionReturn<typeof functions.stakerRewards>

export type StashFactoryParams = FunctionArguments<typeof functions.stashFactory>
export type StashFactoryReturn = FunctionReturn<typeof functions.stashFactory>

export type TokenFactoryParams = FunctionArguments<typeof functions.tokenFactory>
export type TokenFactoryReturn = FunctionReturn<typeof functions.tokenFactory>

export type TreasuryParams = FunctionArguments<typeof functions.treasury>
export type TreasuryReturn = FunctionReturn<typeof functions.treasury>

export type UpdateFeeInfoParams = FunctionArguments<typeof functions.updateFeeInfo>
export type UpdateFeeInfoReturn = FunctionReturn<typeof functions.updateFeeInfo>

export type VoteParams = FunctionArguments<typeof functions.vote>
export type VoteReturn = FunctionReturn<typeof functions.vote>

export type VoteDelegateParams = FunctionArguments<typeof functions.voteDelegate>
export type VoteDelegateReturn = FunctionReturn<typeof functions.voteDelegate>

export type VoteGaugeWeightParams = FunctionArguments<typeof functions.voteGaugeWeight>
export type VoteGaugeWeightReturn = FunctionReturn<typeof functions.voteGaugeWeight>

export type VoteOwnershipParams = FunctionArguments<typeof functions.voteOwnership>
export type VoteOwnershipReturn = FunctionReturn<typeof functions.voteOwnership>

export type VoteParameterParams = FunctionArguments<typeof functions.voteParameter>
export type VoteParameterReturn = FunctionReturn<typeof functions.voteParameter>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawAllParams = FunctionArguments<typeof functions.withdrawAll>
export type WithdrawAllReturn = FunctionReturn<typeof functions.withdrawAll>

export type WithdrawToParams = FunctionArguments<typeof functions.withdrawTo>
export type WithdrawToReturn = FunctionReturn<typeof functions.withdrawTo>

