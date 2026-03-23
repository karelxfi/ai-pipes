import {Codec, address, array, bool, struct, u128, u16, u64, u8} from '@subsquid/borsh'

export interface AddressBool {
    addr: string
    value: boolean
}

export const AddressBool: Codec<AddressBool> = struct({
    addr: address,
    value: bool,
})

export interface Lending {
    mint: string
    fTokenMint: string
    lendingId: number
    decimals: number
    rewardsRateModel: string
    liquidityExchangePrice: bigint
    tokenExchangePrice: bigint
    lastUpdateTimestamp: bigint
    tokenReservesLiquidity: string
    supplyPositionOnLiquidity: string
    bump: number
}

export const Lending: Codec<Lending> = struct({
    mint: address,
    fTokenMint: address,
    lendingId: u16,
    decimals: u8,
    rewardsRateModel: address,
    liquidityExchangePrice: u64,
    tokenExchangePrice: u64,
    lastUpdateTimestamp: u64,
    tokenReservesLiquidity: address,
    supplyPositionOnLiquidity: address,
    bump: u8,
})

export interface LendingAdmin {
    authority: string
    liquidityProgram: string
    rebalancer: string
    nextLendingId: number
    auths: Array<string>
    bump: number
}

export const LendingAdmin: Codec<LendingAdmin> = struct({
    authority: address,
    liquidityProgram: address,
    rebalancer: address,
    nextLendingId: u16,
    auths: array(address),
    bump: u8,
})

export interface LendingRewardsRateModel {
    mint: string
    startTvl: bigint
    duration: bigint
    startTime: bigint
    yearlyReward: bigint
    nextDuration: bigint
    nextRewardAmount: bigint
    bump: number
}

export const LendingRewardsRateModel: Codec<LendingRewardsRateModel> = struct({
    mint: address,
    startTvl: u64,
    duration: u64,
    startTime: u64,
    yearlyReward: u64,
    nextDuration: u64,
    nextRewardAmount: u64,
    bump: u8,
})

export interface LogDeposit {
    sender: string
    receiver: string
    assets: bigint
    sharesMinted: bigint
}

export const LogDeposit: Codec<LogDeposit> = struct({
    sender: address,
    receiver: address,
    assets: u64,
    sharesMinted: u64,
})

export interface LogRebalance {
    assets: bigint
}

export const LogRebalance: Codec<LogRebalance> = struct({
    assets: u64,
})

export interface LogUpdateAuthority {
    newAuthority: string
}

export const LogUpdateAuthority: Codec<LogUpdateAuthority> = struct({
    newAuthority: address,
})

export interface LogUpdateAuths {
    authStatus: Array<AddressBool>
}

export const LogUpdateAuths: Codec<LogUpdateAuths> = struct({
    authStatus: array(AddressBool),
})

export interface LogUpdateRates {
    tokenExchangePrice: bigint
    liquidityExchangePrice: bigint
}

export const LogUpdateRates: Codec<LogUpdateRates> = struct({
    tokenExchangePrice: u64,
    liquidityExchangePrice: u64,
})

export interface LogUpdateRebalancer {
    newRebalancer: string
}

export const LogUpdateRebalancer: Codec<LogUpdateRebalancer> = struct({
    newRebalancer: address,
})

export interface LogUpdateRewards {
    rewardsRateModel: string
}

export const LogUpdateRewards: Codec<LogUpdateRewards> = struct({
    rewardsRateModel: address,
})

export interface LogWithdraw {
    sender: string
    receiver: string
    owner: string
    assets: bigint
    sharesBurned: bigint
}

export const LogWithdraw: Codec<LogWithdraw> = struct({
    sender: address,
    receiver: address,
    owner: address,
    assets: u64,
    sharesBurned: u64,
})

/**
 * Token configuration and exchange prices
 */
export interface TokenReserve {
    mint: string
    vault: string
    borrowRate: number
    feeOnInterest: number
    lastUtilization: number
    lastUpdateTimestamp: bigint
    supplyExchangePrice: bigint
    borrowExchangePrice: bigint
    maxUtilization: number
    totalSupplyWithInterest: bigint
    totalSupplyInterestFree: bigint
    totalBorrowWithInterest: bigint
    totalBorrowInterestFree: bigint
    totalClaimAmount: bigint
    interactingProtocol: string
    interactingTimestamp: bigint
    interactingBalance: bigint
}

/**
 * Token configuration and exchange prices
 */
export const TokenReserve: Codec<TokenReserve> = struct({
    mint: address,
    vault: address,
    borrowRate: u16,
    feeOnInterest: u16,
    lastUtilization: u16,
    lastUpdateTimestamp: u64,
    supplyExchangePrice: u64,
    borrowExchangePrice: u64,
    maxUtilization: u16,
    totalSupplyWithInterest: u64,
    totalSupplyInterestFree: u64,
    totalBorrowWithInterest: u64,
    totalBorrowInterestFree: u64,
    totalClaimAmount: u64,
    interactingProtocol: address,
    interactingTimestamp: u64,
    interactingBalance: u64,
})

/**
 * User supply position
 */
export interface UserSupplyPosition {
    protocol: string
    mint: string
    withInterest: number
    amount: bigint
    withdrawalLimit: bigint
    lastUpdate: bigint
    expandPct: number
    expandDuration: bigint
    baseWithdrawalLimit: bigint
    status: number
}

/**
 * User supply position
 */
export const UserSupplyPosition: Codec<UserSupplyPosition> = struct({
    protocol: address,
    mint: address,
    withInterest: u8,
    amount: u64,
    withdrawalLimit: u128,
    lastUpdate: u64,
    expandPct: u16,
    expandDuration: u64,
    baseWithdrawalLimit: u64,
    status: u8,
})
