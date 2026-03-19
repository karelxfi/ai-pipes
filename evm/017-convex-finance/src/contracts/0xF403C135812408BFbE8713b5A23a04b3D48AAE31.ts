import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'
import { ContractBase, event, fun, indexed, viewFun } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'

export const events = {
  Deposited: event(
    '0x73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca',
    'Deposited(address,uint256,uint256)',
    { user: indexed(p.address), poolid: indexed(p.uint256), amount: p.uint256 },
  ),
  Withdrawn: event(
    '0x92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc6',
    'Withdrawn(address,uint256,uint256)',
    { user: indexed(p.address), poolid: indexed(p.uint256), amount: p.uint256 },
  ),
}

export const functions = {
  FEE_DENOMINATOR: viewFun('0xd73792a9', 'FEE_DENOMINATOR()', {}, p.uint256),
  MaxFees: viewFun('0x7303df9a', 'MaxFees()', {}, p.uint256),
  addPool: fun(
    '0x7e29d6c2',
    'addPool(address,address,uint256)',
    { _lptoken: p.address, _gauge: p.address, _stashVersion: p.uint256 },
    p.bool,
  ),
  claimRewards: fun('0x6c7b69cb', 'claimRewards(uint256,address)', { _pid: p.uint256, _gauge: p.address }, p.bool),
  crv: viewFun('0x6a4874a1', 'crv()', {}, p.address),
  deposit: fun(
    '0x43a0d066',
    'deposit(uint256,uint256,bool)',
    { _pid: p.uint256, _amount: p.uint256, _stake: p.bool },
    p.bool,
  ),
  depositAll: fun('0x60759fce', 'depositAll(uint256,bool)', { _pid: p.uint256, _stake: p.bool }, p.bool),
  distributionAddressId: viewFun('0x93e846a0', 'distributionAddressId()', {}, p.uint256),
  earmarkFees: fun('0x22230b96', 'earmarkFees()', {}, p.bool),
  earmarkIncentive: viewFun('0x3a088cd2', 'earmarkIncentive()', {}, p.uint256),
  earmarkRewards: fun('0xcc956f3f', 'earmarkRewards(uint256)', { _pid: p.uint256 }, p.bool),
  feeDistro: viewFun('0xd6a0f530', 'feeDistro()', {}, p.address),
  feeManager: viewFun('0xd0fb0203', 'feeManager()', {}, p.address),
  feeToken: viewFun('0x647846a5', 'feeToken()', {}, p.address),
  gaugeMap: viewFun('0xcb0d5b52', 'gaugeMap(address)', { _0: p.address }, p.bool),
  isShutdown: viewFun('0xbf86d690', 'isShutdown()', {}, p.bool),
  lockFees: viewFun('0xab366292', 'lockFees()', {}, p.address),
  lockIncentive: viewFun('0x50940618', 'lockIncentive()', {}, p.uint256),
  lockRewards: viewFun('0x376d771a', 'lockRewards()', {}, p.address),
  minter: viewFun('0x07546172', 'minter()', {}, p.address),
  owner: viewFun('0x8da5cb5b', 'owner()', {}, p.address),
  platformFee: viewFun('0x26232a2e', 'platformFee()', {}, p.uint256),
  poolInfo: viewFun(
    '0x1526fe27',
    'poolInfo(uint256)',
    { _0: p.uint256 },
    {
      lptoken: p.address,
      token: p.address,
      gauge: p.address,
      crvRewards: p.address,
      stash: p.address,
      shutdown: p.bool,
    },
  ),
  poolLength: viewFun('0x081e3eda', 'poolLength()', {}, p.uint256),
  poolManager: viewFun('0xdc4c90d3', 'poolManager()', {}, p.address),
  registry: viewFun('0x7b103999', 'registry()', {}, p.address),
  rewardArbitrator: viewFun('0x043b684a', 'rewardArbitrator()', {}, p.address),
  rewardClaimed: fun(
    '0x71192b17',
    'rewardClaimed(uint256,address,uint256)',
    { _pid: p.uint256, _address: p.address, _amount: p.uint256 },
    p.bool,
  ),
  rewardFactory: viewFun('0x245e4bf0', 'rewardFactory()', {}, p.address),
  setArbitrator: fun('0xb0eefabe', 'setArbitrator(address)', { _arb: p.address }),
  setFactories: fun('0x7bd3b995', 'setFactories(address,address,address)', {
    _rfactory: p.address,
    _sfactory: p.address,
    _tfactory: p.address,
  }),
  setFeeInfo: fun('0x5a4ae5ca', 'setFeeInfo()', {}),
  setFeeManager: fun('0x472d35b9', 'setFeeManager(address)', { _feeM: p.address }),
  setFees: fun('0x6fcba377', 'setFees(uint256,uint256,uint256,uint256)', {
    _lockFees: p.uint256,
    _stakerFees: p.uint256,
    _callerFees: p.uint256,
    _platform: p.uint256,
  }),
  setGaugeRedirect: fun('0x9123d404', 'setGaugeRedirect(uint256)', { _pid: p.uint256 }, p.bool),
  setOwner: fun('0x13af4035', 'setOwner(address)', { _owner: p.address }),
  setPoolManager: fun('0x7aef6715', 'setPoolManager(address)', { _poolM: p.address }),
  setRewardContracts: fun('0x95539a1d', 'setRewardContracts(address,address)', {
    _rewards: p.address,
    _stakerRewards: p.address,
  }),
  setTreasury: fun('0xf0f44260', 'setTreasury(address)', { _treasury: p.address }),
  setVoteDelegate: fun('0x74874323', 'setVoteDelegate(address)', { _voteDelegate: p.address }),
  shutdownPool: fun('0x60cafe84', 'shutdownPool(uint256)', { _pid: p.uint256 }, p.bool),
  shutdownSystem: fun('0x354af919', 'shutdownSystem()', {}),
  staker: viewFun('0x5ebaf1db', 'staker()', {}, p.address),
  stakerIncentive: viewFun('0x62d28ac7', 'stakerIncentive()', {}, p.uint256),
  stakerRewards: viewFun('0xcfb9cfba', 'stakerRewards()', {}, p.address),
  stashFactory: viewFun('0x068eb19e', 'stashFactory()', {}, p.address),
  tokenFactory: viewFun('0xe77772fe', 'tokenFactory()', {}, p.address),
  treasury: viewFun('0x61d027b3', 'treasury()', {}, p.address),
  vote: fun(
    '0xe2cdd42a',
    'vote(uint256,address,bool)',
    { _voteId: p.uint256, _votingAddress: p.address, _support: p.bool },
    p.bool,
  ),
  voteDelegate: viewFun('0x9f00332b', 'voteDelegate()', {}, p.address),
  voteGaugeWeight: fun(
    '0xbfad96ba',
    'voteGaugeWeight(address[],uint256[])',
    { _gauge: p.array(p.address), _weight: p.array(p.uint256) },
    p.bool,
  ),
  voteOwnership: viewFun('0xa386a080', 'voteOwnership()', {}, p.address),
  voteParameter: viewFun('0xb42eda71', 'voteParameter()', {}, p.address),
  withdraw: fun('0x441a3e70', 'withdraw(uint256,uint256)', { _pid: p.uint256, _amount: p.uint256 }, p.bool),
  withdrawAll: fun('0x958e2d31', 'withdrawAll(uint256)', { _pid: p.uint256 }, p.bool),
  withdrawTo: fun(
    '0x14cd70e4',
    'withdrawTo(uint256,uint256,address)',
    { _pid: p.uint256, _amount: p.uint256, _to: p.address },
    p.bool,
  ),
}

export class Contract extends ContractBase {
  FEE_DENOMINATOR() {
    return this.eth_call(functions.FEE_DENOMINATOR, {})
  }

  MaxFees() {
    return this.eth_call(functions.MaxFees, {})
  }

  crv() {
    return this.eth_call(functions.crv, {})
  }

  distributionAddressId() {
    return this.eth_call(functions.distributionAddressId, {})
  }

  earmarkIncentive() {
    return this.eth_call(functions.earmarkIncentive, {})
  }

  feeDistro() {
    return this.eth_call(functions.feeDistro, {})
  }

  feeManager() {
    return this.eth_call(functions.feeManager, {})
  }

  feeToken() {
    return this.eth_call(functions.feeToken, {})
  }

  gaugeMap(_0: GaugeMapParams['_0']) {
    return this.eth_call(functions.gaugeMap, { _0 })
  }

  isShutdown() {
    return this.eth_call(functions.isShutdown, {})
  }

  lockFees() {
    return this.eth_call(functions.lockFees, {})
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

  poolInfo(_0: PoolInfoParams['_0']) {
    return this.eth_call(functions.poolInfo, { _0 })
  }

  poolLength() {
    return this.eth_call(functions.poolLength, {})
  }

  poolManager() {
    return this.eth_call(functions.poolManager, {})
  }

  registry() {
    return this.eth_call(functions.registry, {})
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
export type DepositedEventArgs = EParams<typeof events.Deposited>
export type WithdrawnEventArgs = EParams<typeof events.Withdrawn>

/// Function types
export type FEE_DENOMINATORParams = FunctionArguments<typeof functions.FEE_DENOMINATOR>
export type FEE_DENOMINATORReturn = FunctionReturn<typeof functions.FEE_DENOMINATOR>

export type MaxFeesParams = FunctionArguments<typeof functions.MaxFees>
export type MaxFeesReturn = FunctionReturn<typeof functions.MaxFees>

export type AddPoolParams = FunctionArguments<typeof functions.addPool>
export type AddPoolReturn = FunctionReturn<typeof functions.addPool>

export type ClaimRewardsParams = FunctionArguments<typeof functions.claimRewards>
export type ClaimRewardsReturn = FunctionReturn<typeof functions.claimRewards>

export type CrvParams = FunctionArguments<typeof functions.crv>
export type CrvReturn = FunctionReturn<typeof functions.crv>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type DepositAllParams = FunctionArguments<typeof functions.depositAll>
export type DepositAllReturn = FunctionReturn<typeof functions.depositAll>

export type DistributionAddressIdParams = FunctionArguments<typeof functions.distributionAddressId>
export type DistributionAddressIdReturn = FunctionReturn<typeof functions.distributionAddressId>

export type EarmarkFeesParams = FunctionArguments<typeof functions.earmarkFees>
export type EarmarkFeesReturn = FunctionReturn<typeof functions.earmarkFees>

export type EarmarkIncentiveParams = FunctionArguments<typeof functions.earmarkIncentive>
export type EarmarkIncentiveReturn = FunctionReturn<typeof functions.earmarkIncentive>

export type EarmarkRewardsParams = FunctionArguments<typeof functions.earmarkRewards>
export type EarmarkRewardsReturn = FunctionReturn<typeof functions.earmarkRewards>

export type FeeDistroParams = FunctionArguments<typeof functions.feeDistro>
export type FeeDistroReturn = FunctionReturn<typeof functions.feeDistro>

export type FeeManagerParams = FunctionArguments<typeof functions.feeManager>
export type FeeManagerReturn = FunctionReturn<typeof functions.feeManager>

export type FeeTokenParams = FunctionArguments<typeof functions.feeToken>
export type FeeTokenReturn = FunctionReturn<typeof functions.feeToken>

export type GaugeMapParams = FunctionArguments<typeof functions.gaugeMap>
export type GaugeMapReturn = FunctionReturn<typeof functions.gaugeMap>

export type IsShutdownParams = FunctionArguments<typeof functions.isShutdown>
export type IsShutdownReturn = FunctionReturn<typeof functions.isShutdown>

export type LockFeesParams = FunctionArguments<typeof functions.lockFees>
export type LockFeesReturn = FunctionReturn<typeof functions.lockFees>

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

export type RegistryParams = FunctionArguments<typeof functions.registry>
export type RegistryReturn = FunctionReturn<typeof functions.registry>

export type RewardArbitratorParams = FunctionArguments<typeof functions.rewardArbitrator>
export type RewardArbitratorReturn = FunctionReturn<typeof functions.rewardArbitrator>

export type RewardClaimedParams = FunctionArguments<typeof functions.rewardClaimed>
export type RewardClaimedReturn = FunctionReturn<typeof functions.rewardClaimed>

export type RewardFactoryParams = FunctionArguments<typeof functions.rewardFactory>
export type RewardFactoryReturn = FunctionReturn<typeof functions.rewardFactory>

export type SetArbitratorParams = FunctionArguments<typeof functions.setArbitrator>
export type SetArbitratorReturn = FunctionReturn<typeof functions.setArbitrator>

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

export type SetTreasuryParams = FunctionArguments<typeof functions.setTreasury>
export type SetTreasuryReturn = FunctionReturn<typeof functions.setTreasury>

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
